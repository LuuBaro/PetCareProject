import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../header/Header";
import Modal from "react-modal";
import AddressForm from "../pay/AddressForm";
import AddressModal from "../pay/AddressModal";
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
          throw new Error("Address not found");
        }

        const contentType = response.headers.get("content-type");

        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          setAddress(data.fullAddress);
        } else {
          console.error("Expected JSON, but received:", await response.text());
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching first address:", error);
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
    console.log("Cart has been cleared after successful checkout.");
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

      if (response.ok) {
        Swal.fire({
          title: "Thanh toán thành công!",
          text: "Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn sẽ được xử lý ngay.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          clearCartAfterCheckout(); // Clear the cart after successful payment
          navigate("/user");
        });
      } else {
        const errorText = await response.text();
        alert(`Đã xảy ra lỗi khi xử lý thanh toán: ${errorText}`);
      }
    } catch (error) {
      alert("Không thể kết nối đến server.");
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    if (!modalIsOpen && address) {
      const fetchFirstAddress = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/addresses/first?userId=${userId}`
          );
          if (!response.ok) {
            throw new Error("Address not found");
          }
          const data = await response.json();
          setAddress(data.fullAddress);
        } catch (error) {
          console.error("Error fetching first address:", error);
        }
      };

      fetchFirstAddress();
    }
  }, [modalIsOpen, address, userId]);

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
      console.error("Error saving address:", error);
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
                {loading ? "Loading..." : address || "Chưa có địa chỉ nào."}
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
                    <td className="p-8 text-left">{product.quantity}</td>
                    <td className="p-2 text-right font-bold">
                      {formatPrice(product.price * product.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Voucher và phương thức thanh toán */}
          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <i className="fas fa-ticket-alt text-red-500 mr-2"></i>
                <span className="text-lg">PetCare Voucher</span>
              </div>
              <a href="#" className="text-blue-500">
                Chọn Voucher
              </a>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <i className="fas fa-coins text-yellow-500 mr-2"></i>
                <span className="text-lg">Phương thức thanh toán</span>
              </div>
              <a href="#" className="text-blue-500">
                Chọn Phương Thức
              </a>
            </div>
          </div>

          {/* Tổng tiền */}
          <div className="flex justify-between items-center">
            <span className="font-bold text-xl">Tổng tiền:</span>
            <span className="font-bold text-xl text-[#F2BC27]">
              {formatPrice(total)}
            </span>
          </div>

          {/* Nút Thanh Toán */}
          <button
            onClick={handlePayment}
            className="bg-[#00b7c0] w-full py-3 mt-4 text-white font-bold text-lg rounded-lg hover:bg-[#00a6af]"
          >
            Thanh Toán
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Thay đổi địa chỉ"
        className="Modal"
        overlayClassName="Overlay"
      >
        <AddressModal closeModal={closeModal} saveAddress={saveAddress} />
      </Modal>
    </div>
  );
};

export default Checkout;
