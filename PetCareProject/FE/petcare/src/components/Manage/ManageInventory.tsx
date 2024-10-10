import React, { useEffect, useState } from 'react';
import OrderService from '../../service/OrderService';
import StatusOderService from '../../service/StatusOderService';

export interface StatusOder {
    name: string;
}

export interface Order {
    orderId: number;
    totalAmount: number;
    statusOder: StatusOder; // Assuming statusOder is part of the order object
}

const OrderManagement = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await OrderService.getAllOrders();
                setOrders(response);
            } catch (err) {
                setError('Error fetching orders data');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleConfirmOrder = async (orderId: number) => {
        try {
            // Cập nhật trạng thái đơn hàng
            await OrderService.updateOrderStatus(orderId, 'Đang xử lý');

            // Cập nhật trạng thái trong bảng status_orders
            const statusOrder = { name: 'Chờ xử lý' };
            await StatusOderService.updateStatusOrder(orderId, statusOrder); // Sử dụng ID của đơn hàng hoặc status order ID nếu có

            // Cập nhật lại trạng thái trong state
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.orderId === orderId
                        ? { ...order, statusOder: { name: 'Đang xử lý' } }
                        : order
                )
            );
        } catch (err) {
            setError('Error updating order status');
        }
    };

    const handleStartShipping = async (orderId: number) => {
        try {
            await OrderService.updateOrderStatus(orderId, 'Đang giao');
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.orderId === orderId
                        ? { ...order, statusOder: { name: 'Đang giao' } }
                        : order
                )
            );
        } catch (err) {
            setError('Error updating order status');
        }
    };

    const handleCompleteOrder = async (orderId: number) => {
        try {
            await OrderService.updateOrderStatus(orderId, 'Hoàn thành');
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.orderId === orderId
                        ? { ...order, statusOder: { name: 'Hoàn thành' } }
                        : order
                )
            );
        } catch (err) {
            setError('Error updating order status');
        }
    };

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (orders.length === 0) return <p className="text-center text-gray-600">No orders found.</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Danh sách đơn hàng</h2>
            <ul className="space-y-4">
                {orders.map((order) => (
                    <li key={order.orderId} className="p-4 bg-gray-50 rounded-lg shadow-md">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xl font-semibold text-gray-700">Mã đơn hàng: {order.orderId}</p>
                                <p className="text-lg text-gray-600">Tổng số tiền: {order.totalAmount.toLocaleString()} VNĐ</p>
                                <p className="text-md text-gray-500">Trạng thái: {order.statusOder?.name || 'Không xác định'}</p>
                            </div>
                            <div>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300"
                                    onClick={() => handleConfirmOrder(order.orderId)}
                                >
                                    Xác nhận đơn hàng
                                </button>
                                <button
                                    className="ml-2 px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition duration-300"
                                    onClick={() => handleStartShipping(order.orderId)}
                                >
                                    Bắt đầu giao hàng
                                </button>
                                <button
                                    className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition duration-300"
                                    onClick={() => handleCompleteOrder(order.orderId)}
                                >
                                    Hoàn thành
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderManagement;
