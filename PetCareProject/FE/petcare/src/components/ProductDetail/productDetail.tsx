import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDetailService from "../../service/ProductDetailService";
import ProductService from "../../service/ProductService";
import CartService from "../../service/CartDetailService";
import Header from "../header/Header";
import ProductItem from "../product/ProductItem"; // Import ProductItem
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import $ from "jquery";
import Footer from "../footer/Footer";
import { useNavigate } from "react-router-dom";
toastr.options.timeOut = 2000;

const ProductDetail = () => {
  const { id: productId } = useParams();
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [stockAvailable, setStockAvailable] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  // Khai báo useNavigate
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      try {
        const response =
          await ProductDetailService.getProductDetailsByProductId(productId);
        if (!response) {
          throw new Error("Không tìm thấy sản phẩm");
        }
        setProductDetail(response);
        setStockAvailable(response.quantity);
        setQuantity(1);
      } catch (error) {
        const errorMessage = error.message || "Lỗi khi lấy thông tin sản phẩm.";
        setError(errorMessage);
        toastr.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await CartService.getCartItems();
        setCartItems(response.data || []);
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await ProductService.getAllProducts();
        setAllProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchAllProducts();
  }, []);

  const getProductQuantityInCart = () => {
    const cartItem = cartItems.find(
      (item) => item.productDetailId === productDetail.productDetailId
    );
    return cartItem ? cartItem.quantity : 0;
  };

  const handleQuantityChange = (e) => {
    let value = parseInt(e.target.value);
    if (value < 0) {
      value = 0;
    }
    if (value > stockAvailable) {
      toastr.error(`Bạn chỉ có thể thêm tối đa ${stockAvailable} sản phẩm.`);
      $("body").append(
        `<div class="toast toast-error">Bạn chỉ có thể thêm tối đa ${stockAvailable} sản phẩm.</div>`
      );
      $(".toast")
        .fadeIn()
        .delay(3000)
        .fadeOut(function () {
          $(this).remove();
        });
    }
    setQuantity(Math.min(value, stockAvailable));

    if (value === 0) {
      toastr.error("Sản phẩm đã hết hàng.");
      $("body").append(
        `<div class="toast toast-error">Sản phẩm đã hết hàng.</div>`
      );
      $(".toast")
        .fadeIn()
        .delay(3000)
        .fadeOut(function () {
          $(this).remove();
        });
    }
  };

  const handleAddToCart = async (productDetailId) => {
    const token = localStorage.getItem("token");

    // Nếu chưa đăng nhập, điều hướng tới trang đăng nhập
    if (!token) {
      toastr.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
      window.location.href = "/login"; // Điều hướng về trang đăng nhập
      return;
    }

    const totalQuantityInCart = getProductQuantityInCart() + quantity;
    if (totalQuantityInCart > stockAvailable) {
      toastr.error(
        `Số lượng trong giỏ hàng đã vượt quá ${stockAvailable} sản phẩm.`
      );
      return;
    }

    try {
      // Lấy tên sản phẩm từ product.productName
      const productName = productDetail?.product?.productName;

      await CartService.addToCart(
        productDetailId,
        quantity,
        localStorage.getItem("userId"),
        token,
        productName, // Truyền tên sản phẩm đúng
        stockAvailable
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckout = () => {
    // Tạo đối tượng sản phẩm từ thông tin chi tiết hiện tại
    const productToCheckout = {
        productDetailId: productDetail.productDetailId, // Đảm bảo key là đúng
        productName: product?.productName, // Tên sản phẩm
        price: price, // Giá sản phẩm
        quantity: quantity, // Số lượng sản phẩm
        image: product?.imageUrl, // Thêm ảnh nếu có
    };

    // Log thông tin sản phẩm
    console.log("Thông tin sản phẩm đang được thêm vào giỏ hàng:", productToCheckout);

    // Chuyển hướng sang trang checkout cùng với dữ liệu sản phẩm
    navigate("/checkout", {
        state: {
            products: [productToCheckout], // Danh sách sản phẩm (dù chỉ có 1 sản phẩm)
            total: price * quantity, // Tổng tiền (giá * số lượng)
            address: "", // Địa chỉ giao hàng sẽ được cung cấp ở trang checkout
            userId: 0, // User ID sẽ được cập nhật sau khi người dùng đăng nhập
            paymentMethod: "COD", // Phương thức thanh toán, có thể thay đổi sau
        },
    });
};



  
  
  if (loading) {
    return <div className="text-center py-10 text-lg">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-lg text-red-600">{error}</div>
    );
  }

  if (!productDetail) {
    return (
      <div className="text-center py-10 text-lg text-red-600">
        Không tìm thấy sản phẩm.
      </div>
    );
  }

  const { product, price } = productDetail;

  return (
    <>
      <Header />
      <div className="container mx-32 w-auto my-10 p-8 bg-white shadow-lg rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image Section */}
          <div className="flex justify-center items-center">
            <img
              src={product?.imageUrl || "default_image_url.jpg"}
              alt={product?.productName || "Sản phẩm"}
              className="rounded-lg w-full lg:w-2/3 h-auto object-cover shadow-lg transition-transform duration-500 ease-in-out transform hover:scale-110"
            />
          </div>
          {/* Product Details Section */}
          <div className="lg:pl-8">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              {product?.productName || "Tên sản phẩm"}
            </h1>
            <p className="text-3xl text-red-600 mt-4 font-semibold">
              {price || "Giá sản phẩm"}₫
            </p>

            <p className="text-lg text-gray-700 mt-4">
              <strong>Tồn kho:</strong> {stockAvailable || 0} sản phẩm
            </p>

            {/* Show out-of-stock message if product is unavailable */}
            {stockAvailable === 0 && (
              <p className="text-lg text-red-600 mt-2">
                Sản phẩm này hiện đã hết hàng.
              </p>
            )}

            <div className="mt-6">
              <label
                htmlFor="quantity"
                className="block text-lg font-medium text-gray-700"
              >
                Số lượng:
              </label>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className="mt-2 block w-24 border border-gray-300 rounded-md p-2 text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max={stockAvailable}
                disabled={stockAvailable === 0}
              />
            </div>

            <p className="mt-8 text-lg text-gray-700 font-semibold">
              Mô tả sản phẩm:
            </p>
            <p className="text-gray-600 mt-2 leading-relaxed">
              {product?.description || "Không có mô tả"}
            </p>

            <div className="mt-10 flex space-x-4">
              <button
                onClick={() => handleAddToCart(productDetail.productDetailId)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105"
                disabled={quantity > stockAvailable || stockAvailable === 0}
              >
                Thêm vào giỏ
              </button>

              <button
                onClick={handleCheckout}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105"
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">
            Sản phẩm liên quan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-6">
            {allProducts.slice(0, 4).map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-transform duration-300 ease-in-out transform hover:scale-105"
              >
                <img
                  src={product.imageUrl || "default_image_url.jpg"}
                  alt={product.productName}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {product.productName}
                  </h3>
                  <p className="text-lg text-red-600 mt-2">{product.price}₫</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
