import React, { useEffect, useState } from 'react';
import UserService from '../../service/UserService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ fullname: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedUser) {
        await UserService.updateUser(selectedUser.id, formData);
        setMessage('User updated successfully!');
      } else {
        await UserService.createUser(formData);
        setMessage('User added successfully!');
      }
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('Error submitting form.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedUser(null);
    setFormData({ fullname: '', email: '', phone: '', password: '' });
    setMessage('');
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({ fullname: user.fullname, email: user.email, phone: user.phone || '', password: '' }); // Keep password blank on edit
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await UserService.deleteUser(id);
      setMessage('User deleted successfully!');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage('Error deleting user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý người dùng</h1>
      {message && <div className="mb-4 text-green-600">{message}</div>}
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="fullname"
          placeholder="Họ và tên"
          value={formData.fullname}
          onChange={handleChange}
          className="border rounded p-2 mr-2"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border rounded p-2 mr-2"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          value={formData.phone}
          onChange={handleChange}
          className="border rounded p-2 mr-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          className="border rounded p-2 mr-2"
          required={!selectedUser} // Password is required only when creating a new user
        />
        <button type="submit" className="bg-blue-500 text-white rounded p-2" disabled={loading}>
          {loading ? 'Loading...' : (selectedUser ? 'Cập nhật' : 'Thêm')}
        </button>
        <button type="button" onClick={resetForm} className="bg-gray-500 text-white rounded p-2 ml-2">
          Hủy
        </button>
      </form>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Họ và tên</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Số điện thoại</th>
              <th className="border p-2">Mật khẩu</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="border p-2">{user.fullname}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.phone || 'Chưa có'}</td>
                <td className="border p-2">********</td> {/* Mask password */}
                <td className="border p-2">
                  <button onClick={() => handleEdit(user)} className="bg-yellow-500 text-white rounded p-1 mr-2">
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white rounded p-1">
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

export default UserManagement;
