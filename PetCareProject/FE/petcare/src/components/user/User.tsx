import React, { useState, useEffect } from "react";
import Header from "../header/Header";
import axios from "axios";

const User: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("choXacNhan");
  const [orders, setOrders] = useState<any[]>([]); // Khởi tạo orders là một mảng rỗng

  // Lấy userId từ nơi bạn lưu trữ thông tin người dùng
  const userId = localStorage.getItem("userId"); // Thay bằng cách lấy ID thực tế của người dùng

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`/api/orders/${userId}`);
      console.log("Fetched orders:", response.data); // Log dữ liệu nhận được từ API
      // Kiểm tra xem dữ liệu có phải là mảng không
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        console.error("Dữ liệu không phải là mảng:", response.data);
        setOrders([]); // Đặt orders thành một mảng rỗng nếu dữ liệu không đúng
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderContent = () => {
    switch (selectedTab) {
      case "choXacNhan":
        return <div className="text-gray-500">Không có đơn hàng nào đang chờ xác nhận.</div>;
      case "vanChuyen":
        return <div className="text-gray-500">Đơn hàng đang vận chuyển</div>;
      case "choGiaoHang":
        return <div className="text-gray-500">Đơn hàng đang chờ giao hàng</div>;
      case "hoanThanh":
        return <div className="text-gray-500">Đơn hàng đã hoàn thành</div>;
      case "daHuy":
        return <div className="text-gray-500">Đơn hàng đã bị hủy</div>;
      case "traHang":
        return <div className="text-gray-500">Đơn hàng trả hàng/hoàn tiền</div>;
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center mx-32">
        <h2 className="font-bold text-2xl pt-4 text-[#00b7c0]">
          Đơn hàng của bạn
        </h2>
        <main className="w-full bg-white shadow-md rounded-lg p-5">
          <div className="flex border-b mb-4 justify-center p-3">
            {[
              "choXacNhan",
              "vanChuyen",
              "choGiaoHang",
              "hoanThanh",
              "daHuy",
              "traHang",
            ].map((tab) => (
              <div
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`mr-4 pb-2 cursor-pointer ${
                  selectedTab === tab
                    ? "border-b-2 border-red-500 text-red-500"
                    : "border-transparent hover:border-red-500"
                }`}
              >
                {tab === "choXacNhan"
                  ? "Chờ xác nhận"
                  : tab === "vanChuyen"
                  ? "Vận chuyển"
                  : tab === "choGiaoHang"
                  ? "Chờ giao hàng"
                  : tab === "hoanThanh"
                  ? "Hoàn thành"
                  : tab === "daHuy"
                  ? "Đã hủy"
                  : "Trả hàng/Hoàn tiền"}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center h-64">
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
};

export default User;
