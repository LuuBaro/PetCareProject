import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

const HeaderProduct = () => {
  const [cart, setCart] = useState(() => {
    // Lấy giỏ hàng từ session storage hoặc thiết lập rỗng nếu không có
    const savedCart = sessionStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const addToCart = (product) => {
    const newCart = [...cart, product];
    setCart(newCart);
    // Lưu vào session storage
    sessionStorage.setItem("cart", JSON.stringify(newCart));
  };

  return (
    <div className="flex justify-between items-center mb-5 bg-gray-200 p-4 rounded-lg shadow-md text-black">
      <div className="text-xl font-bold">Shop Cún Mèo</div>
      <div className="flex space-x-6">
        <Link to="/" className="text-lg font-semibold hover:text-[#00B7C0]">
          Trang Chủ
        </Link>
        <Link to="/products" className="text-lg font-semibold hover:text-[#00B7C0]">
          Sản Phẩm
        </Link>
        <Link to="/contact" className="text-lg font-semibold hover:text-[#00B7C0]">
          Liên Hệ
        </Link>
      </div>
      <div className="relative">
        <Link to="/cart" onClick={addToCart}>
          <button className="text-lg font-semibold bg-[#ffffff] p-2 rounded-lg">
            <i className="fas fa-shopping-cart"></i> {/* Cart icon */}
          </button>
          <span className="absolute top-0 right-0 bg-[#00B7C0] text-white text-sm w-5 h-5 flex items-center justify-center rounded-full">
            {cart.length} {/* Cart item count */}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default HeaderProduct;
