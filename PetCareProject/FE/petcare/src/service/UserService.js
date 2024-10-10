// UserService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/users';

const UserService = {
  
  // Lấy tất cả người dùng
  getAllUsers: async () => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Lấy người dùng theo ID
  getUserById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw error;
    }
  },

  // Tạo mới người dùng
  createUser: async (user) => {
    try {
      const response = await axios.post(BASE_URL, user);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Cập nhật người dùng
  updateUser: async (id, updatedUser) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, updatedUser);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      throw error;
    }
  },

  // Xóa người dùng
  deleteUser: async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw error;
    }
  },
};

export default UserService;
