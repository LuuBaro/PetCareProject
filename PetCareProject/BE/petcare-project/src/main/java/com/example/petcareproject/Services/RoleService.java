package com.example.petcareproject.Services;

import com.example.petcareproject.Model.Role;
import com.example.petcareproject.Repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    public Role findByRoleName(String roleName) {
        return roleRepository.findByRoleName(roleName);
    }
    public List<Role> getAllRoles() {
        return roleRepository.findAll(); // Trả về tất cả các vai trò
    }

    public Role createRole(Role role) {
        return roleRepository.save(role); // Thêm vai trò mới
    }

    public Role updateRole(Long roleId, Role role) {
        role.setRoleId(roleId); // Thiết lập ID cho vai trò
        return roleRepository.save(role); // Cập nhật vai trò
    }

    public void deleteRole(Long roleId) {
        roleRepository.deleteById(roleId); // Xóa vai trò
    }
    public Role findById(Long roleId) {
        return roleRepository.findById(roleId).orElse(null); // Hoặc xử lý khác tùy theo yêu cầu của bạn
    }
}

