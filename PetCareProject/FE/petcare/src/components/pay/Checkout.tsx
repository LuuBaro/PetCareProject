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

  const userId = localStorage.getItem("userId"); // Move userId inside the component
  const token = localStorage.getItem("token"); // Move userId inside the component
  if (!userId) {
    throw new Error("User ID is missing from local storage");
  }
  const [address, setAddress] = useState<any | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchFirstAddress = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(
          `http://localhost:8080/api/addresses/first?userId=${userId}`
        );

        if (!response.ok) {
          // Log the response text if it's not okay
          const errorText = await response.text();
          console.error(
            `Error fetching address. Status: ${response.status}, Message: ${errorText}`
          );
          throw new Error("Address not found");
        }

        const contentType = response.headers.get("content-type");

        // Check if response is JSON
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
        setLoading(false); // End loading
      }
    };

    fetchFirstAddress();
  }, [userId, refreshCheckout]); // Add userId and refreshCheckout to the dependency array

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
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

    // Log thông tin sản phẩm và địa chỉ
    console.log("Thông tin sản phẩm:", products);
    console.log("Tổng tiền:", total);
    console.log("Địa chỉ giao hàng:", address);
    console.log("User ID:", userId);

    products.map((productDetail) => {
      console.log("Sản phẩm:", productDetail);
      return {
        productDetailId: productDetail.productId, // Sử dụng productDetailId
        quantity: productDetail.quantity,
        price: productDetail.price,
        productName: productDetail.productName,
      };
    })
    console.log(JSON.stringify({
      products: products.map((productDetail) => ({
        productDetailId: productDetail.productId,
        quantity: productDetail.quantity,
        price: productDetail.price,
        productName: productDetail.productName,
      })),
      total: total,
      address: address,
      userId: userId,
    }));
    
    try {
      const response = await fetch("http://localhost:8080/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: products.map((productDetail) => ({
            productDetailId: productDetail.productId, // Sử dụng productDetailId để nhận diện sản phẩm
            quantity: productDetail.quantity,
            price: productDetail.price,
            productName: productDetail.productName, // Nếu API cần tên sản phẩm, bạn có thể giữ lại
          })),
          total: total,
          address: address,
          userId: userId, // Gửi userId từ frontend
        }),
      });

      if (response.ok) {
        // Hiển thị thông báo thành công
        Swal.fire({
          title: "Thanh toán thành công!",
          text: "Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn sẽ được xử lý ngay.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
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
      // Tự động reload dữ liệu khi địa chỉ đã được chọn hoặc lưu thành công
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
  }, [modalIsOpen, address, userId]); // Thêm address và modalIsOpen vào dependency để theo dõi thay đổi

  const saveAddress = async (newAddress: any) => {
    const { fullAddress, ward, district, province, street } = newAddress;

    // Format the address for full_address
    const formattedFullAddress = `${street}, ${ward}, ${district}, ${province}`;

    // Call the API to save the new address
    try {
      const response = await fetch("http://localhost:8080/api/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId, // Assuming you have userId available
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

      // If successful, set the address in the state
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
              {/*<p className="font-bold mb-2"></p>*/}
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
                <span className="text-lg">PetCare Xu</span>
              </div>
              <span className="text-gray-500">Không thể sử dụng Xu</span>
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="border-b pb-4 mb-4">
            <div className="text-lg font-semibold mb-2">
              Phương thức thanh toán
            </div>
            <div className="flex justify-between items-center">
              <span>Thanh toán khi nhận hàng</span>
              <a href="#" className="text-blue-500">
                THAY ĐỔI
              </a>
            </div>
          </div>

          {/* Tổng số tiền */}
          <div className="bg-gray-50 p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <span>Tổng tiền hàng</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Phí vận chuyển</span>
              <span>15.000 ₫</span> {/* Static for now */}
            </div>
          </div>
          {/* Tổng cộng */}
          <div className="mt-6 text-right">
            <h2 className="text-xl font-bold text-red-500">
              Tổng cộng: {formatPrice(total + 15000)}
            </h2>
            <button
              onClick={handlePayment}
              className="bg-[#00b7c0] text-white px-6 py-2 rounded-lg hover:bg-[#41797c] transition duration-300 mt-4"
            >
              Đặt hàng
            </button>
          </div>
          <div className="text-center text-gray-500 text-sm mt-4">
            Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo{" "}
            <a href="#" className="text-blue-500">
              Điều khoản PetCare
            </a>
          </div>
        </div>
      </div>

      {/* Modal để chọn địa chỉ */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Chọn Địa Chỉ"
        ariaHideApp={false}
        style={{
          content: {
            width: "60%", // Tăng kích thước modal
            maxWidth: "800px", // Đảm bảo modal không quá lớn
            height: "70%", // Tăng chiều cao của modal
            margin: "auto", // Canh giữa modal
            borderRadius: "10px", // Bo góc nhẹ
            padding: "20px", // Thêm khoảng cách bên trong modal
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Thêm shadow để modal nổi bật hơn
          },
        }}
      >
        <div className="modal-header">
          <h2 className="text-xl font-bold text-center">
            Chọn Địa Chỉ Giao Hàng
          </h2>
        </div>
        <div className="modal-body">
          <AddressModal
            isOpen={modalIsOpen}
            onClose={closeModal}
            userId={userId}
            onAddressSelected={(addressId) => {
              // Fetch the full address from the API based on the addressId
              fetch(`http://localhost:8080/api/addresses/${addressId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
                .then((res) => {
                  if (!res.ok) {
                    throw new Error("Network response was not ok");
                  }
                  return res.json();
                })
                .then((data) => setAddress(data)) // Store the whole address object
                .catch((error) =>
                  console.error("Error fetching address:", error)
                );
              setRefreshCheckout((prev) => prev + 1);
            }}
            currentCheckoutAddressId={address?.addressId ?? null}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Checkout;
