import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/orders';


const OrderService = {
    // Fetch all orders along with their status
    getAllOrders: async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            return response.data; // Assuming this includes statusOrder data
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đơn hàng:', error);
            throw error;
        }
    },

    // Fetch a single order by ID, including status
    getOrderById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy đơn hàng theo ID:', error);
            throw error;
        }
    },

    // Create a new order
    createOrder: async (orderData) => {
        try {
            const response = await axios.post(API_BASE_URL, orderData);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi tạo đơn hàng:', error);
            throw error;
        }
    },

    // Update an existing order
    updateOrder: async (id, orderData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/${id}`, orderData);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi cập nhật đơn hàng:', error);
            throw error;
        }
    },

    // Update the status of an order
    updateOrderStatus: async (orderId, newStatus) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/${orderId}/status`, {
                status: { name: newStatus } // Cập nhật trạng thái đơn hàng
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
            throw error;
        }
    },


    
    // Delete an order
    deleteOrder: async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
        } catch (error) {
            console.error('Lỗi khi xóa đơn hàng:', error);
            throw error;
        }
    },

    
        // ... các phương thức khác
        async updateStatusOrder(statusOrderId, statusOrder) {
            const response = await axios.put(`/api/status_orders/${statusOrderId}`, statusOrder);
            return response.data;
        }
    
        
};

export default OrderService;
