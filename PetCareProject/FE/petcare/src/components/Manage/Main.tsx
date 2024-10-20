import React from "react";
import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, BarElement, Title, Tooltip, Legend);
export default function MyMain() {
    const [visitorData] = useState({
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        datasets: [
            {
                label: 'Khách hàng trung thành',
                data: [300, 250, 270, 320, 300, 310, 280, 260, 240, 230, 200, 190],
                borderColor: '#6a1b9a',
                backgroundColor: 'rgba(106, 27, 154, 0.2)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Khách hàng mới',
                data: [180, 190, 220, 210, 260, 280, 310, 320, 300, 290, 250, 240],
                borderColor: '#e53935',
                backgroundColor: 'rgba(229, 57, 53, 0.2)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Khách hàng độc đáo',
                data: [250, 230, 260, 240, 280, 270, 300, 310, 320, 330, 290, 270],
                borderColor: '#2e7d32',
                backgroundColor: 'rgba(46, 125, 50, 0.2)',
                fill: true,
                tension: 0.4,
            }
        ]
    });

    const [targetRealityData] = useState({
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7'],
        datasets: [
            {
                label: 'Doanh thu thực tế',
                data: [8000, 9000, 7500, 8500, 11000, 12000, 9000],
                backgroundColor: '#388e3c',
                borderRadius: 5,
            },
            {
                label: 'Doanh thu mục tiêu',
                data: [10000, 11000, 10000, 12000, 13000, 12500, 11500],
                backgroundColor: '#fbc02d',
                borderRadius: 5,
            }
        ]
    });

    const [revenueData] = useState({
        labels: ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'],
        datasets: [
            {
                label: 'Doanh thu trực tuyến',
                data: [10000, 15000, 25000, 12000, 18000, 21000, 23000],
                backgroundColor: '#1565c0',
            },
            {
                label: 'Doanh thu ngoại tuyến',
                data: [8000, 11000, 5000, 8000, 12000, 16000, 9000],
                backgroundColor: '#2e7d32',
            }
        ]
    });

    const [satisfactionData] = useState({
        labels: ['Tháng trước', 'Tháng này'],
        datasets: [
            {
                label: 'Sự hài lòng của khách hàng',
                data: [1017, 1757],
                borderColor: '#1565c0',
                backgroundColor: 'rgba(21, 101, 192, 0.2)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Tăng trưởng sự hài lòng',
                data: [1070, 1750],
                borderColor: '#2e7d32',
                backgroundColor: 'rgba(46, 125, 50, 0.2)',
                fill: true,
                tension: 0.4,
            }
        ]
    });
    // Top Products Data
    const topProducts = [
        { id: 1, name: 'Home Decor Range', popularity: 75, color: '#1E88E5' },
        { id: 2, name: 'Disney Princess Pink Bag 18', popularity: 60, color: '#43A047' },
        { id: 3, name: 'Bathroom Essentials', popularity: 50, color: '#8E24AA' },
        { id: 4, name: 'Apple Smartwatches', popularity: 40, color: '#FB8C00' }
    ];

    useEffect(() => {
        // Placeholder for fetching data or other side effects
        // Example: Fetch data from an API
    }, []); // Empty dependency array means this effect runs once on mount

    return (
        <main className="flex-1 p-6 overflow-y-auto">
            <div className="container mx-auto">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                        <div className="text-4xl text-red-500 mb-2">📊</div>
                        <h5 className="text-2xl font-semibold">$1k</h5>
                        <p className="text-gray-600 mt-1">Doanh thu tổng<br /><small className="text-gray-400">Ngày qua +8%</small></p>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                        <div className="text-4xl text-yellow-500 mb-2">📋</div>
                        <h5 className="text-2xl font-semibold">300</h5>
                        <p className="text-gray-600 mt-1">Tổng số đơn hàng<br /><small className="text-gray-400">Ngày qua +5%</small></p>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                        <div className="text-4xl text-green-500 mb-2">🛒</div>
                        <h5 className="text-2xl font-semibold">5</h5>
                        <p className="text-gray-600 mt-1">Đã bán<br /><small className="text-gray-400">Ngày qua +1.2%</small></p>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                        <div className="text-4xl text-blue-500 mb-2">👥</div>
                        <h5 className="text-2xl font-semibold">1.2k</h5>
                        <p className="text-gray-600 mt-1">Khách hàng mới<br /><small className="text-gray-400">Ngày qua +2%</small></p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-3'>
                    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                        <h4 className="text-xl font-semibold mb-4">Doanh thu thực tế & Mục tiêu</h4>
                        <Bar data={targetRealityData} />
                    </div>
                    {/* Top Products Table */}
                    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 mt-6">
                        <h4 className="text-xl font-semibold mb-4">Top Products</h4>
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 text-left">ID</th>
                                    <th className="py-2 text-left">Name</th>
                                    <th className="py-2 text-left">Popularity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td className="py-2">{product.id}</td>
                                        <td className="py-2">{product.name}</td>
                                        <td className="py-2">
                                            <div className="relative w-full bg-gray-200 rounded">
                                                <div
                                                    className="absolute top-0 left-0 h-full rounded bg-blue-500"
                                                    style={{ width: `${product.popularity}%`, backgroundColor: product.color }}
                                                ></div>
                                                <div className="relative z-10 px-2 text-sm">{product.popularity}%</div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
                    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 ">
                        <h4 className="text-xl font-semibold mb-4">Khách hàng</h4>
                        <Line data={visitorData} />
                    </div>


                    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                        <h4 className="text-xl font-semibold mb-4">Doanh thu</h4>
                        <Bar data={revenueData} />
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 col-span-1 md:col-span-2 lg:col-span-1">
                        <h4 className="text-xl font-semibold mb-4">Sự hài lòng của khách hàng</h4>
                        <Line data={satisfactionData} />
                    </div>
                </div>



            </div>
        </main>
    );
}