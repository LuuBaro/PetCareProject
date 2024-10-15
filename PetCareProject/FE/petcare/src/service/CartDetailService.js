import axios from 'axios';
import toastr from 'toastr';

const API_URL = 'http://localhost:8080/api/cart';

// Hàm thêm sản phẩm vào giỏ hàng
const addToCart = async (productDetailId, quantity, userId, token, productName, stockAvailable) => {
    try {
        console.log(`quantity: ${quantity}, stockAvailable: ${stockAvailable}`); // Kiểm tra giá trị

        // Kiểm tra nếu sản phẩm còn hàng
        if (stockAvailable <= 0) {
            toastr.error(`Sản phẩm ${productName} đã hết hàng.`);
            return; // Kết thúc hàm nếu hết hàng
        }

        // Kiểm tra số lượng nhập vào không hợp lệ
        const validQuantity = Math.max(1, Math.min(quantity, stockAvailable));
        if (validQuantity !== quantity) {
            toastr.error(`Số lượng nhập vào không hợp lệ. Bạn chỉ có thể thêm tối đa ${stockAvailable} sản phẩm ${productName}.`);
            return; // Kết thúc hàm nếu số lượng vượt quá số lượng có sẵn
        }

        // Gửi yêu cầu thêm sản phẩm vào giỏ hàng
        const response = await axios.post(`${API_URL}/add`, {
            productDetailId: productDetailId,
            quantityItem: validQuantity,
            userId: userId,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // Xử lý phản hồi từ server
        if (response.status === 200) {
            const cartDetail = response.data;
            toastr.success(`${cartDetail.quantityItem} ${productName} đã được thêm vào giỏ hàng.`);
            return cartDetail;
        } else {
            toastr.error("Có lỗi xảy ra khi thêm vào giỏ hàng.");
        }
    } catch (error) {
        console.error("Error while adding to cart:", error);
        toastr.error("Lỗi khi thêm vào giỏ hàng. Vui lòng thử lại.");
        throw error;
    }
};

// Hàm kiểm tra giỏ hàng trước khi thanh toán
const checkoutCart = (quantity, stockAvailable, productName) => {
    if (quantity > stockAvailable) {
        toastr.error(`Bạn chỉ có thể thanh toán với tối đa ${stockAvailable} ${productName}.`);
        return false;
    }
    toastr.info("Tiến hành thanh toán.");
    return true;
};

// Hàm xử lý thay đổi số lượng
const handleQuantityChange = (e, stockAvailable, setQuantity) => {
    const value = Math.max(1, parseInt(e.target.value));

    // Kiểm tra số lượng và hiển thị thông báo nếu vượt quá số lượng có sẵn
    if (value > stockAvailable) {
        toastr.error(`Bạn chỉ có thể thêm tối đa ${stockAvailable} sản phẩm.`);
    }

    // Cập nhật số lượng, đảm bảo không vượt quá số hàng có sẵn
    setQuantity(Math.min(value, stockAvailable)); 
};

// Hàm xóa sản phẩm khỏi giỏ hàng sau khi thanh toán thành công
const clearCartAfterCheckout = async (userId, token) => {
    try {
        // Gửi yêu cầu xóa toàn bộ sản phẩm trong giỏ hàng
        const response = await axios.delete(`${API_URL}/clear/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // Xử lý phản hồi từ server
        if (response.status === 200) {
            toastr.success("Giỏ hàng của bạn đã được xóa sau khi thanh toán thành công.");
            return true;
        } else {
            toastr.error("Có lỗi xảy ra khi xóa giỏ hàng.");
            return false;
        }
    } catch (error) {
        console.error("Error while clearing the cart:", error);
        toastr.error("Lỗi khi xóa giỏ hàng. Vui lòng thử lại.");
        throw error;
    }
};

// Hàm cập nhật số lượng sản phẩm sau khi thanh toán
const updateQuantityCheckout = async (userId, token) => {
    try {
        // Gửi yêu cầu cập nhật số lượng sản phẩm trong giỏ hàng sau khi thanh toán
        const response = await axios.post(`${API_URL}/update-quantity/${userId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // Xử lý phản hồi từ server
        if (response.status === 200) {
            toastr.success("Số lượng sản phẩm đã được cập nhật sau khi thanh toán.");
            return true;
        } else {
            toastr.error("Có lỗi xảy ra khi cập nhật số lượng sản phẩm.");
            return false;
        }
    } catch (error) {
        console.error("Error while updating quantity after checkout:", error);
        toastr.error("Lỗi khi cập nhật số lượng sản phẩm. Vui lòng thử lại.");
        throw error;
    }
};

export default {
    addToCart,
    checkoutCart,
    handleQuantityChange,
    clearCartAfterCheckout,
    updateQuantityCheckout // Thêm hàm updateQuantityCheckout vào export
};
