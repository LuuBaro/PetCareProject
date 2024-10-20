import React, { useEffect, useState } from 'react';
import RoleService from '../../service/RoleService'; // Dịch vụ RoleService để gọi API

const ManageRole = () => {
  const [roles, setRoles] = useState([]); // Lưu trữ danh sách roles
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [message, setMessage] = useState(''); // Thông báo cho người dùng
  const [roleToEdit, setRoleToEdit] = useState(null); // Vai trò đang được sửa
  const [formMode, setFormMode] = useState('add'); // Chế độ form

  // Hàm gọi API để lấy danh sách roles
  const fetchRoles = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const roleList = await RoleService.getAllRoles(); // Gọi API để lấy danh sách roles
      setRoles(roleList); // Cập nhật danh sách roles
    } catch (error) {
      console.error('Lỗi khi lấy danh sách vai trò:', error.response ? error.response.data : error.message); // Log thêm thông tin
      setMessage('Lỗi khi lấy danh sách vai trò.'); // Hiển thị thông báo lỗi
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  useEffect(() => {
    fetchRoles(); // Lấy danh sách roles khi component được render lần đầu
  }, []);

  const handleRoleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    const roleData = {
      roleName: e.target.roleName.value
    };

    try {
      if (formMode === 'edit') {
        await RoleService.updateRole(roleToEdit.roleId, roleData); // Cập nhật vai trò
        setMessage('Cập nhật vai trò thành công!'); // Thông báo thành công
      } else {
        await RoleService.createRole(roleData); // Thêm vai trò mới
        setMessage('Thêm vai trò thành công!'); // Thông báo thành công
      }
      e.target.reset(); // Reset form sau khi thêm/cập nhật thành công
      fetchRoles(); // Cập nhật danh sách vai trò
      setRoleToEdit(null); // Đặt lại form
      setFormMode('add'); // Đặt lại chế độ form
    } catch (error) {
      console.error('Lỗi khi lưu vai trò:', error);
      setMessage('Lỗi khi lưu vai trò.');
    }
  };

  const handleEdit = (role) => {
    setRoleToEdit(role); // Thiết lập vai trò để sửa
    setFormMode('edit'); // Chuyển sang chế độ sửa
  };

  const handleDelete = async (roleId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vai trò này không?')) {
      try {
        await RoleService.deleteRole(roleId); // Gọi API để xóa vai trò
        fetchRoles(); // Cập nhật danh sách roles
        setMessage('Xóa vai trò thành công!'); // Thông báo thành công
      } catch (error) {
        console.error('Lỗi khi xóa vai trò:', error);
        setMessage('Lỗi khi xóa vai trò.');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý vai trò</h1>
      {message && <div className="mb-4 text-red-600">{message}</div>} {/* Hiển thị thông báo nếu có */}

      <div className="bg-white p-5 rounded shadow-lg mb-4">
        <h2 className="text-xl mb-4">{formMode === 'edit' ? 'Sửa vai trò' : 'Thêm vai trò'}</h2>
        <form onSubmit={handleRoleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Tên vai trò</label>
            <input
              name="roleName"
              type="text"
              defaultValue={roleToEdit ? roleToEdit.roleName : ''} // Nếu đang sửa, điền tên vai trò
              required
              className="border p-2 w-full"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white rounded p-2">
            {formMode === 'edit' ? 'Cập nhật' : 'Lưu'}
          </button>
        </form>
      </div>

      {loading ? (
        <p>Đang tải danh sách vai trò...</p> // Hiển thị trạng thái loading
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Tên vai trò</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(role => (
              <tr key={role.roleId}> {/* Mỗi dòng đại diện cho một vai trò */}
                <td className="border p-2">{role.roleId}</td> {/* Hiển thị ID vai trò */}
                <td className="border p-2">{role.roleName}</td> {/* Hiển thị tên vai trò */}
                <td className="border p-2">
                  <button className="bg-yellow-500 text-white rounded p-1 mr-2" onClick={() => handleEdit(role)}>
                    Sửa
                  </button>
                  <button className="bg-red-500 text-white rounded p-1" onClick={() => handleDelete(role.roleId)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageRole;
