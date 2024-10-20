import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/status-orders';

class StatusOderService {

    // Fetch all status orders
    getAllStatusOrders() {
        return axios.get(API_BASE_URL);
    }

    // Fetch a status order by ID
    getStatusOrderById(id) {
        return axios.get(`${API_BASE_URL}/${id}`);
    }

    // Create a new status order
    createStatusOrder(statusOder) {
        return axios.post(API_BASE_URL, statusOder);
    }

    // Update an existing status order by ID
    updateStatusOrder(id, statusOder) {
        return axios.put(`${API_BASE_URL}/${id}`, statusOder);
    }

    // Delete a status order by ID
    deleteStatusOrder(id) {
        return axios.delete(`${API_BASE_URL}/${id}`);
    }
}

export default new StatusOderService();
