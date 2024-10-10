import axios from 'axios';

const API_BASE_URL = 'https://online-gateway.ghn.vn/shiip/public-api/master-data'; // Base URL của API Giao Hàng Nhanh
const TOKEN = '0fe4c8c9-71cd-11ef-9839-ea1b8b4124d2'; // Thay bằng token thật của bạn
const API_BE = 'http://localhost:8080/api'; // Thay bằng URL backend của bạn

export const getProvinces = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/province`, {
            headers: {'Token': TOKEN}
        });
        if (response.data.code === 200) {
            return response.data.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error);
        throw error;
    }
};

export const getDistricts = async (provinceId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/district`, {
            province_id: provinceId
        }, {
            headers: {
                'Token': TOKEN,
                'Content-Type': 'application/json'
            }
        });
        if (response.data.code === 200) {
            return response.data.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Lỗi khi lấy danh sách quận/huyện:', error);
        throw error;
    }
};

export const getWards = async (districtId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/ward`, {
            district_id: districtId
        }, {
            headers: {
                'Token': TOKEN,
                'Content-Type': 'application/json'
            }
        });
        if (response.data.code === 200) {
            return response.data.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Lỗi khi lấy danh sách phường/xã:', error);
        throw error;
    }
};

export const addAddress = async (addressData) => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        throw new Error('User ID is missing');
    }

    const payload = {
        ...addressData,
        userId,
    };

    try {
        const response = await axios.post(`${API_BE}/addresses`, payload);
        console.log('Response from server:', response);  // Log the entire response

        // Temporarily relax validation for debugging
        if (response.data) {
            console.log('Response data:', response.data);
            return response.data;  // Return the data even if id is missing
        } else {
            throw new Error('Invalid response structure');
        }
    } catch (error) {
        if (error.response) {
            console.error('Server error:', error.response.data);
        } else if (error.request) {
            console.error('No response from server:', error.request);
        } else {
            console.error('Other error:', error.message);
        }
        throw error;
    }
};

export const getAddresses = async (userId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BE}/addresses?userId=${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,  // Add token if needed
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error: ${response.status} ${response.statusText}, Response: ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching addresses:', error.message);
        throw error; // Re-throw the error to be handled in the component
    }
};

export const updateAddress = async (addressId, updatedAddress) => {
    try {
        const response = await axios.put(`${API_BE}/addresses/${addressId}`, updatedAddress);
        return response.data;
    } catch (error) {
        console.error('Error updating address:', error);
        throw error; // Re-throw the error to be handled in the component
    }
};