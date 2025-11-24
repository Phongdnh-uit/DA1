package com.phongdnh.se121.securities.interceptors;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.phongdnh.se121.constants.SecurityConstant;
import com.phongdnh.se121.dtos.ApiResponse;
import com.phongdnh.se121.entities.authorization.Permission;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.repositories.authorization.PermissionRepository;
import com.phongdnh.se121.securities.SecurityUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;

@Component
@RequiredArgsConstructor
public class PermissionInterceptor implements HandlerInterceptor {
  private final PermissionRepository permissionRepository;

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
      throws Exception {

    String path = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
    // String requestURI = request.getRequestURI();
    String method = request.getMethod();
    // System.out.println("PermissionInterceptor: " + method + " " + path + " | " + requestURI);
    // if public endpoint, allow
    // if SUPER_ADMIN bypass
    Set<String> publicUrls = Set.of(SecurityConstant.PUBLIC_URLS);
    Set<String> publicGetUrls = Set.of(SecurityConstant.PUBLIC_GET_URLS);
    if (publicUrls.contains(path)
        || (publicGetUrls.contains(path) && method.equalsIgnoreCase("GET"))) {
      return true;
    }
    if (!SecurityUtil.isRealAuthenticated()) {
      return true;
    }
    Long roleId = SecurityUtil.getCurrentUserDetails().getRoleId();
    if (roleId == 1) {
      // dirty hack: SUPER_ADMIN, not encouraged
      return true;
    }

    List<Permission> permissions =
        permissionRepository.findAll((root, _, _) -> root.join("roles").get("id").in(roleId));
    boolean allowed =
        permissions.stream()
            .anyMatch(
                permission ->
                    permission.getUrlPattern().equalsIgnoreCase(path)
                        && permission.getMethod().name().equalsIgnoreCase(method));
    if (!allowed) {
      ApiResponse<Void> apiResponse = new ApiResponse<>();
      apiResponse.setCode(ErrorCode.FORBIDDEN.getCode());
      apiResponse.setMessage("You do not have permission to access this resource.");
      response.setStatus(HttpServletResponse.SC_FORBIDDEN);
      response.setContentType("application/json");
      response.setCharacterEncoding("UTF-8");
      ObjectMapper objectMapper = new ObjectMapper();
      objectMapper.writeValue(response.getWriter(), apiResponse);
      return false;
    }
    return true;
  }
}
