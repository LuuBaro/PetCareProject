import axios from 'axios';

const API_URL = 'http://localhost:8080/api/productColors';

const ProductColorsService = {
  getAllProductColors: () => {
    return axios.get(API_URL);
  },
  getProductColorById: (id) => {
    return axios.get(`${API_URL}/${id}`);
  },
  saveProductColor: (productColor) => {
    return axios.post(API_URL, productColor);
  },
  deleteProductColor: (id) => {
    return axios.delete(`${API_URL}/${id}`);
  },
};

export default ProductColorsService;
