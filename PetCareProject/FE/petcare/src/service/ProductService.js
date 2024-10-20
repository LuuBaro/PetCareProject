// ProductService.js

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/products';

class ProductService {
  // Fetch all products
  getAllProducts() {
    return axios.get(API_URL);
  }

  // Fetch a product by ID
  getProductById(id) {
    return axios.get(`${API_URL}/${id}`);
  }

  // Create a new product
  createProduct(product) {
    return axios.post(API_URL, {
      productName: product.productName,
      productQuantity: product.productQuantity,
      description: product.description,
      imageUrl: product.imageUrl,
      category: product.category,
      brand: product.brand
    });
  }

  // Update an existing product
  updateProduct(id, product) {
    return axios.put(`${API_URL}/${id}`, {
      productName: product.productName,
      productQuantity: product.productQuantity,
      description: product.description,
      imageUrl: product.imageUrl,
      category: product.category,
      brand: product.brand
    });
  }

  // Delete a product by ID
  deleteProduct(id) {
    return axios.delete(`${API_URL}/${id}`);
  }



  getTopSellingProducts() {
    return axios.get(`${API_URL}/top-selling`); // API để lấy sản phẩm bán chạy nhất
}
}

export default new ProductService();
