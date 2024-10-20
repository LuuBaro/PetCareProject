package com.example.petcareproject.Repository;

import com.example.petcareproject.Model.User;
import com.example.petcareproject.Model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    UserRole findByUser(User user);

    @Query("SELECT ur.role.roleName FROM UserRole ur WHERE ur.user = :user")
    List<String> findRoleNamesByUser(@Param("user") User user);

}