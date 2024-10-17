import React, { useState, useEffect } from "react";
import Header from "../header/Header";
import axios from "axios";
import ProgressBar from "../user/ProgressBar"; // Import ProgressBar component
import {
  faClock,
  faTruck,
  faCheckCircle,
  faBan,
  faClipboardCheck,
} from "@fortawesome/free-solid-svg-icons";

const User: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [statusOrders, setStatusOrders] = useState<any[]>([]);

  const userId = localStorage.getItem("userId");
  const [statusIndex, setStatusIndex] = useState<number>(2);
  // Định nghĩa các trạng thái
  const statusLabels = [
    { label: "Chờ xác nhận", icon: faClock },
    { label: "Chờ vận chuyển", icon: faTruck },
    { label: "Đang giao hàng", icon: faClipboardCheck },
    { label: "Hoàn thành", icon: faCheckCircle },
  ];

   // Hàm xử lý khi nhấn vào trạng thái
   const handleStatusClick = (index: number) => {
    setStatusIndex(index); // Cập nhật trạng thái hiện tại
  };


  // Hàm lấy đơn hàng theo userId
  const fetchOrders = async () => {
    if (!userId) {
      console.error("User ID không tồn tại.");
      return;
    }

    try {
      console.log("Fetching orders for userId:", userId);
      const response = await axios.get(`http://localhost:8080/api/user/${userId}`);
      console.log("Fetched orders:", response.data);

      if (Array.isArray(response.data)) {
        const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
        setOrders(sortedOrders);
      } else {
        console.error("Dữ liệu không phải là mảng:", response.data);
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Hàm lấy danh sách trạng thái đơn hàng
  const fetchStatusOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/status-orders`);
      console.log("Fetched status orders:", response.data);
      setStatusOrders(response.data);
    } catch (error) {
      console.error("Error fetching status orders:", error);
    }
  };

  const checkForStatusChange = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/status-orders`); // Fetch current orders
      const currentOrders = response.data;

      // Check if the status of any order has changed
      for (let i = 0; i < orders.length; i++) {
        if (orders[i].statusOrderId !== currentOrders[i].statusOrderId) {
          // Status has changed, reload the page
          window.location.reload();
          break;
        }
      }
    } catch (error) {
      console.error("Error checking order status:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStatusOrders();

    const interval = setInterval(() => {
      checkForStatusChange();
    }, 1000); // Check every 4 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const renderOrders = () => {
    const statusOrdersMap = new Map(
      statusOrders.map((status) => [status.statusOrderId, status.statusName])
    );

    if (orders.length === 0) {
      return <div className="text-gray-500">Bạn chưa có đơn hàng nào.</div>;
    }

    return orders.map((order) => {
      const statusName =
        statusOrdersMap.get(order.statusOrderId) || "Chưa xác định";

      // Lấy chỉ số của trạng thái hiện tại
      const statusIndex =
        statusOrders.length > 0
          ? statusOrders.findIndex(
              (status) => status.statusOrderId === order.statusOrderId
            )
          : -1;

      // Kiểm tra trạng thái "Đã hủy"
      const isCancelled = statusName === "Đã hủy";

      return (
        <div
          key={order.orderId}
          className="border border-gray-300 p-6 mb-4 w-full bg-white shadow-lg rounded-lg transition-shadow hover:shadow-xl"
        >
          {/* Hiển thị thanh tiến trình */}
          {isCancelled ? (
           <div className="flex items-center justify-center p-4 mb-4 border border-red-600 bg-red-100 text-red-800 rounded-lg shadow-lg">
           <svg
             className="w-6 h-6 mr-2 text-red-800 animate-pulse"
             fill="none"
             stroke="currentColor"
             viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg"
           >
             <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="2"
               d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
             ></path>
             <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
             <circle cx="12" cy="17" r="1" fill="currentColor" />
           </svg>
           <span className="text-lg font-bold animate-bounce">
             Đơn hàng đã hủy
           </span>
         </div>


          ) : (
            <ProgressBar
              statusIndex={statusIndex}
              onStatusClick={handleStatusClick}
              statusLabels={statusLabels}
            />
          )}

          {/* Nội dung đơn hàng */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#00b7c0]">
              Đơn hàng #{order.orderId}
            </h3>
            <span className="text-sm text-gray-500">
              {new Date(order.orderDate).toLocaleString()}
            </span>
          </div>

          <div className="mb-4 p-4 border border-gray-200 rounded bg-gray-50">
            <p className="font-semibold mb-2">
              Họ tên: <span className="font-normal">{order.fullName}</span>
            </p>
            <p className="font-semibold mb-2">
              Số điện thoại: <span className="font-normal">{order.phoneNumber}</span>
            </p>
            <p className="font-semibold mb-2">
              Email: <span className="font-normal">{order.email}</span>
            </p>
          </div>

          <div className="mb-4">
            <p className="text-sm">
              Trạng thái:{" "}
              <span
                className={`font-semibold ${
                  isCancelled ? "text-red-600" : "text-green-600"
                }`}
              >
                {order.status}
              </span>
            </p>
            <p className="text-sm">
              Tổng tiền:{" "}
              <span className="font-semibold text-blue-600">
                {order.totalAmount ? order.totalAmount.toLocaleString() : "N/A"}{" "}
                VNĐ
              </span>
            </p>
            <p className="text-sm">
              Địa chỉ giao hàng:{" "}
              <span className="font-semibold">{order.shippingAddress}</span>
            </p>
            <p className="text-sm">
              Phương thức thanh toán:{" "}
              <span className="font-semibold">{order.paymentMethod}</span>
            </p>
          </div>

          <h4 className="font-semibold text-md mt-4 text-[#00b7c0]">
            Thông tin sản phẩm:
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {order.orderDetails.map((detail) => (
              <li
                key={detail.productDetailId}
                className="border p-4 rounded-lg bg-gray-50 shadow-sm transition-transform transform hover:scale-105"
              >
                <div className="flex items-center">
                  <img
                    src={detail.productImage}
                    alt={detail.productName}
                    className="w-20 h-20 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <p className="font-semibold text-md">{detail.productName}</p>
                    <p className="text-sm text-gray-600">
                      Giá: {detail.productPrice.toLocaleString()} VNĐ
                    </p>
                    <p className="text-sm text-gray-600">
                      Số lượng: {detail.quantity}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    });
  };




  return (
    <>
      <Header />
      <div className="container mx-32 w-auto mt-6">
        <h1 className="text-2xl font-bold mb-4">Danh sách đơn hàng</h1>
        {renderOrders()}
      </div>
    </>
  );
};

export default User;
