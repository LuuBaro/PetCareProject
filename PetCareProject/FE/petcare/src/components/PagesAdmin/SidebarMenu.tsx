import React from "react";
import { Link } from "react-router-dom";

const SidebarMenu = () => {
    return (
        <>
            <div className="p-6 text-3xl font-bold text-white bg-indigo-600">
                Petcare
            </div>
            <nav className="bg-gray-900 text-gray-200 h-full">
                <ul>
                    <li className="p-4 flex items-center hover:bg-indigo-600 hover:text-white cursor-pointer transition-colors duration-300">
                        <Link to="/">
                           
                            Dashboard
                        </Link>
                    </li>
                    <li className="p-4 flex items-center hover:bg-indigo-600 hover:text-white cursor-pointer transition-colors duration-300">
                        <Link to="/user">
                            
                            Quản lý users
                        </Link>
                    </li>
                    <li className="p-4 flex items-center hover:bg-indigo-600 hover:text-white cursor-pointer transition-colors duration-300">
                        <Link to="/roles">
                            
                            Quản lý Role
                        </Link>
                    </li>
                    <li className="p-4 flex items-center hover:bg-indigo-600 hover:text-white cursor-pointer transition-colors duration-300">
                        <Link to="/products">
                           
                            Quản lý sản phẩm
                        </Link>
                    </li>
                    <li className="p-4 flex items-center hover:bg-indigo-600 hover:text-white cursor-pointer transition-colors duration-300">
                        <Link to="/product-details">
                           
                            Quản lý CTSP
                        </Link>
                    </li>
                    <li className="p-4 flex items-center hover:bg-indigo-600 hover:text-white cursor-pointer transition-colors duration-300">
                        <Link to="/brands">
                          
                            Quản lý Brand
                        </Link>
                    </li>
                    <li className="p-4 flex items-center hover:bg-indigo-600 hover:text-white cursor-pointer transition-colors duration-300">
                        <Link to="/product-color">
                           
                            Quản lý color
                        </Link>
                    </li>
                    <li className="p-4 flex items-center hover:bg-indigo-600 hover:text-white cursor-pointer transition-colors duration-300">
                        <Link to="/product-image">
                           
                            Quản lý img
                        </Link>
                    </li>
                    <li className="p-4 flex items-center hover:bg-indigo-600 hover:text-white cursor-pointer transition-colors duration-300">
                        <Link to="/product-size">
                           
                            Quản lý sizes
                        </Link>
                    </li>
                    <li className="p-4 flex items-center hover:bg-indigo-600 hover:text-white cursor-pointer transition-colors duration-300">
                        <Link to="/product-weights">
                           Quản lý weights
                            
                        </Link>
                    </li>
                    {/* <li className="p-4 flex items-center hover:bg-indigo-600 hover:text-white cursor-pointer transition-colors duration-300">
                        <Link to="/products/list">
                          
                            Sản phẩm
                        </Link>
                    </li> */}
                    <li className="p-4 flex items-center hover:bg-indigo-600 hover:text-white cursor-pointer transition-colors duration-300">
                        <Link to="/product-categories">
                            
                            Quản lý loại SP
                        </Link>
                    </li>

                    <li className="p-4 flex items-center hover:bg-indigo-600 hover:text-white cursor-pointer transition-colors duration-300">
                        <Link to="/product-inventory">
                            
                            Quản lý đơn hàng
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default SidebarMenu;
