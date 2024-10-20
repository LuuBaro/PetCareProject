import React, { useEffect, useState } from 'react';
import UserService from '../../service/UserService';
import RoleService from '../../service/RoleService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formMode, setFormMode] = useState('add');
  const [userToEdit, setUserToEdit] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(0);
  const [usersPerPage] = useState(10);

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    totalSpent: '',
    password: '',
    roles: '',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const userList = await UserService.getAllUsers();
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage('Error fetching users.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const roleList = await RoleService.getAllRoles();
      setRoles(roleList);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setMessage('Error fetching roles.');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleEdit = (user) => {
    setUserToEdit(user);
    setFormMode('edit');
    setSelectedRoles(user.userRoles.map(userRole => userRole.roleId));
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      fullName: e.target.fullName.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      totalSpent: Number(e.target.totalSpent.value),
      password: formMode === 'add' ? e.target.password.value : undefined,
      userRoles: selectedRoles.map(roleId => ({ roleId })),
      registrationDate: formMode === 'edit' ? userToEdit.registrationDate : new Date().toISOString(),
    };

    if (validateForm(userData)) {
      try {
        const existingUser = users.find(user => user.email === userData.email || user.phone === userData.phone);

        if (existingUser && existingUser.userId !== userToEdit?.userId) {
          setErrors(prevErrors => ({
            ...prevErrors,
            email: 'Email đã tồn tại.',
            phone: 'Số điện thoại đã tồn tại.',
          }));
          return;
        }

        if (formMode === 'edit') {
          await UserService.updateUser(userToEdit.userId, userData);
          setMessage('Người dùng đã được cập nhật thành công.');
        } else {
          await UserService.createUser(userData);
          setMessage('Người dùng đã được thêm thành công.');
        }
        fetchUsers();
        resetForm();
      } catch (error) {
        console.error('Error saving user:', error);
        setMessage('Error saving user.');
      }
    }
  };

  const handleDelete = async (userId) => {
    const user = users.find(user => user.userId === userId);
    const isAdmin = user.userRoles.some(userRole => {
      const role = roles.find(role => role.roleId === userRole.roleId);
      return role && role.roleName === 'Admin';
    });

    if (isAdmin) {
      alert('Không thể xóa người dùng có chức vụ là Admin.');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
      try {
        await UserService.deleteUser(userId);
        fetchUsers();
        setMessage('Người dùng đã được xóa thành công.');
      } catch (error) {
        console.error('Error deleting user:', error);
        setMessage('Error deleting user.');
      }
    }
  };

  const handleRoleChange = (e) => {
    const options = e.target.options;
    const value = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setSelectedRoles(value);
  };

  const resetForm = () => {
    setUserToEdit(null);
    setFormMode('add');
    setSelectedRoles([]);
    setErrors({ fullName: '', email: '', phone: '', totalSpent: '', password: '', roles: '' });
    setMessage('');
    setSearchTerm('');
    document.getElementById("userForm").reset();
  };

  const validateForm = (userData) => {
    let valid = true;
    const newErrors = {
      fullName: '',
      email: '',
      phone: '',
      totalSpent: '',
      password: '',
      roles: '',
    };

    if (!userData.fullName || userData.fullName.length < 2 || userData.fullName.length > 50) {
      newErrors.fullName = 'Họ và tên phải lớn hơn 2 ký tự (tối đa 50 ký tự).';
      valid = false;
    }

    if (!userData.email || !/^\S+@\S+\.\S+$/.test(userData.email)) {
      newErrors.email = 'Email không đúng định dạng (ví dụ: example@domain.com).';
      valid = false;
    }

    if (!userData.phone || userData.phone.length < 10 || userData.phone.length > 15) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10-15 ký tự).';
      valid = false;
    }

    if (userData.totalSpent !== undefined && (isNaN(userData.totalSpent) || userData.totalSpent < 0)) {
      newErrors.totalSpent = 'Tổng chi tiêu phải là số và không nhỏ hơn 0.';
      valid = false;
    }

    if (formMode === 'add' && (!userData.password || userData.password.length < 8)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự.';
      valid = false;
    }

    if (selectedRoles.length === 0) {
      newErrors.roles = 'Chức vụ không được để trống.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const renderRoles = (user) => {
    return user.userRoles.map(userRole => {
      const role = roles.find(role => role.roleId === userRole.roleId);
      return role ? role.roleName : '';
    }).join(', ');
  };

  const filteredUsers = users.filter(user => {
    const roleNames = user.userRoles.map(userRole => {
      const role = roles.find(role => role.roleId === userRole.roleId);
      return role ? role.roleName : '';
    }).join(', ');

    return (
      (activeTab === 'users' ? roleNames.includes('Người dùng') : roleNames !== 'Người dùng') &&
      (user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || user.phone.includes(searchTerm))
    );
  });

  const paginatedUsers = filteredUsers.slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage);
  const pageCount = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      {message && <div className="mb-4 text-red-600 font-bold">{message}</div>}

      <h2 className="text-xl mt-6 mb-4">{formMode === 'add' ? 'Thêm Người dùng' : 'Chỉnh sửa Người dùng'}</h2>

      <form id="userForm" onSubmit={handleUserSubmit} className="mb-4">
        <div className="mb-4">
          <label className="block text-gray-700">Họ và tên</label>
          <input type="text" name="fullName" defaultValue={userToEdit ? userToEdit.fullName : ''} className={`border rounded w-full py-2 px-3 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.fullName && <p className="text-red-500">{errors.fullName}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input type="text" name="email" defaultValue={userToEdit ? userToEdit.email : ''} className={`border rounded w-full py-2 px-3 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700">Số điện thoại</label>
          <input type="text" name="phone" defaultValue={userToEdit ? userToEdit.phone : ''} className={`border rounded w-full py-2 px-3 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.phone && <p className="text-red-500">{errors.phone}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Tổng chi tiêu</label>
          <input type="number" name="totalSpent" defaultValue={userToEdit ? userToEdit.totalSpent : 0} className={`border rounded w-full py-2 px-3 ${errors.totalSpent ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.totalSpent && <p className="text-red-500">{errors.totalSpent}</p>}
        </div>

        {formMode === 'add' && (
          <div className="mb-4">
            <label className="block text-gray-700">Mật khẩu</label>
            <input type="password" name="password" className={`border rounded w-full py-2 px-3 ${errors.password ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700">Chức vụ</label>
          <select name="roles" value={selectedRoles} onChange={handleRoleChange} className={`border rounded w-full py-2 px-3 ${errors.roles ? 'border-red-500' : 'border-gray-300'}`}>
            {roles.map(role => (
              <option key={role.roleId} value={role.roleId}>{role.roleName}</option>
            ))}
          </select>
          {errors.roles && <p className="text-red-500">{errors.roles}</p>}
        </div>

        <div className="flex">
          <button type="submit" className="bg-blue-500 mr-3 text-white py-2 px-4 rounded">{formMode === 'add' ? 'Thêm' : 'Cập nhật'}</button>
          <button type="button" onClick={resetForm} className="bg-gray-500 text-white py-2 px-4 rounded">Hủy</button>
        </div>
      </form>

      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          <button onClick={() => setActiveTab('users')} className={`py-2 px-4 rounded ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>Người dùng</button>
          <button onClick={() => setActiveTab('employees')} className={`py-2 px-4 rounded ${activeTab === 'employees' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>Nhân viên</button>
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded py-2 px-4"
        />
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="min-w-full bg-white border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Họ và tên</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Số điện thoại</th>
              <th className="py-2 px-4 border-b">Tổng chi tiêu</th>
              <th className="py-2 px-4 border-b">Chức vụ</th>
              <th className="py-2 px-4 border-b">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(user => (
              <tr key={user.userId}>
                <td className="py-2 px-4 border-b">{user.fullName}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.phone}</td>
                <td className="py-2 px-4 border-b">{user.totalSpent}</td>
                <td className="py-2 px-4 border-b">{renderRoles(user)}</td>
                <td className="py-2 px-4 border-b">
                  <button onClick={() => handleEdit(user)} className="bg-yellow-500 text-white py-1 px-2 rounded mr-2">Sửa</button>
                  <button onClick={() => handleDelete(user.userId)} className="bg-red-500 text-white py-1 px-2 rounded">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4 flex justify-center">
        {Array.from({ length: pageCount }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`py-2 px-4 mx-1 ${index === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
