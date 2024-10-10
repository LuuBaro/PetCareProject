import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Thay bằng URL backend của bạn

// ... (các hàm khác)

export const addAddress = async (addressData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/addresses`, addressData);
        console.log('Response from server:', response); // Log phản hồi từ server

        // Đảm bảo dữ liệu trả về hợp lệ trước khi xử lý tiếp
        if (response.data && response.data.id) {
            return response.data; // Trả về dữ liệu từ server
        } else {
            throw new Error('Dữ liệu trả về không hợp lệ hoặc thiếu các trường cần thiết');
        }
    } catch (error) {
        // Kiểm tra lỗi trả về từ backend
        if (error.response) {
            console.error('Lỗi từ server:', error.response.data);
        } else if (error.request) {
            console.error('Không nhận được phản hồi từ server:', error.request);
        } else {
            console.error('Lỗi khác:', error.message);
        }
        throw error;
    }
};

export const getAddresses = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/addresses?userId=${userId}`);
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

// const fetchAddresses = async () => {
//     try {
//         const token = localStorage.getItem('authToken'); // Assuming you store your auth token here
//         const response = await fetch("http://localhost:8080/api/addresses?userId=1", {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`,  // Include the token if authentication is required
//                 'Content-Type': 'application/json'
//             },
//             credentials: 'include'  // Include cookies if needed (depends on your authentication)
//         });
//
//         if (!response.ok) {
//             throw new Error('Failed to fetch');
//         }
//
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error('Error fetching addresses:', error);
//     }
// };

