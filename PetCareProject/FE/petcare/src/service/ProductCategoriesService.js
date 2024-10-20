import axios from 'axios';

const API_URL = 'http://localhost:8080/api/product-categories';

class ProductCategoriesService {
    // Lấy tất cả danh mục sản phẩm
    getAllProductCategories() {
        return axios.get(API_URL);
    }

    // Lấy danh mục sản phẩm theo ID
    getProductCategoryById(id) {
        return axios.get(`${API_URL}/${id}`);
    }

    // Tạo danh mục sản phẩm mới
    createProductCategory(productCategory) {
        return axios.post(API_URL, productCategory);
    }

    // Cập nhật danh mục sản phẩm
    updateProductCategory(id, productCategory) {
        return axios.put(`${API_URL}/${id}`, productCategory);
    }

    // Xóa danh mục sản phẩm
    deleteProductCategory(id) {
        return axios.delete(`${API_URL}/${id}`);
    }

    // Phương thức tùy chọn để xử lý lỗi
    handleError(error) {
        console.error('API request failed:', error);
        if (error.response) {
            // Server trả về response lỗi
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            // Request đã được gửi nhưng không có phản hồi
            console.error('No response received:', error.request);
        } else {
            // Lỗi xảy ra trong quá trình thiết lập request
            console.error('Error setting up request:', error.message);
        }
        return Promise.reject(error);
    }
}

export default new ProductCategoriesService();
