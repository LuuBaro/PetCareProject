import axios from 'axios';

const API_URL = 'http://localhost:8080/api/product-sizes'; // Your API endpoint

class ProductSizesService {
  // Lấy tất cả kích thước sản phẩm
  async getAllProductSizes() {
    const response = await axios.get(API_URL);
    return response.data; // Assuming the data is in response.data
  }

  // Lấy kích thước sản phẩm theo ID
  async getProductSizeById(id) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; // Assuming the data is in response.data
  }

  // Tạo mới hoặc cập nhật kích thước sản phẩm
  async saveProductSize(productSize) {
    if (productSize.sizeId) {
      // Nếu có sizeId thì gọi PUT cho việc cập nhật
      return await axios.put(`${API_URL}/${productSize.sizeId}`, productSize);
    } else {
      // Nếu không có sizeId thì gọi POST cho việc tạo mới
      return await axios.post(API_URL, productSize);
    }
  }

  // Xóa kích thước sản phẩm theo ID
  async deleteProductSize(id) {
    await axios.delete(`${API_URL}/${id}`);
  }
}

export default new ProductSizesService();
