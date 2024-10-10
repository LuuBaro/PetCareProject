package com.example.petcareproject.Services;

import com.example.petcareproject.Model.Role;
import com.example.petcareproject.Model.User;
import com.example.petcareproject.Model.UserRole;
import com.example.petcareproject.Repository.UserRepository;
import com.example.petcareproject.Repository.UserRoleRepository;
import com.example.petcareproject.Repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, UserRoleRepository userRoleRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), new ArrayList<>());
    }

    public void saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword())); // Hash the password
        userRepository.save(user);

        // Assign default role "Người dùng" if no role is specified
        Role defaultRole = roleRepository.findByRoleName("Người dùng");
        if (defaultRole != null) {
            assignRoleToUser(user, defaultRole);
        }
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void assignRoleToUser(User user, Role role) {
        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(role);
        userRoleRepository.save(userRole);
    }

    public String getUserRole(User user) {
        UserRole userRole = userRoleRepository.findByUser(user);
        if (userRole != null) {
            return userRole.getRole().getRoleName();
        }
        return null;
    }

    public User findByUserUserId(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
    }

}