import axios from 'axios';

const API_URL = 'http://localhost:8080/api/orders'; // Đường dẫn API backend của bạn

export const OrderService = {
    // Hàm lấy tất cả đơn hàng
    getAllOrders: async () => {
        return await axios.get(API_URL);
    },

    // Hàm lấy đơn hàng của một user cụ thể
    getUserOrders: async (userId: number) => {
        return await axios.get(`${API_URL}/user/${userId}`);
    },

    // Hàm lấy chi tiết một đơn hàng
    getOrderDetails: async (orderId: number) => {
        return await axios.get(`${API_URL}/${orderId}`);
    },
};