package com.example.petcareproject.Controller;

import com.example.petcareproject.Model.User;
import com.example.petcareproject.dto.AuthRequestDTO;
import com.example.petcareproject.dto.JwtResponseDTO;
import com.example.petcareproject.Services.JwtService;
import com.example.petcareproject.Services.UserService;
import com.example.petcareproject.dto.RegisterRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequestDTO registerRequest) {
        try {
            User newUser = new User();
            newUser.setEmail(registerRequest.getEmail());
            newUser.setPassword(registerRequest.getPassword()); // Ensure to hash the password
            newUser.setFullName(registerRequest.getFullName());

            userService.saveUser(newUser);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    // AuthController.java
    @PostMapping("/login")
    public JwtResponseDTO login(@RequestBody AuthRequestDTO authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userService.findByEmail(authRequest.getEmail());
        String jwt = jwtService.generateToken(userService.loadUserByUsername(authRequest.getEmail()), user.getUserId());

        return JwtResponseDTO.builder()
                .accessToken(jwt)
                .userId(user.getUserId()) // Chuyển đổi userId từ long sang String
                .fullName(String.valueOf(user.getFullName())) // Ép kiểu fullName về String
                .roleName(userService.getUserRole(user))
                .build();

    }
}