import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/roles';

const RoleService = {
  getAllRoles: async () => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  createRole: async (roleData) => {
    try {
      const response = await axios.post(BASE_URL, roleData);
      return response.data; // Trả về vai trò vừa thêm
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },

  updateRole: async (roleId, roleData) => {
    try {
      const response = await axios.put(`${BASE_URL}/${roleId}`, roleData);
      return response.data; // Trả về vai trò vừa cập nhật
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  },

  deleteRole: async (roleId) => {
    try {
      await axios.delete(`${BASE_URL}/${roleId}`); // Gọi API để xóa vai trò
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  },
};

export default RoleService;
