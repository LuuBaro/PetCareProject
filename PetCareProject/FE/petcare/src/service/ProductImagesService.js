import axios from 'axios';

const API_URL = 'http://localhost:8080/api/productImages'; // Địa chỉ API

class ProductImagesService {
    // Lấy tất cả hình ảnh sản phẩm
    getAllProductImages() {
        return axios.get(API_URL);
    }

    // Lấy hình ảnh sản phẩm theo ID
    getProductImageById(id) {
        return axios.get(`${API_URL}/${id}`);
    }

    // Tạo mới hoặc cập nhật hình ảnh sản phẩm
    saveProductImage(productImage) {
        return axios.post(API_URL, productImage);
    }

    // Xóa hình ảnh sản phẩm theo ID
    deleteProductImage(id) {
        return axios.delete(`${API_URL}/${id}`);
    }
}

export default new ProductImagesService();
