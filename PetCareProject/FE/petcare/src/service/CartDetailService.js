import axios from "axios";
import toastr from "toastr";
const API_URL = "http://localhost:8080/api/cart";

// Giả định bạn có một hàm để lấy giỏ hàng của người dùng
const getCartItems = async (userId, token) => {
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data; // Giả định dữ liệu trả về là một mảng các sản phẩm trong giỏ
  };
  
  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = async (
    productDetailId,
    quantity,
    userId,
    token,
    productName,
    stockAvailable
  ) => {
    try {
      console.log(`quantity: ${quantity}, stockAvailable: ${stockAvailable}`); // Kiểm tra giá trị
  
      // Kiểm tra nếu sản phẩm còn hàng
      if (stockAvailable <= 0) {
        toastr.error(`Sản phẩm ${productName} đã hết hàng.`);
        return; // Kết thúc hàm nếu hết hàng
      }
  
      // Lấy danh sách sản phẩm trong giỏ hàng
      const cartItems = await getCartItems(userId, token);
      const existingItem = cartItems.find(item => item.productDetailId === productDetailId);
  
      // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
      if (existingItem) {
        const totalQuantityInCart = existingItem.quantity + quantity; // Tổng số lượng sau khi thêm
  
        // Kiểm tra số lượng thêm vào không được lớn hơn số lượng có sẵn
        if (totalQuantityInCart > stockAvailable) {
          toastr.error(`Sản phẩm ${productName} chỉ có ${stockAvailable} sản phẩm, không thể thêm.`);
          return; // Kết thúc hàm nếu số lượng vượt quá số lượng có sẵn
        }
      }
  
      // Gửi yêu cầu thêm sản phẩm vào giỏ hàng
      const response = await axios.post(
        `${API_URL}/add`,
        {
          productDetailId: productDetailId,
          quantityItem: quantity, // Sử dụng quantity đã được xác nhận
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      // Xử lý phản hồi từ server
      if (response.status === 200) {
        const cartDetail = response.data;
        toastr.success(
          `${cartDetail.quantityItem} ${productName} đã được thêm vào giỏ hàng.`
        );
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
    toastr.error(
      `Bạn chỉ có thể thanh toán với tối đa ${stockAvailable} ${productName}.`
    );
    return false;
  }
  toastr.info("Tiến hành thanh toán.");
  return true;
};
// Hàm xử lý thay đổi số lượng
const handleQuantityChange = async (e, productDetailId, setQuantity) => {
    const value = parseInt(e.target.value); // Lấy giá trị từ input và chuyển thành số nguyên

    // Nếu giá trị nhỏ hơn 1, không thực hiện cập nhật
    if (value < 1) {
        setQuantity(1); // Đặt số lượng tối thiểu là 1
        return;
    }

    try {
        // Lấy thông tin chi tiết sản phẩm
        const productDetailResponse = await axios.get(
            `http://localhost:8080/api/product-details/${productDetailId}`
        );
        const productDetail = productDetailResponse.data;
        const stockAvailable = productDetail ? productDetail.quantity : 0; // Lấy số lượng sản phẩm có sẵn từ ProductDetail

        console.log(productDetail);
        // Kiểm tra số lượng muốn cập nhật không được vượt quá số lượng có sẵn
        if (value > stockAvailable) {
            toastr.error(`Số lượng không được vượt quá ${stockAvailable}.`); // Thông báo lỗi
            setQuantity(stockAvailable); // Đặt lại số lượng thành số lượng có sẵn
            return; // Không thực hiện cập nhật nếu vượt quá số lượng có sẵn
        }

        // Cập nhật số lượng, đảm bảo không vượt quá số hàng có sẵn
        setQuantity(Math.min(value, stockAvailable));
    } catch (error) {
        console.error("Error fetching product detail:", error.response ? error.response.data : error.message);
        toastr.error("Có lỗi xảy ra khi lấy thông tin sản phẩm.");
    }
};

<<<<<<< Updated upstream
export default {
    addToCart,
    checkoutCart,
    handleQuantityChange
=======

// Hàm xóa sản phẩm khỏi giỏ hàng sau khi thanh toán thành công
const clearCartAfterCheckout = async (userId, token) => {
  try {
    // Gửi yêu cầu xóa toàn bộ sản phẩm trong giỏ hàng
    const response = await axios.delete(`${API_URL}/clear/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Xử lý phản hồi từ server
    if (response.status === 200) {
      toastr.success(
        "Giỏ hàng của bạn đã được xóa sau khi thanh toán thành công."
      );
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
    const response = await axios.post(
      `${API_URL}/update-quantity/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

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
  updateQuantityCheckout, // Thêm hàm updateQuantityCheckout vào export
>>>>>>> Stashed changes
};
