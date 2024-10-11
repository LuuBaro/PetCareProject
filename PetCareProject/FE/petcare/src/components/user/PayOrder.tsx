import React from 'react';

const PayOrder: React.FC = () => {
    return (
        <div className="flex">
            <aside className="w-1/4 bg-white p-4">
                <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div className="ml-4">
                        <div className="font-bold">minhkung</div>
                        <div className="text-sm text-gray-500">Sửa Hồ Sơ</div>
                    </div>
                </div>
                <nav>
                    <ul>
                        <li className="mb-2">
                            <a href="#" className="flex items-center text-red-500">
                                <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center mr-2">10.10</span>
                                10.10 Đại Tiệc Thương Hiệu
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="flex items-center text-gray-700">
                                <i className="fas fa-user mr-2"></i>
                                Tài Khoản Của Tôi
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="flex items-center text-gray-700">
                                <i className="fas fa-shopping-cart mr-2"></i>
                                Đơn Mua
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="flex items-center text-gray-700">
                                <i className="fas fa-bell mr-2"></i>
                                Thông Báo
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="flex items-center text-gray-700">
                                <i className="fas fa-ticket-alt mr-2"></i>
                                Kho Voucher
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="flex items-center text-gray-700">
                                <i className="fas fa-coins mr-2"></i>
                                Shopee Xu
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="w-3/4 p-4">
                <div className="bg-white p-4 mb-4">
                    <ul className="flex border-b">
                        <li className="mr-4 pb-2 border-b-2 border-transparent">
                            <a href="#" className="text-gray-700">Tất cả</a>
                        </li>
                        <li className="mr-4 pb-2 border-b-2 border-transparent">
                            <a href="#" className="text-gray-700">Chờ thanh toán</a>
                        </li>
                        <li className="mr-4 pb-2 border-b-2 border-red-500">
                            <a href="#" className="text-red-500">Chờ giao hàng (3)</a>
                        </li>
                        <li className="mr-4 pb-2 border-b-2 border-transparent">
                            <a href="#" className="text-gray-700">Hoàn thành</a>
                        </li>
                        <li className="mr-4 pb-2 border-b-2 border-transparent">
                            <a href="#" className="text-gray-700">Đã hủy</a>
                        </li>
                        <li className="mr-4 pb-2 border-b-2 border-transparent">
                            <a href="#" className="text-gray-700">Trả hàng/Hoàn tiền</a>
                        </li>
                    </ul>
                </div>
                <div className="bg-white p-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="font-bold">KINGZONE - SIÊU THỊ ĐIỆN...</div>
                        <div className="flex items-center">
                            <button className="text-red-500 border border-red-500 px-2 py-1 mr-2">Chat</button>
                            <button className="text-gray-700 border border-gray-300 px-2 py-1">Xem Shop</button>
                        </div>
                    </div>
                    <div className="flex mb-4">
                        <img src="https://placehold.co/60x60" alt="Tai Nghe Bluetooth Không Dây" className="w-16 h-16 mr-4" />
                        <div>
                            <div className="font-bold">Tai Nghe Bluetooth Không Dây AP3 Mới Full Box Nghe Nhạc Hay Chơi Game Ổn Định Kèm Micro Nghe Gọi Bảo Hành 12 Tháng</div>
                            <div className="text-sm text-gray-500">x1</div>
                            <div className="text-sm text-blue-500">Trả hàng miễn phí 15 ngày</div>
                        </div>
                    </div>
                    <div className="flex mb-4">
                        <img src="https://placehold.co/60x60" alt="Quà Tặng 50k Không Bán Vỏ tai nghe bluetooth" className="w-16 h-16 mr-4" />
                        <div>
                            <div className="font-bold text-red-500">Quà Tặng</div>
                            <div className="font-bold">Quà Tặng 50k Không Bán Vỏ tai nghe bluetooth</div>
                            <div className="text-sm text-gray-500">x1</div>
                        </div>
                    </div>
                    <div className="text-right text-red-500 line-through">499.000</div>
                    <div className="text-right text-red-500">387.000</div>
                    <div className="text-right font-bold text-red-500">Thành tiền: ₫348.300</div>
                    <div className="flex justify-end mt-4">
                        <button className="bg-gray-200 text-gray-500 px-4 py-2 mr-2">Đã Nhận Hàng</button>
                        <button className="bg-gray-200 text-gray-500 px-4 py-2 mr-2">Xác Nhận Hủy</button>
                        <button className="bg-gray-200 text-gray-500 px-4 py-2">Liên Hệ Người Bán</button>
                    </div>
                </div>
                <div className="bg-white p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="font-bold">THE BEST AMG</div>
                        <div className="flex items-center">
                            <button className="text-red-500 border border-red-500 px-2 py-1 mr-2">Chat</button>
                            <button className="text-gray-700 border border-gray-300 px-2 py-1">Xem Shop</button>
                        </div>
                    </div>
                    <div className="flex mb-4">
                        <img src="https://placehold.co/60x60" alt="Chuột Máy Tính Gaming Có Dây Led RGB G502" className="w-16 h-16 mr-4" />
                        <div>
                            <div className="font-bold">Chuột Máy Tính Gaming Có Dây Led RGB G502 OEM Thiết Kế 8 Nút Cực Đẹp Tốc Độ 7200 DPI Chơi Game Siêu Nhạy</div>
                            <div className="text-sm text-gray-500">Phân loại hàng: Chuột G502 Có App</div>
                            <div className="text-sm text-gray-500">x1</div>
                            <div className="text-sm text-blue-500">Trả hàng miễn phí 15 ngày</div>
                        </div>
                    </div>
                    <div className="text-right text-red-500 line-through">699.000</div>
                    <div className="text-right text-red-500">389.000</div>
                    <div className="text-right font-bold text-red-500">Thành tiền: ₫336.600</div>
                    <div className="flex justify-end mt-4">
                        <button className="bg-gray-200 text-gray-500 px-4 py-2 mr-2">Đã Nhận Hàng</button>
                        <button className="bg-gray-200 text-gray-500 px-4 py-2 mr-2">Xác Nhận Hủy</button>
                        <button className="bg-gray-200 text-gray-500 px-4 py-2">Liên Hệ Người Bán</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PayOrder;
