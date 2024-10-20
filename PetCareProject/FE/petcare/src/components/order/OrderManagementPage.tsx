import React from 'react';
import './style.css';
import {useOrderContext} from './OrderContext';
import {Order} from './OrderContext';
import * as Icons from '@mui/icons-material';

function OrderItem({order}: { order: Order }) {
    const renderButtons = () => {
        switch (order.status) {
            case 'Đang xử lý':
                return (
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Hủy đơn hàng
                    </button>
                );
            case 'Đã giao':
                return (
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Xác nhận đã nhận hàng
                    </button>
                );
            case 'Hoàn thành':
                return (
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Mua Lại
                    </button>
                );

            default:
                return null;
        }
    };

    return (
        <div className="border p-4 mb-2 rounded-lg shadow-md top" style={{width: '900px'}}>
            <div className={`flex items-center px-4 py-2 rounded-lg mb-4 ${getStatusClass(order.status)}`}>
                <span className="material-icons mr-2">{getStatusIcon(order.status)}</span>
                <span className="uppercase font-semibold">{getStatusText(order.status)}</span>
            </div>

            {order.items.map((item, index) => (
                <div key={index} className="flex items-center mb-2 order-item">
                    <div className="w-1/7 pr-4">
                        <img src={item.imageUrl || 'https://via.placeholder.com/80'} alt={item.name}
                             className="w-20 h-20 object-cover rounded"/>
                    </div>
                    <div className="flex-grow flex flex-col">
                        <div className="flex items-center">
                            {item.isGift && <div
                                className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold mt-1 inline-block mr-2">Quà
                                tặng</div>}
                            <h3 className="text-base text-black font-medium flex-grow text-left">{item.name}</h3>
                        </div>
                        {item.variant &&
                            <p className="text-gray-500 text-sm text-left">Phân loại hàng: {item.variant}</p>}
                        <div className="flex justify-between items-center mt-2">
                            <div
                                className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">x{item.quantity}</div>
                            <p className="text-gray-700 font-semibold">
                                {item.price.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}
                            </p>
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex justify-end mt-4 border-t-2 border-t-black">
                <div className="font-bold text-black pt-4 pb-4">
                    Thành tiền: {order.total.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}
                </div>
            </div>

            <div className="flex justify-end mt-2 space-x-4">
                {renderButtons()}
            </div>
        </div>
    );
}

function OrderManagementPage() {
    const {activeTab, orders, setActiveTab} = useOrderContext();

    const filteredOrders = activeTab === 'Tất cả'
        ? orders
        : orders.filter(order => order.status === activeTab);

    return (
        <div className="container flex item justify-center mx-auto p-4">
            <div className="flex justify-center space-x-4 mb-4 text-black fixed top-0 left-0 w-full bg-white z-10 p-4">
                {['Tất cả', 'Đang xử lý', 'Đang giao', 'Đã giao', 'Hoàn thành', 'Đã hủy', 'Trả hàng/Hoàn tiền'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="pt-8">
                {filteredOrders.length > 0 ? (
                    <div>
                        {filteredOrders.map(order => (
                            <OrderItem key={order.id} order={order}/>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-screen">
                        <img src="./src/assets/Order.png" alt="Clipboard icon" className="w-[200px] h-[200px]"/>
                        <p className="text-gray-500 text-xl">Chưa có đơn hàng</p>
                    </div>
                )}
            </div>
        </div>
    );
}


function getStatusClass(status: string) {
    switch (status) {
        case 'Đang xử lý':
            return 'status-dxl';
        case 'Đang giao':
            return 'status-dg';
        case 'Đã giao':
            return 'status-dag';
        case 'Hoàn thành':
            return 'status-ht';
        case 'Đã hủy':
            return 'status-dh';
        case 'Trả hàng/Hoàn tiền':
            return 'status-Tra-hang-Hoan-tien';
        default:
            return 'gray';
    }
}

function getStatusText(status: string) {
    switch (status) {
        case 'Đang xử lý':
            return 'Đang xử lý';
        case 'Đang giao':
            return 'Đang giao';
        case 'Đã giao':
            return 'Giao hàng thành công';
        case 'Hoàn thành':
            return 'Đơn hàng thành công';
        case 'Đã hủy':
            return 'Đã hủy';
        case 'Trả hàng/Hoàn tiền':
            return 'Trả hàng/Hoàn tiền';
        default:
            return status;
    }
}

function getStatusIcon(status: string) {
    switch (status) {
        case 'Đang xử lý':
            return <Icons.Schedule/>;
        case 'Đang giao':
            return <Icons.LocalShipping/>;
        case 'Đã giao':
            return <Icons.CheckCircle/>;
        case 'Hoàn thành':
            return <Icons.AssignmentTurnedIn/>;
        case 'Đã hủy':
            return <Icons.Cancel/>;
        case 'Trả hàng/Hoàn tiền':
            return <Icons.Replay/>;
        default:
            return <Icons.Help/>;
    }
}

export default OrderManagementPage;