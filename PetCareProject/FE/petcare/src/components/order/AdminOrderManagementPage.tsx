import React from 'react';

import {useOrderContext} from './OrderContext';

function AdminOrderManagementPage() {
    const {orders, setOrders} = useOrderContext();

    const handleOrderStatusChange = (orderId: number, newStatus: string) => {
        setOrders(orders.map(order =>
            order.id === orderId ? {...order, status: newStatus} : order
        ));
    };

    return (
        <div>
            <h2>Quản lý đơn hàng (Admin)</h2>
            <ul>
                {orders.map(order => (
                    <li key={order.id}>
                        <h3>Đơn hàng #{order.id}</h3>
                        <p>Trạng thái hiện tại: {order.status}</p>
                        <select value={order.status} onChange={e => handleOrderStatusChange(order.id, e.target.value)}>
                            <option value="Chờ lấy hàng">Chờ lấy hàng</option>
                            <option value="Đang giao">Đang giao</option>
                            <option value="Hoàn thành">Hoàn thành</option>
                            {/* ... các trạng thái khác */}
                        </select>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminOrderManagementPage;