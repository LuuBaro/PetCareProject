package com.example.petcareproject.Repository;

import com.example.petcareproject.Model.User;
import com.example.petcareproject.Model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    UserRole findByUser(User user);
}