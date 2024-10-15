import React, { useEffect, useState } from "react";
import axios from "axios";

interface OrderDetail {
  productDetailId: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  statusOrderId: number;
  paymentMethod: string;
  shippingAddress: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  orderDetails: OrderDetail[];
}

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedOrders, setSelectedOrders] = useState<Set<number>>(new Set());
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "Chờ xác nhận", label: "Chờ xác nhận" },
    { id: "Đang vận chuyển", label: "Đang vận chuyển" },
    { id: "Chờ giao hàng", label: "Chờ giao hàng" },
    { id: "Hoàn thành", label: "Hoàn thành" },
    { id: "Đã hủy", label: "Đã hủy" },
    { id: "Trả hàng", label: "Trả hàng/Hoàn tiền" },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/all`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedOrders(new Set());
  };

  // Tìm kiếm và lọc đơn hàng theo tab và từ khóa tìm kiếm
  const filteredOrders = orders.filter((order) => {
    const matchTab =
      activeTab === "all" || order.status === activeTab;
    const matchSearch =
      order.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      order.orderDetails.some((detail) =>
        detail.productName.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    return matchTab && matchSearch;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-4 p-4 bg-white shadow-lg rounded-lg">
      {/* Tabs */}
      <div className="flex justify-around border-b-2 pb-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`text-lg p-2 transition-all rounded-md relative ${
              activeTab === tab.id
                ? "text-[#00b7c0]"
                : "text-gray-500"
            }`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#00b7c0]" />
            )}
          </button>
        ))}
      </div>

      {/* Thanh tìm kiếm */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên sản phẩm hoặc tên khách hàng"
          value={searchKeyword}
          onChange={handleSearch}
          className="border p-2 w-full rounded-md"
        />
      </div>

      {/* Danh sách đơn hàng */}
      <div className="overflow-x-auto">
        {filteredOrders.length === 0 ? (
          <div className="text-center text-gray-600">
            Không tìm thấy đơn hàng nào.
          </div>
        ) : (
          <table className="min-w-full border-collapse bg-white shadow-md">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="border p-2">Sản phẩm</th>
                <th className="border p-2">Doanh thu đơn hàng</th>
                <th className="border p-2">Đơn vị vận chuyển</th>
                <th className="border p-2">Thời gian tạo đơn</th>
                <th className="border p-2">Thông tin khách hàng</th>
                <th className="border p-2">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.orderId} className="text-sm hover:bg-gray-50">
                  <td className="border p-2">
                    {order.orderDetails.map((detail) => (
                      <div key={detail.productId} className="flex items-center mb-2">
                        <img
                          src={detail.productImage}
                          alt={detail.productName}
                          className="w-16 h-16 object-cover rounded mr-2"
                        />
                        <span>{detail.productName} (x{detail.quantity})</span>
                      </div>
                    ))}
                  </td>
                  <td className="border p-2">{order.totalAmount.toLocaleString()} VNĐ</td>
                  <td className="border p-2">{order.paymentMethod}</td>
                  <td className="border p-2">{new Date(order.orderDate).toLocaleString()}</td>
                  <td className="border p-2">
                    {order.fullName} - {order.phoneNumber} - {order.email}
                  </td>
                  <td className="border p-2">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
