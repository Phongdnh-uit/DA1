package com.phongdnh.se121.controllers.authentication;

import com.phongdnh.se121.controllers.GenericController;
import com.phongdnh.se121.dtos.authentication.UserRequestDTO;
import com.phongdnh.se121.dtos.authentication.UserResponseDTO;
import com.phongdnh.se121.entities.authentication.User;
import com.phongdnh.se121.services.CrudService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "User")
@RequestMapping("/users")
@RestController
public class UserController extends GenericController<User, Long, UserRequestDTO, UserResponseDTO> {

  public UserController(CrudService<User, Long, UserRequestDTO, UserResponseDTO> service) {
    super(service);
  }
}
