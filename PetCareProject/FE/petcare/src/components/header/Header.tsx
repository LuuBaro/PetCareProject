import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate để chuyển hướng
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";

export default function Header() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate(); // Khai báo useNavigate

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSearchToggle = () => {
    setIsSearchActive(!isSearchActive);
    setSearchQuery("");
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token khi logout
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("fullName");
    setIsAuthenticated(false);
    navigate("/"); // Chuyển về trang chủ
  };
  
  const handleSearchSubmit = (event) => {
    if (event.key === "Enter") {
      // Thực hiện tìm kiếm
      alert(`Searching for: ${searchQuery}`); // Thay thế bằng logic tìm kiếm thực tế
      setSearchQuery("");
      setIsSearchActive(false);
    }
  };

  return (
    <header className="bg-[#00B7C0] relative">
      <div className="flex items-center justify-between mx-32 py-2">
        <div>
          <ul className="flex items-center justify-between flex-row gap-4 font-medium">
            {/* Social Media Icons */}
            <li className="hover:text-white transition ease-out duration-200">
              <a href="#">
                <FacebookOutlinedIcon sx={{ fontSize: 25 }} />
              </a>
            </li>
            <li className="hover:text-white transition ease-out duration-200">
              <a href="#">
                <img src="/src/assets/instagram.png" className="h-6" alt="" />
              </a>
            </li>
            <li className="hover:text-white transition ease-out duration-200">
              <a href="#">
                <img src="/src/assets/tiktok.png" className="h-7" alt="" />
              </a>
            </li>
            <li>
              <Link to="/" className="mx-2 hover:text-white transition ease-out duration-200">
                Trang Chủ
              </Link>
            </li>
            <li>
              <a href="#" className="mx-2 hover:text-white transition ease-out duration-200">
                Cửa Hàng
              </a>
            </li>
            <li>
              <a href="#" className="mx-2 hover:text-white transition ease-out duration-200">
                Về Chúng Tôi
              </a>
            </li>
          </ul>
        </div>
        <div className="max-w-[150px]">
          <a href="#">
            <img src="/src/assets/logo.png" alt="Logo" />
          </a>
        </div>
        <div>
          <ul className="flex items-center justify-between flex-row gap-4 font-medium">
            {/* Other Links */}
            <li>
              <a href="#" className="mx-2 hover:text-white transition ease-out duration-200">
                Liên Hệ
              </a>
            </li>
            <li>
              <Link to="/products" className="mx-2 hover:text-white transition ease-out duration-200">
                Sản Phẩm
              </Link>
            </li>
            <li>
              <button
                onClick={handleSearchToggle}
                className="mx-2 hover:text-white transition ease-out duration-200 flex items-center"
              >
                {isSearchActive ? (
                  <CloseIcon sx={{ fontSize: 25 }} />
                ) : (
                  <SearchIcon sx={{ fontSize: 25 }} />
                )}
              </button>
            </li>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={handleToggle}
                  className="flex items-center hover:text-white transition ease-out duration-200"
                >
                  <img
                    src="https://i.pinimg.com/originals/9f/c2/12/9fc2126eec2c0a3876e3f2097af9b983.gif"
                    alt="User Avatar"
                    className="h-9 w-9 rounded-full"
                  />
                 <span className="ml-2">Xin chào, {localStorage.getItem('fullName')}!</span> {/* Sử dụng fullName */}
                </button>

                {isOpen && (
                  <ul className="absolute w-[200px] right-[-30px] mt-2 border-gray-500 bg-blue-100 text-black rounded-md shadow-lg z-50">
                    <li className="hover:text-[#00B7C0] transition ease-out duration-200 p-1">
                      <Link to="/user">
                      <button className="px-4 py-2 flex items-center justify-center gap-2" >
                        <LocalShippingOutlinedIcon /> Quản lý đơn hàng
                      </button>
                      </Link>
                    </li>
                    <li className="hover:text-[#00B7C0] transition ease-out duration-200 p-1">
                      <button className="px-4 py-2 flex items-center justify-center gap-2">
                        <AssignmentIndOutlinedIcon /> Quản lý tài khoản
                      </button>
                    </li>
                    {userRole === "Admin" && (
                      <li className="hover:text-[#00B7C0] transition ease-out duration-200 p-1">
                        <Link to="/admin">
                          <button className="px-4 py-2 flex items-center justify-center gap-2">
                            <ManageAccountsOutlinedIcon /> Admin
                          </button>
                        </Link>
                      </li>
                    )}
                    <hr className="mx-3 border-gray-500" />
                    <li className="hover:text-[#00B7C0] transition ease-out duration-200 p-1">
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 flex items-center justify-center gap-2"
                      >
                        <LogoutOutlinedIcon />
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <li className="hover:text-white transition ease-out duration-200">
                <Link to="/login">
                  <PersonIcon sx={{ fontSize: 25 }} />
                </Link>
              </li>
            )}

            <li className="hover:text-white transition ease-out duration-200">
              <a href="#">
                <FavoriteBorderIcon sx={{ fontSize: 25 }} />
              </a>
            </li>
            <li className="hover:text-white transition ease-out duration-200">
              <Link to="/cart">
                <ShoppingCartOutlinedIcon sx={{ fontSize: 25 }} />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {isSearchActive && (
        <div className="absolute right-0 z-10 transform -translate-x-1/2 top-[60px] flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Cập nhật state tìm kiếm
            onKeyDown={handleSearchSubmit} // Xử lý tìm kiếm khi nhấn Enter
            placeholder="Tìm kiếm..."
            className="border border-black-300 bg-white rounded-l-md py-2 px-4 h-10"
          />
          <button className="border border-black-300 bg-[#f3d143] text-white font-medium rounded-r-md px-4 h-10 flex items-center justify-center hover:bg-gray-200 transition">
            <SearchOutlinedIcon />
          </button>
        </div>
      )}
    </header>
  );
}
