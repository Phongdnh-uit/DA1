package com.phongdnh.se121.constants;

/** Thông báo lỗi dùng chung cho toàn hệ thống. Đã chuẩn hóa tiếng Việt, loại bỏ trùng ngữ nghĩa. */
public interface ErrorMessageConstants {

  // ======================== VALIDATION ========================
  String VALIDATION_EMAIL_OR_PHONE_INVALID = "Email hoặc số điện thoại không hợp lệ";
  String VALIDATION_PHONE_INVALID = "Số điện thoại không hợp lệ";
  String VALIDATION_CURRENT_PASSWORD_INVALID = "Mật khẩu hiện tại không đúng";
  String VALIDATION_VALUE_ALREADY_EXISTS = "Giá trị đã tồn tại";
  String VALIDATION_ATTACHMENTS_INVALID = "Một hoặc nhiều tệp đính kèm không hợp lệ";

  // ======================== VALIDATION - PROPERTY ========================
  String VALIDATION_PROPERTY_TYPE_INVALID = "Loại bất động sản không hợp lệ";
  String VALIDATION_PROVINCE_INVALID = "Tỉnh/Thành không hợp lệ";
  String VALIDATION_WARD_INVALID = "Phường/Xã không hợp lệ";
  String VALIDATION_THUMBNAIL_INVALID = "Ảnh đại diện không hợp lệ";
  String VALIDATION_PROVINCE_NOT_EXISTS = "Tỉnh/Thành không tồn tại";

  // ======================== VALIDATION - CONVERSATION ========================
  String VALIDATION_CONVERSATION_NOT_PENDING = "Cuộc trò chuyện không ở trạng thái chờ xử lý";
  String VALIDATION_CONVERSATION_NOT_OPEN = "Cuộc trò chuyện chưa được mở";

  // ======================== AUTH ========================
  String AUTH_EMAIL_ALREADY_EXISTS = "Email đã tồn tại";
  String AUTH_PHONE_ALREADY_EXISTS = "Số điện thoại đã tồn tại";
  String AUTH_USER_CONTACT_ALREADY_EXISTS = "Thông tin liên hệ đã tồn tại";
  String AUTH_PHONE_NOT_VERIFIED = "Số điện thoại chưa được xác thực";
  String AUTH_LOGIN_REQUIRED = "Người dùng chưa đăng nhập";

  // ======================== AUTH - ROLE / PERMISSION ========================
  String AUTH_ROLE_NOT_FOUND = "Vai trò không tồn tại";
  String AUTH_CANNOT_DELETE_ADMIN_ROLE = "Không thể xóa vai trò quản trị";
  String AUTH_PERMISSION_NOT_FOUND = "Quyền không tồn tại";
  String AUTH_PERMISSION_ALREADY_EXISTS = "Quyền đã tồn tại";

  // ======================== AUTH - PARTICIPANT ========================
  String AUTH_USER_ALREADY_PARTICIPANT = "Người dùng đã tham gia cuộc trò chuyện";
  String AUTH_USER_NOT_PARTICIPANT = "Người dùng không tham gia cuộc trò chuyện";
  String AUTH_USER_NOT_MESSAGE_SENDER = "Người dùng không phải người gửi tin nhắn";

  // ======================== RESOURCE ========================
  String RESOURCE_NOT_FOUND = "Tài nguyên không tồn tại";
  String RESOURCE_USER_NOT_FOUND = "Người dùng không tồn tại";
  String RESOURCE_PROPERTY_NOT_FOUND = "Bất động sản không tồn tại";
  String RESOURCE_FILE_NOT_FOUND = "Tệp không tồn tại";
  String RESOURCE_AVATAR_IN_USE = "Ảnh đại diện đang được sử dụng";
  String RESOURCE_AVATAR_NOT_FOUND = "Ảnh đại diện không tồn tại";

  // ======================== FILE ========================
  String FILE_NOT_AVAILABLE = "Tệp không khả dụng để tải xuống";
  String FILE_SIGN_URL_FAILED = "Không thể tạo liên kết truy cập tệp";

  // ======================== SYSTEM ========================
  String SYSTEM_INTERNAL_ERROR = "Lỗi hệ thống";
  String SYSTEM_EMAIL_SEND_FAILED = "Gửi email thất bại";
  String SYSTEM_AI_RESPONSE_PARSE_FAILED = "Không thể xử lý dữ liệu từ AI";
  String SYSTEM_INVALID_JWT_SUBJECT = "Thông tin người dùng trong JWT không hợp lệ";
  String SYSTEM_UNSUPPORTED_CONTACT_TYPE = "Loại liên hệ không được hỗ trợ";
  String SYSTEM_UNSUPPORTED_VERIFICATION_PURPOSE = "Mục đích xác thực không được hỗ trợ";
  String SYSTEM_HS512_SECRET_KEY_TOO_SHORT = "Khóa bí mật HS512 quá ngắn, cần ít nhất 64 byte";
  String SYSTEM_ERROR_CREATING_BUCKET = "Tạo bucket lưu trữ thất bại";

  // ======================== AI ========================
  String AI_RESPONSE_PARSE_FAILED = "Không thể xử lý dữ liệu từ AI";

  // ======================== PROPERTY - PROVINCE ========================
  String PROVINCE_CODE_EXISTS = "Mã tỉnh/thành đã tồn tại";
  String VALIDATION_WARD_CODE_EXISTS = "Mã phường/xã đã tồn tại";
}
