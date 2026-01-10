package com.phongdnh.se121.controllers.authentication;

import com.phongdnh.se121.controllers.GenericController;
import com.phongdnh.se121.dtos.authentication.UserRequest;
import com.phongdnh.se121.dtos.authentication.UserResponse;
import com.phongdnh.se121.entities.authentication.User;
import com.phongdnh.se121.services.CrudService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "User")
@RequestMapping("/users")
@RestController
public class UserController extends GenericController<User, Long, UserRequest, UserResponse> {

  public UserController(CrudService<User, Long, UserRequest, UserResponse> service) {
    super(service);
  }
}
