package com.example.petcareproject.Controller;

import com.example.petcareproject.Model.Role;
import com.example.petcareproject.Services.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "http://localhost:5173")
public class RoleController {

    @Autowired
    private RoleService roleService; // Chèn RoleService

    @GetMapping
    public List<Role> getAllRoles() {
        return roleService.getAllRoles(); // Trả về danh sách vai trò
    }

    @PostMapping
    public Role createRole(@RequestBody Role role) {
        return roleService.createRole(role); // Thêm vai trò
    }

    @PutMapping("/{roleId}")
    public Role updateRole(@PathVariable Long roleId, @RequestBody Role role) {
        return roleService.updateRole(roleId, role); // Cập nhật vai trò
    }

    @DeleteMapping("/{roleId}")
    public void deleteRole(@PathVariable Long roleId) {
        roleService.deleteRole(roleId); // Xóa vai trò
    }
}