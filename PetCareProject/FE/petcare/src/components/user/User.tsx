import React, { useState, useEffect } from "react";
import Header from "../header/Header";
import axios from "axios";

const User: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [statusOrders, setStatusOrders] = useState<any[]>([]);

  const userId = localStorage.getItem("userId");

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
        // Sắp xếp đơn hàng theo ngày đặt giảm dần
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

  useEffect(() => {
    fetchOrders();
    fetchStatusOrders();
  }, []);

  const renderOrders = () => {
    const statusOrdersMap = new Map(
      statusOrders.map((status) => [status.statusOrderId, status.statusName])
    );

    if (orders.length === 0) {
      return <div className="text-gray-500">Bạn chưa có đơn hàng nào.</div>;
    }

    return orders.map((order) => {
      const statusName = statusOrdersMap.get(order.statusOrderId) || 'Chưa xác định';

      return (
        <div key={order.orderId} className="border border-gray-300 p-6 mb-4 w-full bg-white shadow-lg rounded-lg transition-shadow hover:shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#00b7c0]">Đơn hàng #{order.orderId}</h3>
            <span className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleString()}</span> {/* Hiển thị cả ngày và giờ */}
          </div>
          
          <div className="mb-4 p-4 border border-gray-200 rounded bg-gray-50">
            <p className="font-semibold mb-2">Họ tên: <span className="font-normal">{order.fullName}</span></p>
            <p className="font-semibold mb-2">Số điện thoại: <span className="font-normal">{order.phoneNumber}</span></p>
            <p className="font-semibold mb-2">Email: <span className="font-normal">{order.email}</span></p>
          </div>
          
          <div className="mb-4">
            <p className="text-sm">Trạng thái: <span className="font-semibold text-green-600">{order.status}</span></p>
            <p className="text-sm">Tổng tiền: <span className="font-semibold text-blue-600">{order.totalAmount ? order.totalAmount.toLocaleString() : 'N/A'} VNĐ</span></p>
            <p className="text-sm">Địa chỉ giao hàng: <span className="font-semibold">{order.shippingAddress}</span></p>
            <p className="text-sm">Phương thức thanh toán: <span className="font-semibold">{order.paymentMethod}</span></p>
          </div>
          
          <h4 className="font-semibold text-md mt-4 text-[#00b7c0]">Thông tin sản phẩm:</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {order.orderDetails.map((detail) => (
              <li key={detail.productDetailId} className="border p-4 rounded-lg bg-gray-50 shadow-sm transition-transform transform hover:scale-105">
                <div className="flex items-center">
                  <img
                    src={detail.productImage}
                    alt={detail.productName}
                    className="w-20 h-20 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <p className="font-semibold text-md">{detail.productName}</p>
                    <p className="text-sm text-gray-600">Giá: {detail.productPrice.toLocaleString()} VNĐ</p>
                    <p className="text-sm text-gray-600">Số lượng: {detail.quantity}</p>
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
      <div className="flex flex-col items-center mx-32 py-8 min-h-screen">
        <h2 className="font-bold text-2xl pb-6 text-[#00b7c0]">Đơn hàng của bạn</h2>
        <main className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
          <div className="grid gap-6">
            {renderOrders()}
          </div>
        </main>
      </div>
    </>
  );
};

export default User;
