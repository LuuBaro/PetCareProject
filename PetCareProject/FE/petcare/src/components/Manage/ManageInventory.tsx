import React, {useEffect, useState} from "react";
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

const OrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<string>("all");
    const [selectedOrders, setSelectedOrders] = useState<Set<number>>(new Set());
    const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
    const [cancelReason, setCancelReason] = useState<string>("");
    const [selectedCancelReason, setSelectedCancelReason] = useState<string>("");
    const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>(""); // Trường tìm kiếm
    const cancelReasons = [
        "Thay đổi ý định",
        "Không còn nhu cầu",
        "Sản phẩm không đúng mô tả",
        "Khác",
    ];

    const tabs = [
        {id: "all", label: "Tất cả"},
        {id: "Chờ xác nhận", label: "Chờ xác nhận"},
        {id: "Đang vận chuyển", label: "Đang vận chuyển"},
        {id: "Chờ giao hàng", label: "Chờ giao hàng"},
        {id: "Hoàn thành", label: "Hoàn thành"},
        {id: "Đã hủy", label: "Đã hủy"},
        {id: "Trả hàng", label: "Trả hàng/Hoàn tiền"},
    ];

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "chờ xác nhận":
                return "text-orange-400 font-bold"; // Màu xám đậm cho trạng thái chờ xác nhận
            case "đang vận chuyển":
                return "text-blue-500 font-bold"; // Màu xanh dương cho trạng thái đang vận chuyển
            case "chờ giao hàng":
                return "text-green-500 font-bold"; // Màu tím cho trạng thái chờ giao hàng
            case "hoàn thành":
                return "text-[#52b7c0] font-bold"; // Màu cyan cho trạng thái hoàn thành
            case "đã hủy":
                return "text-red-600 font-bold"; // Màu đỏ cho trạng thái đã hủy
            case "trả hàng":
                return "text-orange-500 font-bold"; // Màu cam cho trạng thái trả hàng
            default:
                return "text-gray-500 font-bold"; // Màu xám mặc định
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/all`);
                // Sắp xếp danh sách đơn hàng theo ngày đặt hàng, đơn hàng mới nhất ở trên cùng
                const sortedOrders = response.data.sort(
                    (a: Order, b: Order) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
                );
                setOrders(sortedOrders);
            } catch (error) {
                console.error("Lỗi khi tìm nạp đơn đặt hàng", error);
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

    // Lọc đơn hàng dựa trên tab hiện tại và từ khóa tìm kiếm
    // Lọc đơn hàng dựa trên tab hiện tại và từ khóa tìm kiếm
    const filteredOrders = orders
        // Bước 1: Lọc theo tab hiện tại (nếu không phải "all")
        .filter((order) => activeTab === "all" || order.status?.toLowerCase() === activeTab.toLowerCase())
        // Bước 2: Lọc tiếp theo từ khóa tìm kiếm
        .filter((order) => {
            const searchLower = searchTerm.toLowerCase();

            // Kiểm tra tất cả các thông tin trong đơn hàng
            const orderInfo = [
                order.fullName?.toLowerCase() || '', // Thêm kiểm tra null/undefined
                order.email?.toLowerCase() || '',
                order.status?.toLowerCase() || '',
                order.phoneNumber?.toLowerCase() || '',
                order.shippingAddress?.toLowerCase() || '',
                order.paymentMethod?.toLowerCase() || '',
                order.totalAmount?.toString().toLowerCase() || '',
                order.orderDate?.toLowerCase() || '',
            ];

            // Kiểm tra trong thông tin chi tiết sản phẩm
            const productInfo = order.orderDetails.some((detail) =>
                [
                    detail.productName?.toLowerCase() || '', // Thêm kiểm tra null/undefined
                    detail.price?.toString().toLowerCase() || '',
                    detail.quantity?.toString().toLowerCase() || '',
                ].some((field) => field.includes(searchLower))
            );

            // Nếu từ khóa tìm thấy trong bất kỳ trường nào
            return orderInfo.some((field) => field.includes(searchLower)) || productInfo;
        });


    const handleCheckboxChange = (orderId: number) => {
        const updatedSelection = new Set(selectedOrders);
        if (updatedSelection.has(orderId)) {
            updatedSelection.delete(orderId);
        } else {
            updatedSelection.add(orderId);
        }
        setSelectedOrders(updatedSelection);
    };

    const handleOrderAction = async (newStatus: string) => {
        const statusMap: Record<string, number> = {
            "Chờ xác nhận": 1,
            "Đang vận chuyển": 2,
            "Chờ giao hàng": 3,
            "Hoàn thành": 4,
            "Đã hủy": 5,
            "Trả hàng": 6,
        };

        const statusId = statusMap[newStatus];
        if (!statusId) {
            console.error("Invalid status ID:", newStatus);
            return;
        }

        const updatedOrders = [...orders];

        await Promise.all(
            Array.from(selectedOrders).map(async (orderId) => {
                try {
                    const response = await axios.put(
                        `http://localhost:8080/api/${orderId}/status/${statusId}`
                    );

                    if (response.status === 200) {
                        const orderIndex = updatedOrders.findIndex(
                            (order) => order.orderId === orderId
                        );
                        if (orderIndex !== -1) {
                            updatedOrders[orderIndex] = {
                                ...updatedOrders[orderIndex],
                                status: newStatus,
                                statusOrderId: statusId,
                            };
                        }
                    }
                } catch (error) {
                    console.error("Error updating order status:", error);
                }
            })
        );

        setOrders(updatedOrders);
        setSelectedOrders(new Set());
    };

    const handleCancel = () => {
        setShowCancelModal(true);
    };

    const confirmCancel = async () => {
        const selectedOrderIds = Array.from(selectedOrders);
        setIsSendingEmail(true);

        try {
            for (const orderId of selectedOrderIds) {
                const response = await axios.put(
                    `http://localhost:8080/api/cancel/${orderId}`,
                    null,
                    {
                        params: {
                            reason:
                                selectedCancelReason === "Khác"
                                    ? cancelReason
                                    : selectedCancelReason,
                        },
                    }
                );

                if (response.status === 200) {
                    handleOrderAction("Đã hủy");
                }
            }

            setShowCancelModal(false);
            setCancelReason("");
            setSelectedCancelReason("");
        } catch (error) {
            console.error("Error canceling order:", error);
        } finally {
            setIsSendingEmail(false);
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="container mx-auto mt-4 p-4 bg-white shadow-lg rounded-lg">
            <div className="border-b-2 pb-2 mb-4">
                <div className="flex justify-between mb-4">
                    <input
                        type="text"
                        placeholder="Tìm kiếm đơn hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border p-2 w-full"
                    />
                </div>
                <div className="flex justify-around">{tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`text-lg p-2 transition-all rounded-md relative ${
                            activeTab === tab.id
                                ? "text-[#00b7c0]" // Chỉ thay đổi màu chữ khi active
                                : "text-gray-500"
                        }`}
                        onClick={() => handleTabChange(tab.id)}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#00b7c0]"/> // Đường gạch dưới
                        )}
                    </button>
                ))}</div>

            </div>

            <div className="mb-6 flex justify-end">
                {activeTab === "Chờ xác nhận" && (
                    <button
                        onClick={() => handleOrderAction("Đang vận chuyển")}
                        className="bg-green-600 text-white p-2 rounded-md mr-2"
                        disabled={selectedOrders.size === 0}
                    >
                        Xác nhận
                    </button>
                )}
                {activeTab === "Đang vận chuyển" && (
                    <button
                        onClick={() => handleOrderAction("Chờ giao hàng")}
                        className="bg-green-600 text-white p-2 rounded-md mr-2"
                        disabled={selectedOrders.size === 0}
                    >
                        Bắt đầu giao hàng
                    </button>
                )}
                {activeTab === "Chờ giao hàng" && (
                    <button
                        onClick={() => handleOrderAction("Hoàn thành")}
                        className="bg-green-600 text-white p-2 rounded-md mr-2"
                        disabled={selectedOrders.size === 0}
                    >
                        Hoàn thành
                    </button>
                )}
                {activeTab === "Chờ xác nhận" && (
                    <button
                        onClick={handleCancel}
                        className="bg-red-600 text-white p-2 rounded-md"
                        disabled={selectedOrders.size === 0}
                    >
                        Hủy đơn hàng
                    </button>
                )}
            </div>

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
                            <th className="border p-2">Phương thức thanh toán</th>
                            <th className="border p-2">Thời gian tạo đơn</th>
                            <th className="border p-2">Thông tin khách hàng</th>
                            <th className="border p-2">Trạng thái</th>
                            <th className="border p-2">Chọn</th>
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
                                    <td className={`border p-2 ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </td>
                                    <td className="border p-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedOrders.has(order.orderId)}
                                            onChange={() => handleCheckboxChange(order.orderId)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showCancelModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-lg mb-4">Lý do hủy đơn hàng</h2>
                        <select
                            value={selectedCancelReason}
                            onChange={(e) => {
                                setSelectedCancelReason(e.target.value);
                                if (e.target.value !== "Khác") {
                                    setCancelReason("");
                                }
                            }}
                            className="border p-2 w-full mb-4"
                        >
                            <option value="">Chọn lý do</option>
                            {cancelReasons.map((reason) => (
                                <option key={reason} value={reason}>
                                    {reason}
                                </option>
                            ))}
                            <option value="Khác">Khác</option>
                        </select>
                        {selectedCancelReason === "Khác" && (
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Nhập lý do khác..."
                                className="border p-2 w-full mb-4"
                            />
                        )}
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="bg-gray-300 text-black p-2 rounded-md mr-2"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmCancel}
                                className={`bg-red-600 text-white p-2 rounded-md ${
                                    isSendingEmail ? "opacity-50" : ""
                                }`}
                                disabled={isSendingEmail}
                            >
                                {isSendingEmail ? "Đang xử lý..." : "Xác nhận hủy"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
