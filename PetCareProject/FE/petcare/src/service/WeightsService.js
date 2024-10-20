import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/weights'; // Update with your actual backend URL

const WeightsService = {
  // Lấy tất cả trọng lượng sản phẩm
  getAllWeights: async () => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data; // Assuming the API returns an array of weights
    } catch (error) {
      console.error('Error fetching weights:', error);
      throw error; // Re-throw the error for further handling
    }
  },

  // Lấy trọng lượng sản phẩm theo ID
  getWeightById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data; // Assuming the API returns a single weight object
    } catch (error) {
      console.error(`Error fetching weight with ID ${id}:`, error);
      throw error;
    }
  },

  // Lưu trọng lượng sản phẩm (tạo mới hoặc cập nhật)
  saveWeight: async (weight) => {
    try {
      const response = await axios.post(BASE_URL, weight);
      return response.data; // Assuming the API returns the saved weight object
    } catch (error) {
      console.error('Error saving weight:', error);
      throw error;
    }
  },

  // Xóa trọng lượng sản phẩm theo ID
  deleteWeight: async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      // No return value; deletion is handled here
    } catch (error) {
      console.error(`Error deleting weight with ID ${id}:`, error);
      throw error;
    }
  },
};

export default WeightsService;
