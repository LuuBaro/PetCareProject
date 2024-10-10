// BrandService.js

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/brands';

class BrandService {
    // Fetch all brands
    getAllBrands() {
        return axios.get(API_URL);
    }

    // Fetch a brand by ID
    getBrandById(id) {
        return axios.get(`${API_URL}/${id}`);
    }

  
    // Create a new brand
    createBrand(brand) {
        return axios.post(API_URL, {
            brandName: brand.brandName
        });
    }


    // Update an existing brand
    updateBrand(id, brand) {
        return axios.put(`${API_URL}/${id}`, {
            brandName: brand.brandName
        });
    }

    // Delete a brand by ID
    deleteBrand(id) {
        return axios.delete(`${API_URL}/${id}`);
    }
}

export default new BrandService();
