import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../header/Header";
import Modal from "react-modal";
import AddressForm from "../pay/AddressForm";
import Swal from "sweetalert2";

interface Product {
  productId: number;
  image: string;
  productName: string;
  price: number;
  quantity: number;
}

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const products: Product[] = location.state?.products || [];
  const total: number = location.state?.total || 0;
  const [refreshCheckout, setRefreshCheckout] = useState(0);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!userId) {
    throw new Error("User ID is missing from local storage");
  }

  const [address, setAddress] = useState<any | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFirstAddress = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/addresses/first?userId=${userId}`
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `Error fetching address. Status: ${response.status}, Message: ${errorText}`
          );
          throw new Error("Địa chỉ không tìm thấy");
        }

        const contentType = response.headers.get("content-type");

        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          setAddress(data.fullAddress);
        } else {
          console.error("Expected JSON, but received:", await response.text());
          throw new Error("Định dạng phản hồi không hợp lệ");
        }
      } catch (error) {
        console.error("Error fetching first address:", error);
        alert("Không thể kết nối đến server.");
      } finally {
        setLoading(false);
      }
    };

    fetchFirstAddress();
  }, [userId, refreshCheckout]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const clearCartAfterCheckout = () => {
    localStorage.removeItem("cartItems");
    console.log("Giỏ hàng đã được xóa sau khi thanh toán thành công.");
  };

  const handlePayment = async () => {
    if (!address) {
      alert("Vui lòng cung cấp địa chỉ giao hàng.");
      return;
    }
  
    if (products.length === 0) {
      alert("Giỏ hàng trống, không thể thanh toán.");
      return;
    }
  
    console.log("Thông tin sản phẩm:", products);
    console.log("Tổng tiền:", total);
    console.log("Địa chỉ giao hàng:", address);
    console.log("User ID:", userId);
  
    try {
      const response = await fetch("http://localhost:8080/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          products: products.map((productDetail) => ({
            productDetailId: productDetail.productId,
            quantity: productDetail.quantity,
            price: productDetail.price,
            productName: productDetail.productName,
          })),
          total: total,
          address: address,
          userId: userId,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Thanh toán thất bại: ${errorText}`);
      }
  
      Swal.fire({
        title: "Thanh toán thành công!",
        text: "Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn sẽ được xử lý ngay.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Clear cart only after successful payment
        clearCartAfterCheckout();
        navigate("/user");
      });
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      alert(`Thanh toán thất bại: ${error.message}`);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const saveAddress = async (newAddress: any) => {
    const { fullAddress, ward, district, province, street } = newAddress;
    const formattedFullAddress = `${street}, ${ward}, ${district}, ${province}`;

    try {
      const response = await fetch("http://localhost:8080/api/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          fullAddress: formattedFullAddress,
          street: street,
          ward: ward,
          district: district,
          province: province,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error saving address:", errorText);
        alert("Đã xảy ra lỗi khi lưu địa chỉ.");
        return;
      }

      setAddress(formattedFullAddress);
      closeModal();
    } catch (error) {
      console.error("Lỗi khi lưu địa chỉ:", error);
      alert("Không thể kết nối đến server.");
    }
  };

  return (
    <div>
      <Header />
      <div className="bg-gray-100 min-h-screen p-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-4">
            <h1 className="text-2xl font-bold text-[#00b7c0]">Thanh Toán</h1>
          </div>

          {/* Địa chỉ giao hàng */}
          <div className="border-t border-b py-4 mb-4">
            <div className="flex items-center mb-2">
              <i className="fas fa-map-marker-alt text-red-500 mr-2"></i>
              <span className="font-bold">Địa Chỉ Nhận Hàng</span>
            </div>
            <div className="ml-6">
              <p className="font-bold mb-2">
                {loading ? "Đang tải..." : address || "Chưa có địa chỉ nào."}
              </p>
              <button onClick={openModal} className="text-blue-500">
                Thay Đổi
              </button>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div>
            <table className="w-full table-auto mb-4">
              <thead>
                <tr className="border-b-2 border-[#F2BC27] font-bold text-xl">
                  <th className="p-2 text-left">Sản phẩm</th>
                  <th className="p-2 text-left">Đơn giá</th>
                  <th className="p-2 text-left">Số lượng</th>
                  <th className="p-2 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.productId} className="border-t">
                    <td className="p-2 flex items-center">
                      <img
                        src={product.image}
                        alt={product.productName}
                        className="w-16 h-16 object-cover rounded-lg mr-4"
                      />
                      <span>{product.productName}</span>
                    </td>
                    <td className="p-2">{formatPrice(product.price)}</td>
                    <td className="p-2">{product.quantity}</td>
                    <td className="p-2 text-right">
                      {formatPrice(product.price * product.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between">
              <span className="font-bold text-xl">Tổng cộng:</span>
              <span className="font-bold text-xl text-[#00b7c0]">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={handlePayment}
              className="bg-[#00b7c0] text-white px-6 py-3 rounded-full font-bold"
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Address Form */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Address Modal">
        <h2 className="text-2xl font-bold mb-4">Chỉnh sửa địa chỉ</h2>
        <AddressForm saveAddress={saveAddress} />
        <button onClick={closeModal} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          Đóng
        </button>
      </Modal>
    </div>
  );
};

export default Checkout;
