import React, { useState, useEffect, useRef } from "react";
import ProductItem from "../product/ProductItem";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "../header/Header";
import ProductService from "../../service/ProductService";
import { Link } from "react-router-dom"; // Import Link
import ProductDetail from "../productdetail/ProductDetail";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState(12); // State to manage visible products
    const sliderRef = useRef(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await ProductService.getAllProducts();
                console.log(response.data); // Kiểm tra cấu trúc phản hồi API
                const formattedProducts = response.data.map((product) => ({
                    id: product.productId,
                    name: product.productName,
                    quantity: product.productQuantity,
                    image: product.imageUrl || 'default_image_url.jpg', // Hình ảnh mặc định
                    rating: product.rating || 0,
                    price: product.productDetail ? product.productDetail.price : 200000 // Lấy giá từ productDetail
                }));
                
                
                // Đảo ngược danh sách sản phẩm để sản phẩm mới nhất được hiển thị ở đầu
                setProducts(formattedProducts.reverse());
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm:", error);
            }
        };

        fetchProducts();
    }, []);

    // Sidebar states and handlers
    const [showDogShop, setShowDogShop] = useState(false);
    const [showCatShop, setShowCatShop] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleDogShopClick = () => {
        setShowDogShop((prev) => !prev);
        setSelectedCategory((prev) => (prev === "dog" ? null : "dog"));
    };

    const handleCatShopClick = () => {
        setShowCatShop((prev) => !prev);
        setSelectedCategory((prev) => (prev === "cat" ? null : "cat"));
    };

    const handleLoadMore = () => {
        setVisibleProducts((prev) => prev + 12);
    };

    const handleShowLess = () => {
        setVisibleProducts((prev) => Math.max(prev - 12, 12));
    };

    return (
        <>
            <Header />
            <div className="flex flex-wrap mx-32">
                {/* Sidebar */}
                <div className="w-full md:w-1/4 p-4">
                    {/* Categories */}
                    <div className="mb-8">
                        <div
                            className="bg-[#00b7c0] text-white ml-[3px] px-4 py-2 font-bold text-center w-[140px]"
                            style={{ transform: "skewX(-10deg)" }}
                        >
                            <span style={{ transform: "skewX(10deg)" }}>DANH MỤC</span>
                        </div>
                        <div className="flex-grow border-t border-[#00b7c0] mb-2 "></div>
                        <ul className="border-2 border-[#00b7c0] rounded-md p-4 space-y-2">
                            <li
                                className={`cursor-pointer hover:text-[#00b7c0] transition flex justify-between items-center ${selectedCategory === "dog" ? "text-[#00b7c0]" : ""
                                    }`}
                                onClick={handleDogShopClick}
                            >
                                SHOP CHO CÚN
                                <i className={`fa ${showDogShop ? "fa-angle-up" : "fa-angle-down"}`}></i>
                            </li>
                            {showDogShop && (
                                <ul className="pl-4 space-y-4">
                                    {[
                                        "Thức ăn & pate",
                                        "Bát ăn",
                                        "Vòng cổ dây dắt",
                                        "Thuốc và dinh dưỡng",
                                        "Sữa tắm & dụng cụ vệ sinh",
                                        "Chuồng, nệm và túi vận chuyển",
                                        "Đồ chơi thú cưng",
                                    ].map((item) => (
                                        <li key={item} className="cursor-pointer hover:text-[#00b7c0] transition">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <li
                                className={`cursor-pointer hover:text-[#00b7c0] transition flex justify-between items-center ${selectedCategory === "cat" ? "text-[#00b7c0]" : ""
                                    }`}
                                onClick={handleCatShopClick}
                            >
                                SHOP CHO MÈO
                                <i className={`fa ${showCatShop ? "fa-angle-up" : "fa-angle-down"}`}></i>
                            </li>
                            {showCatShop && (
                                <ul className="pl-4 space-y-4">
                                    {[
                                        "Thức ăn & pate",
                                        "Bát ăn",
                                        "Vòng cổ dây dắt",
                                        "Thuốc và dinh dưỡng",
                                        "Sữa tắm & dụng cụ vệ sinh",
                                        "Chuồng, nệm và túi vận chuyển",
                                        "Đồ chơi thú cưng",
                                    ].map((item) => (
                                        <li key={item} className="cursor-pointer hover:text-[#00b7c0] transition space-y-4">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <li className="cursor-pointer hover:text-[#00b7c0] transition">KHUYẾN MÃI</li>
                            <li className="cursor-pointer hover:text-[#00b7c0] transition">TIN TỨC</li>
                        </ul>
                    </div>
                    {/* Brand Filter */}
                    <div className="mb-8">
                        <div
                            className="bg-[#00b7c0] text-white ml-[3px] px-4 py-2 font-bold w-[140px] text-center"
                            style={{ transform: "skewX(-10deg)" }}
                        >
                            <span style={{ transform: "skewX(10deg)" }}>THƯƠNG HIỆU</span>
                        </div>
                        <div className="flex-grow border-t border-[#00b7c0]  mb-2 w-full"></div>
                        <ul className="border-2 border-[#00b7c0] rounded-md p-4 space-y-2">
                            {["Khác", "ROYAL CANIN"].map((brand) => (
                                <li key={brand} className="flex items-center custom-radio">
                                    <input type="radio" name="brand" className="mr-2" /> {brand}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Price Range Filter */}
                    <div className="mb-8">
                        <div
                            className="bg-[#00b7c0] text-white px-4 py-2 ml-[3px] font-bold w-[140px] text-center"
                            style={{ transform: "skewX(-10deg)" }}
                        >
                            <span style={{ transform: "skewX(10deg)" }}>KHOẢNG GIÁ</span>
                        </div>
                        <div className="flex-grow border-t border-[#00b7c0]  mb-2 w-full"></div>
                        <ul className="border-2 border-[#00b7c0] rounded-md p-4 space-y-2">
                            {[
                                "Giá dưới 100.000đ",
                                "100.000đ - 200.000đ",
                                "200.000đ - 300.000đ",
                                "300.000đ - 500.000đ",
                                "500.000đ - 1.000.000đ",
                            ].map((priceRange) => (
                                <li key={priceRange} className="flex items-center custom-radio">
                                    <input type="radio" name="price" className="mr-2" /> {priceRange}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Products Section */}
                <div className="w-full md:w-3/4 p-4">
                    {/* Sorting */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Thức ăn hạt & pate cho cún</h2>
                        <div>
                            <label>Sắp xếp theo: </label>
                            <select className="border rounded-md p-2">
                                <option>Mặc định</option>
                                <option>Giá tăng dần</option>
                                <option>Giá giảm dần</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-1 gap-y-5">
                        {products.slice(0, visibleProducts).map((product) => (
                            <Link to={`/product/${product.id}`} key={product.id}>
                                <ProductItem
                                    name={product.name}
                                    quantity={`Số lượng: ${product.quantity}`}
                                    image={product.image}
                                    rating={product.rating}
                                    price={product.price}
                                />
                            </Link>
                        ))}
                    </div>

                    {/* Load More and Show Less Buttons */}
                    <div className="flex justify-center mt-6 space-x-4">
                        {visibleProducts < products.length && (
                            <button
                                onClick={handleLoadMore}
                                className="bg-[#00b7c0] text-white px-4 py-2 rounded-md"
                            >
                                Hiện thêm sản phẩm
                            </button>
                        )}
                        {visibleProducts > 12 && (
                            <button
                                onClick={handleShowLess}
                                className="bg-[#00b7c0] text-white px-4 py-2 rounded-md"
                            >
                                Ẩn bớt sản phẩm
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}