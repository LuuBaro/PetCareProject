import React, { useState, useEffect } from 'react';
import BrandService from '../../service/BrandService';

const ManageBrand = () => {
    // Khai báo trạng thái cho danh sách thương hiệu, thương hiệu hiện tại, trạng thái tải và lỗi
    const [brands, setBrands] = useState([]); // Danh sách thương hiệu
    const [brand, setBrand] = useState({ brandName: '' }); // Thương hiệu hiện tại
    const [loading, setLoading] = useState(false); // Trạng thái tải
    const [error, setError] = useState(null); // Thông báo lỗi

    // Sử dụng useEffect để gọi hàm fetchBrands khi component được mount
    useEffect(() => {
        fetchBrands();
    }, []);

    // Hàm lấy danh sách thương hiệu từ dịch vụ
    const fetchBrands = async () => {
        setLoading(true); // Bắt đầu trạng thái tải
        setError(null); // Đặt lại thông báo lỗi
        try {
            const response = await BrandService.getAllBrands(); // Gọi dịch vụ lấy danh sách thương hiệu
            setBrands(response.data); // Cập nhật danh sách thương hiệu
        } catch (error) {
            console.error('Lỗi khi tải danh sách thương hiệu:', error); // Ghi log lỗi
            setError('Không thể tải danh sách thương hiệu. Vui lòng thử lại sau.'); // Đặt thông báo lỗi
        } finally {
            setLoading(false); // Kết thúc trạng thái tải
        }
    };

    // Hàm xử lý việc tạo hoặc cập nhật thương hiệu
    const handleCreateOrUpdateBrand = async () => {
        if (!brand.brandName.trim()) { // Kiểm tra tên thương hiệu có hợp lệ không
            setError('Tên thương hiệu là bắt buộc.'); // Đặt thông báo lỗi nếu tên không hợp lệ
            return; // Dừng hàm
        }

        setError(null); // Đặt lại thông báo lỗi
        try {
            if (brand.brandId) { // Kiểm tra nếu thương hiệu đã có ID (cập nhật)
                await BrandService.updateBrand(brand.brandId, brand); // Cập nhật thương hiệu
            } else { // Nếu không có ID (tạo mới)
                await BrandService.createBrand({ brandName: brand.brandName }); // Tạo thương hiệu mới
            }
            setBrand({ brandName: '' }); // Đặt lại form
            fetchBrands(); // Gọi lại hàm lấy danh sách thương hiệu
        } catch (error) {
            console.error('Lỗi khi lưu thương hiệu:', error); // Ghi log lỗi
            setError('Không thể lưu thương hiệu. Vui lòng thử lại.'); // Đặt thông báo lỗi
        }
    };

    // Hàm xử lý việc xóa thương hiệu
    const handleDeleteBrand = async (brandId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này không?')) { // Xác nhận xóa
            try {
                await BrandService.deleteBrand(brandId); // Gọi dịch vụ xóa thương hiệu
                fetchBrands(); // Gọi lại hàm lấy danh sách thương hiệu
            } catch (error) {
                console.error('Lỗi khi xóa thương hiệu:', error); // Ghi log lỗi
                setError('Không thể xóa thương hiệu. Vui lòng thử lại.'); // Đặt thông báo lỗi
            }
        }
    };

    // Hàm xử lý việc chỉnh sửa thương hiệu
    const handleEditBrand = (brand) => {
        setBrand(brand); // Đặt thương hiệu hiện tại để chỉnh sửa
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4 text-center">Quản lý Thương hiệu</h2>

            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                    {brand.brandId ? 'Cập nhật Thương hiệu' : 'Thêm Thương hiệu Mới'}
                </h3>
                <div className="flex space-x-4">
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                        value={brand.brandName} // Giá trị của input là tên thương hiệu
                        onChange={(e) => setBrand({ ...brand, brandName: e.target.value })} // Cập nhật tên thương hiệu khi người dùng nhập
                        placeholder="Nhập tên thương hiệu"
                    />
                    <button
                        onClick={handleCreateOrUpdateBrand} // Gọi hàm tạo hoặc cập nhật thương hiệu khi nhấn nút
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        {brand.brandId ? 'Cập nhật' : 'Thêm'}
                    </button>
                </div>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>} // Hiển thị thông báo lỗi nếu có
            {loading ? (
                <p className="text-center">Đang tải danh sách thương hiệu...</p> // Hiển thị thông báo tải
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-3 px-6 text-left">ID</th>
                                <th className="py-3 px-6 text-left">Tên</th>
                                <th className="py-3 px-6 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands.length === 0 ? ( // Kiểm tra nếu không có thương hiệu nào
                                <tr>
                                    <td colSpan="3" className="text-center py-4">
                                        Không có thương hiệu nào
                                    </td>
                                </tr>
                            ) : (
                                brands.map((brand) => ( // Duyệt qua danh sách thương hiệu để hiển thị
                                    <tr key={brand.brandId} className="border-t hover:bg-gray-100">
                                        <td className="py-3 px-6">{brand.brandId}</td>
                                        <td className="py-3 px-6">{brand.brandName}</td>
                                        <td className="py-3 px-6 text-center">
                                            <button
                                                onClick={() => handleEditBrand(brand)} // Gọi hàm chỉnh sửa thương hiệu khi nhấn nút
                                                className="px-4 py-1 text-sm text-white bg-yellow-500 rounded-md hover:bg-yellow-600 mr-2"
                                            >
                                                Chỉnh sửa
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBrand(brand.brandId)} // Gọi hàm xóa thương hiệu khi nhấn nút
                                                className="px-4 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageBrand;
