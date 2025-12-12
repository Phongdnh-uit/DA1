package com.phongdnh.se121.seeder;

import com.phongdnh.se121.repositories.authorization.PermissionRepository;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@Component
public class PermissionScanner {
  private final PermissionRepository permissionRepository;
  private final ChatClient chatClient;
  private final RequestMappingHandlerMapping requestMappingHandlerMapping;

  public PermissionScanner(
      @Qualifier("requestMappingHandlerMapping")
          RequestMappingHandlerMapping requestMappingHandlerMapping,
      PermissionRepository permissionRepository,
      ChatClient.Builder chatClientBuilder) {
    this.permissionRepository = permissionRepository;
    this.chatClient = chatClientBuilder.build();
    this.requestMappingHandlerMapping = requestMappingHandlerMapping;
  }

  @EventListener(ApplicationReadyEvent.class)
  @Transactional
  public void scanAndSavePermissions() {
    return; // Disable automatic permission scanning for now
    // List<Permission> discoveredPermissions = new ArrayList<>();
    // // Lấy tất cả các endpoints
    // Map<RequestMappingInfo, HandlerMethod> handlerMethods =
    //     requestMappingHandlerMapping.getHandlerMethods();
    //
    // handlerMethods.forEach(
    //     (info, handlerMethod) -> {
    //       // 1. Lấy URL Patterns (một method có thể có nhiều URL)
    //       Set<String> patterns = info.getPatternValues();
    //
    //       // 2. Lấy HTTP Methods (GET, POST, etc.)
    //       Set<RequestMethod> methods = info.getMethodsCondition().getMethods();
    //
    //       // 3. Lấy tên Resource (Tên class Controller)
    //       Class<?> controllerClass = handlerMethod.getBeanType();
    //       Tag tagAnnotation =
    //           AnnotatedElementUtils.findMergedAnnotation(controllerClass, Tag.class);
    //       String resourceName = tagAnnotation != null ? tagAnnotation.name() : "Khác";
    //
    //       // Loại bỏ các endpoint nội bộ của Spring (như /error)
    //       if (!resourceName.startsWith("BasicErrorController")) {
    //         for (String pattern : patterns) {
    //           for (RequestMethod method : methods) {
    //             Set<String> publicUrls = Set.of(SecurityConstant.PUBLIC_URLS);
    //             Set<String> publicGetUrls = Set.of(SecurityConstant.PUBLIC_GET_URLS);
    //             if (publicUrls.contains(pattern)
    //                 || (method == RequestMethod.GET && publicGetUrls.contains(pattern))) {
    //               continue; // Bỏ qua các URL công khai
    //             }
    //             if (publicUrls.stream()
    //                     .anyMatch(
    //                         pubUrl ->
    //                             pubUrl.endsWith("/**")
    //                                 && pattern.startsWith(pubUrl.substring(0, pubUrl.length() -
    // 3)))
    //                 || (method == RequestMethod.GET
    //                     && publicGetUrls.stream()
    //                         .anyMatch(
    //                             pubUrl ->
    //                                 pubUrl.endsWith("/**")
    //                                     && pattern.startsWith(
    //                                         pubUrl.substring(0, pubUrl.length() - 3))))) {
    //               continue; // Bỏ qua các URL công khai dạng /**
    //             }
    //             if (pattern.startsWith(AppConstant.OAUTH2_AUTHORIZATION_BASE_URI)) {
    //               continue;
    //             }
    //             if (pattern.startsWith(AppConstant.OAUTH2_AUTHORIZATION_CALLBACK_URI)) {
    //               continue;
    //             }
    //             Permission permission = new Permission();
    //             permission.setResource(resourceName);
    //             permission.setUrlPattern(pattern);
    //             permission.setMethod(Method.valueOf(method.name()));
    //
    //             discoveredPermissions.add(permission);
    //           }
    //         }
    //       }
    //     });
    //
    // discoveredPermissions.forEach(
    //     permission ->
    //         System.out.println(
    //             "Method: " + permission.getMethod() + ", Pattern: " +
    // permission.getUrlPattern()));
    // Set<String> existingPermissionKeys =
    //     permissionRepository.findAll().stream()
    //         .map(p -> p.getMethod() + ":" + p.getUrlPattern())
    //         .collect(Collectors.toSet());
    //
    // List<Permission> newPermissions =
    //     discoveredPermissions.stream()
    //         .filter(p -> !existingPermissionKeys.contains(p.getMethod() + ":" +
    // p.getUrlPattern()))
    //         .collect(Collectors.toList());
    //
    // // Tạo tên cho các permission mới
    //
    // newPermissions.parallelStream()
    //     .forEach(
    //         permission -> {
    //           System.out.println(
    //               "Generating name for Permission - Method: "
    //                   + permission.getMethod()
    //                   + ", Pattern: "
    //                   + permission.getUrlPattern());
    //           String generatedName =
    //               generateNameByLLM(permission.getMethod().name(), permission.getUrlPattern());
    //           permission.setName(generatedName);
    //           System.out.println(
    //               "Generated Name: "
    //                   + generatedName
    //                   + " for Permission - Method: "
    //                   + permission.getMethod()
    //                   + ", Pattern: "
    //                   + permission.getUrlPattern());
    //         });
    // // Lưu các permission mới vào database
    // permissionRepository.saveAll(newPermissions);
  }

  private String generateNameByLLM(String method, String path) {
    String prompt =
        """
        Role: You are a strict API Naming Machine. Output ONLY the Vietnamese name inside < >.

        Rules for naming:
        1. GET + path has "{...}" -> Start with "Xem Chi Tiết"
        2. GET + path no "{...}"  -> Start with "Xem Danh Sách"
        3. POST                   -> Start with "Tạo Mới"
        4. PUT                    -> Start with "Chỉnh Sửa"
        5. DELETE                 -> Start with "Xóa"

        Strict Dictionary (MUST FOLLOW):
        - "roles" -> "vai Trò" (NEVER use "Quyền")
        - "permissions" -> "quyền Hạn"
        - "users" -> "người dùng"
        - "auth" -> "Xác Thực"
        - "properties" -> "Bất Động Sản"
        - "property-types" -> "Loại Bất Động Sản"
        - "wishes" -> "Danh Sách Yêu Thích"

        Examples:
        Input: GET /api/users
        Output: <Xem Danh Sách Người Dùng>

        Input: GET /api/roles
        Output: <Xem Danh Sách Vai Trò>

        Input: PUT /api/roles/{id}
        Output: <Chỉnh Sửa Vai Trò>

        Input: %s %s
        Output:
        """
            .formatted(method, path);

    try {
      String response = chatClient.prompt(prompt).call().content();

      Pattern pattern = Pattern.compile("<(.*?)>");
      Matcher matcher = pattern.matcher(response);
      if (matcher.find()) {
        return matcher.group(1).trim();
      }

      return response.replace("Output:", "").trim();

    } catch (Exception e) {
      return method + " " + path;
    }
  }
}
