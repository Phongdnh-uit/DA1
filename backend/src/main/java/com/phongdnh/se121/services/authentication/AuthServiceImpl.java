package com.phongdnh.se121.services.authentication;

import com.phongdnh.se121.constants.ErrorMessageConstants;
import com.phongdnh.se121.constants.RedisKey;
import com.phongdnh.se121.dtos.authentication.BaseUserRequest;
import com.phongdnh.se121.dtos.authentication.ChangePasswordRequest;
import com.phongdnh.se121.dtos.authentication.LoginRequest;
import com.phongdnh.se121.dtos.authentication.LoginResponse;
import com.phongdnh.se121.dtos.authentication.RefreshTokenRequest;
import com.phongdnh.se121.dtos.authentication.RegisterRequest;
import com.phongdnh.se121.dtos.authentication.ResetPasswordRequest;
import com.phongdnh.se121.dtos.authentication.SendOtpRequest;
import com.phongdnh.se121.dtos.authentication.SendOtpResponse;
import com.phongdnh.se121.dtos.authentication.UserResponse;
import com.phongdnh.se121.dtos.authentication.VerifyEmailRequest;
import com.phongdnh.se121.dtos.authentication.VerifyOtpRequest;
import com.phongdnh.se121.dtos.authentication.VerifyOtpResponse;
import com.phongdnh.se121.entities.authentication.LinkedAccount;
import com.phongdnh.se121.entities.authentication.RefreshToken;
import com.phongdnh.se121.entities.authentication.User;
import com.phongdnh.se121.entities.authentication.Verification;
import com.phongdnh.se121.entities.authorization.Permission;
import com.phongdnh.se121.enums.authentication.OtpChannel;
import com.phongdnh.se121.enums.authentication.OtpPurpose;
import com.phongdnh.se121.enums.authentication.UserStatus;
import com.phongdnh.se121.enums.authentication.VerificationType;
import com.phongdnh.se121.enums.general.ContactType;
import com.phongdnh.se121.enums.general.FilePurpose;
import com.phongdnh.se121.enums.general.FileUsageStatus;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.mappers.authentication.UserMapper;
import com.phongdnh.se121.repositories.authentication.LinkedAccountRepository;
import com.phongdnh.se121.repositories.authentication.UserRepository;
import com.phongdnh.se121.repositories.authorization.PermissionRepository;
import com.phongdnh.se121.repositories.authorization.RoleRepository;
import com.phongdnh.se121.repositories.general.FileRepository;
import com.phongdnh.se121.securities.SecurityUtil;
import com.phongdnh.se121.securities.TokenProvider;
import com.phongdnh.se121.services.bot.TelegramBot;
import com.phongdnh.se121.services.general.MailService;
import com.phongdnh.se121.utils.OtpGenerator;
import com.phongdnh.se121.utils.ValidationUtil;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DigestUtils;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {
  private final AuthenticationManagerBuilder authenticationManagerBuilder;
  private final UserRepository userRepository;
  private final TokenProvider tokenProvider;
  private final RefreshTokenService refreshTokenService;
  private final VerificationService verificationService;
  private final RedisTemplate<Object, Object> redisTemplate;
  private final PasswordEncoder passwordEncoder;
  private final MailService mailService;
  private final UserMapper userMapper;
  private final RoleRepository roleRepository;
  private final PermissionRepository permissionRepository;
  private final FileRepository fileRepository;
  private final TelegramBot telegramBot;
  private final LinkedAccountRepository linkedAccountRepository;

  // private final SMSService smsService;

  // ============================ LOGIN ============================
  @Override
  public LoginResponse login(LoginRequest request) {
    // 1. ---- Authenticate ----
    UsernamePasswordAuthenticationToken authenticationToken =
        new UsernamePasswordAuthenticationToken(request.getCredential(), request.getPassword());
    Authentication authentication =
        authenticationManagerBuilder.getObject().authenticate(authenticationToken);

    // 2. ---- Set to security holder  ----
    SecurityContextHolder.getContext().setAuthentication(authentication);

    // 3. ---- Generate JWT ----
    Long userId = SecurityUtil.getCurrentUserId();
    String jwt = tokenProvider.generateAccessToken(userId);
    String refreshToken = refreshTokenService.createRefreshToken(userId).getToken();

    // 4. ---- Response ----
    LoginResponse response = new LoginResponse();
    response.setAccessToken(jwt);
    response.setRefreshToken(refreshToken);
    return response;
  }

  // ============================ SEND OTP ============================
  @Override
  public SendOtpResponse sendOtp(SendOtpRequest request) {
    // 1. ---- Validate destination ----
    ContactType type = ValidationUtil.detectContact(request.getDestination());
    if (type == ContactType.UNKNOWN) {
      throw new ApiException(
          ErrorCode.VALIDATION_ERROR, Map.of("destination", "Invalid email or phone number"));
    }
    // Additional validations based on purpose can be added here
    switch (request.getPurpose()) {
      case REGISTRATION:
        // Check if user already exists
        boolean exists =
            switch (type) {
              case EMAIL ->
                  userRepository.exists(
                      (root, _, builder) ->
                          builder.equal(root.get("email"), request.getDestination()));
              case PHONE ->
                  userRepository.exists(
                      (root, _, builder) ->
                          builder.equal(root.get("phone"), request.getDestination()));
              default -> false;
            };
        if (exists) {
          throw new ApiException(
              ErrorCode.VALIDATION_ERROR,
              Map.of("destination", ErrorMessageConstants.AUTH_USER_ALREADY_EXISTS));
        }
        break;
      default:
        // No additional checks for other purposes
    }

    // 2. ---- Generate OTP ----
    String otp = OtpGenerator.generateNumericOtp(6);

    // 3. ---- Store OTP in redis ----
    String key =
        "OTP_"
            + request.getPurpose()
            + "_"
            + DigestUtils.sha1DigestAsHex(request.getDestination()); // e.g., OTP_REGISTER_email
    redisTemplate.opsForValue().set(key, otp, 5, TimeUnit.MINUTES);

    // 4. ---- Response ----
    SendOtpResponse response = new SendOtpResponse();
    response.setExpiresIn(300); // 5 minutes
    response.setResendAfter(60); // 1 minute

    // If channel is AUTO, set based on destination type
    response.setChannel(type == ContactType.EMAIL ? OtpChannel.EMAIL : OtpChannel.SMS);

    // Mask destination
    String masked = "";
    if (type == ContactType.EMAIL) {
      String[] parts = request.getDestination().split("@");
      String localPart = parts[0];
      String domainPart = parts[1];
      if (localPart.length() <= 2) {
        masked = localPart.charAt(0) + "*****" + "@" + domainPart;
      } else {
        masked =
            localPart.charAt(0)
                + "*****"
                + localPart.charAt(localPart.length() - 1)
                + "@"
                + domainPart;
      }
    } else {
      masked = "******" + request.getDestination().substring(request.getDestination().length() - 2);
    }

    response.setMaskedDestination(masked);

    // 4. ---- Send OTP via channel ----
    // In real-world application, you should send the OTP to user's email or phone number
    switch (response.getChannel()) {
      case EMAIL:
        mailService.sendOTPCodeEmail(request.getDestination(), otp);
        break;
      case SMS:
        // SMSRequest smsRequest = new SMSRequest();
        // smsRequest.setPhoneNumber(request.getDestination());
        // smsRequest.setMessage("Ma OTP cho UITLAND là: " + otp + ". Ma co hieu luc trong 5
        // phut.");

        // Luồng này sẽ thay bằng Telegram do không có dịch vụ SMS miễn phí
        // Cần tách hẳn 2 luồng lúc mới đăng ký và sau khi đã giao tiếp với Telegram bot rồi thì cần
        // lưu vào LinkedAccount để dùng cho các OTP Purpose khác
        if (request.getPurpose() == OtpPurpose.REGISTRATION) {

          String formatedPhone = ValidationUtil.formatPhoneToE164(request.getDestination(), "VN");
          if (formatedPhone == null) {
            throw new ApiException(
                ErrorCode.VALIDATION_ERROR,
                Map.of("destination", ErrorMessageConstants.NOT_INTERACTIVE_TELEGRAM_PHONE));
          }
          // Lưu key dạng 84XXXX nên cần bỏ dấu '+'
          formatedPhone = formatedPhone.substring(1); // Remove '+' sign
          String chatId =
              Optional.ofNullable(
                      redisTemplate.opsForValue().get(RedisKey.TELEGRAM_PHONE_KEY + formatedPhone))
                  .orElseThrow(
                      () ->
                          new ApiException(
                              ErrorCode.VALIDATION_ERROR,
                              Map.of(
                                  "destination",
                                  ErrorMessageConstants.NOT_INTERACTIVE_TELEGRAM_PHONE)))
                  .toString();
          telegramBot.sendMessage(
              chatId, "Ma OTP cho UITLAND la: " + otp + ". Ma co hieu luc trong 5 phut.");
        } else {
          var linkedAccount =
              linkedAccountRepository.findOne(
                  (root, _, builder) ->
                      builder.and(
                          builder.equal(root.get("user").get("phone"), request.getDestination()),
                          builder.equal(root.get("provider"), "TELEGRAM")));
          if (linkedAccount.isEmpty()) {
            throw new ApiException(
                ErrorCode.RESOURCE_NOT_FOUND,
                Map.of("destination", ErrorMessageConstants.NOT_INTERACTIVE_TELEGRAM_PHONE));
          }
          telegramBot.sendMessage(
              linkedAccount.get().getProviderUserId(),
              "Ma OTP cho UITLAND la: " + otp + ". Ma co hieu luc trong 5 phut.");
        }
        break;
      default:
        throw new UnsupportedOperationException("Unsupported OTP channel");
    }
    System.out.println("OTP for " + request.getDestination() + " is: " + otp);
    return response;
  }

  // ============================ VERIFY OTP ============================
  @Override
  public VerifyOtpResponse verifyOtp(VerifyOtpRequest request) {
    // 1. ---- Validate destination ----
    ContactType type = ValidationUtil.detectContact(request.getDestination());
    if (type == ContactType.UNKNOWN) {
      throw new ApiException(
          ErrorCode.VALIDATION_ERROR,
          Map.of("destination", ErrorMessageConstants.VALIDATION_EMAIL_OR_PHONE_INVALID));
    }

    // 2. ---- Validate OTP ----
    String key =
        "OTP_" + request.getPurpose() + "_" + DigestUtils.sha1DigestAsHex(request.getDestination());
    String cachedOtp = (String) redisTemplate.opsForValue().get(key);
    if (cachedOtp == null) {
      throw new ApiException(ErrorCode.OTP_EXPIRED);
    }
    if (!cachedOtp.equals(request.getOtp())) {
      throw new ApiException(ErrorCode.OTP_INVALID);
    }

    // 3. ---- Generate verification token ----
    VerifyOtpResponse response = new VerifyOtpResponse();
    String code = null;
    switch (request.getPurpose()) {
      case REGISTRATION:
        code = UUID.randomUUID().toString();
        redisTemplate
            .opsForValue()
            .set("REGISTRATION_" + code, request.getDestination(), 15, TimeUnit.MINUTES);
        break;
      case PASSWORD_RESET:
        User user =
            switch (type) {
              case EMAIL ->
                  userRepository
                      .findOne(
                          (root, _, builder) ->
                              builder.equal(root.get("email"), request.getDestination()))
                      .orElseThrow(() -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND));
              case PHONE ->
                  userRepository
                      .findOne(
                          (root, _, builder) ->
                              builder.equal(root.get("phone"), request.getDestination()))
                      .orElseThrow(() -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND));
              default -> throw new UnsupportedOperationException("Unsupported contact type");
            };
        code =
            verificationService.generateVerificationCode(
                VerificationType.PASSWORD_RESET, 900, user.getId());
        break;
      default:
        throw new UnsupportedOperationException("Unsupported verification purpose");
    }
    response.setPurpose(request.getPurpose());
    response.setVerificationToken(code);

    // 3. ---- Clean up ----
    redisTemplate.delete(key);
    return response;
  }

  // ============================ REGISTER USER ============================
  @Override
  public UserResponse register(RegisterRequest request) {
    String cachedPhone =
        (String) redisTemplate.opsForValue().get("REGISTRATION_" + request.getVerificationToken());
    if (cachedPhone == null) {
      throw new ApiException(ErrorCode.VERIFICATION_CODE_INVALID);
    }
    // Validate if email
    boolean emailExists =
        userRepository.exists(
            (root, _, builder) -> builder.equal(root.get("email"), request.getEmail()));
    if (emailExists) {
      throw new ApiException(
          ErrorCode.VALIDATION_ERROR, Map.of("email", "Email is already in use"));
    }
    User user = new User();
    user.setFullName(request.getFullName());
    user.setEmail(request.getEmail());
    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
    user.setPhone(cachedPhone);
    user.setPhoneVerified(true);
    user.setStatus(UserStatus.UNVERIFIED);
    user.setRole(
        roleRepository
            .findOne((root, _, builder) -> builder.equal(root.get("isDefault"), true))
            .orElseThrow(
                () ->
                    new ApiException(
                        ErrorCode.INTERNAL_SERVER_ERROR,
                        ErrorMessageConstants.ROLE_DEFAULT_NOT_FOUND)));
    user = userRepository.save(user);
    LinkedAccount linkedAccount = new LinkedAccount();
    linkedAccount.setUser(user);
    linkedAccount.setProvider("TELEGRAM"); // Trễ deadline nên tạm hardcode
    String telegramUserId =
        redisTemplate
            .opsForValue()
            .get(
                RedisKey.TELEGRAM_PHONE_KEY
                    + ValidationUtil.formatPhoneToE164(cachedPhone, "VN").substring(1))
            .toString();
    if (telegramUserId == null) {
      throw new ApiException(
          ErrorCode.VALIDATION_ERROR,
          Map.of("destination", ErrorMessageConstants.NOT_INTERACTIVE_TELEGRAM_PHONE));
    }
    linkedAccount.setProviderUserId(telegramUserId);
    linkedAccountRepository.save(linkedAccount);
    mailService.sendActivationEmail(
        request.getEmail(),
        verificationService.generateVerificationCode(
            VerificationType.EMAIL_ACTIVATION, 86400, user.getId()));
    return userMapper.entityToResponse(user);
  }

  // ============================ VERIFY EMAIL ============================
  @Override
  public void verifyEmail(VerifyEmailRequest request) {
    Verification verification =
        verificationService.verifyCode(VerificationType.EMAIL_ACTIVATION, request.getCode());
    User user = userRepository.findById(verification.getUserId()).orElseThrow();
    user.setEmailVerified(true);
    user.setStatus(UserStatus.ACTIVE);
    userRepository.save(user);
  }

  // ============================ RESET PASSWORD ============================
  @Override
  public void resetPassword(ResetPasswordRequest request) {
    // 1. ---- Validate code ----
    Verification verification =
        verificationService.verifyCode(
            VerificationType.PASSWORD_RESET, request.getVerificationCode());
    User user =
        userRepository
            .findById(verification.getUserId())
            .orElseThrow(() -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND));

    // 2. ---- Update password ----
    user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);
  }

  // ============================ REFRESH TOKEN ============================

  @Override
  public LoginResponse refreshToken(RefreshTokenRequest request) {
    RefreshToken refreshToken = refreshTokenService.findByToken(request.getRefreshToken());
    refreshTokenService.verify(refreshToken);
    Long userId = refreshToken.getUserId();
    String jwt = tokenProvider.generateAccessToken(userId);
    String newRefreshToken = refreshTokenService.createRefreshToken(userId).getToken();
    refreshTokenService.delete(refreshToken);
    LoginResponse response = new LoginResponse();
    response.setAccessToken(jwt);
    response.setRefreshToken(newRefreshToken);
    return response;
  }

  // ============================ LOGOUT ============================
  @Override
  public void logout(RefreshTokenRequest request) {
    RefreshToken refreshToken = refreshTokenService.findByToken(request.getRefreshToken());
    refreshTokenService.delete(refreshToken);
  }

  // ============================ CURRENT USER ============================

  @Override
  public UserResponse getCurrentUser() {
    Long userId = SecurityUtil.getCurrentUserId();
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND));
    UserResponse userResponse = userMapper.entityToResponse(user);
    return userResponse;
  }

  // ============================ CHANGE PASSWORD ============================
  @Override
  public void changePassword(ChangePasswordRequest request) {
    Long userId = SecurityUtil.getCurrentUserId();
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND));
    if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
      throw new ApiException(
          ErrorCode.VALIDATION_ERROR,
          Map.of("oldPassword", ErrorMessageConstants.VALIDATION_CURRENT_PASSWORD_INVALID));
    }
    user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);
  }

  // ============================ UPDATE CURRENT USER ============================

  @Override
  public UserResponse updateCurrentUser(BaseUserRequest request) {
    Long userId = SecurityUtil.getCurrentUserId();
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND));
    Map<String, String> errors = new HashMap<>();
    // Check if email is existing
    if (userRepository.exists(
        (root, _, builder) ->
            builder.and(
                builder.equal(root.get("email"), request.getEmail()),
                builder.notEqual(root.get("id"), userId)))) {
      errors.put("email", ErrorMessageConstants.AUTH_EMAIL_ALREADY_EXISTS);
    }

    // Check if phone is existing
    if (userRepository.exists(
        (root, _, builder) ->
            builder.and(
                builder.equal(root.get("phone"), request.getPhone()),
                builder.notEqual(root.get("id"), userId)))) {
      errors.put("phone", ErrorMessageConstants.AUTH_PHONE_ALREADY_EXISTS);
    }

    if (!errors.isEmpty()) {
      throw new ApiException(ErrorCode.VALIDATION_ERROR, errors);
    }
    userMapper.partialUpdate(request, user);
    // Handle avatar update
    if (request.getAvatarId() != null) {
      var currentAvatar = user.getAvatar();
      var newAvatarId = request.getAvatarId();

      if (currentAvatar != null) {
        if (currentAvatar.getId().equals(newAvatarId)) {
          // No change in avatar
          user = userRepository.save(user);
          return userMapper.entityToResponse(user);
        }
        currentAvatar.setUsageStatus(FileUsageStatus.NOT_IN_USE);
        fileRepository.save(currentAvatar);
      }

      var newAvatar =
          fileRepository
              .findOne(
                  (root, _, builder) ->
                      builder.and(
                          builder.equal(root.get("id"), newAvatarId),
                          builder.equal(root.get("purpose"), FilePurpose.AVATAR)))
              .orElseThrow(
                  () ->
                      new ApiException(
                          ErrorCode.RESOURCE_NOT_FOUND,
                          ErrorMessageConstants.RESOURCE_AVATAR_NOT_FOUND));

      if (newAvatar.getUsageStatus() == FileUsageStatus.IN_USE) {
        throw new ApiException(
            ErrorCode.RESOURCE_EXISTS, ErrorMessageConstants.RESOURCE_AVATAR_IN_USE);
      }

      user.setAvatar(newAvatar);
      newAvatar.setUsageStatus(FileUsageStatus.IN_USE);
      fileRepository.save(newAvatar);
    }
    user = userRepository.save(user);
    return userMapper.entityToResponse(user);
  }

  // ============================ GET CURRENT USER PERMISSIONS ============================
  @Override
  public List<String> getCurrentPermissionCodes() {
    Long userRoleId = SecurityUtil.getCurrentUserDetails().getRoleId();
    List<Permission> permissions =
        permissionRepository.findAll(
            (root, query, builder) -> {
              query.distinct(true);
              return builder.equal(root.join("roles").get("id"), userRoleId);
            });
    return permissions.stream().map(Permission::getCode).toList();
  }
}
