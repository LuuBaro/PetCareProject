import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDetailService from "../../service/ProductDetailService";
import CartService from "../../service/CartDetailService"; // Import CartService
import Header from "../header/Header";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
<<<<<<< Updated upstream

=======
import $ from "jquery";
import Footer from "../footer/Footer";
import { useNavigate } from "react-router-dom";
>>>>>>> Stashed changes
toastr.options.timeOut = 2000;

const ProductDetail = () => {
  const { id: productId } = useParams();
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [stockAvailable, setStockAvailable] = useState(0);
<<<<<<< Updated upstream

=======
  const [cartItems, setCartItems] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
>>>>>>> Stashed changes
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
      } catch (error) {
        const errorMessage =
          error.message || "Lỗi khi lấy thông tin sản phẩm. Vui lòng thử lại sau.";
        setError(errorMessage);
        toastr.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

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

<<<<<<< Updated upstream
  const { product, price } = productDetail;

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value));

    // Kiểm tra số lượng và hiển thị thông báo nếu vượt quá số lượng có sẵn
    if (value > stockAvailable) {
        toastr.error(`Bạn chỉ có thể thêm tối đa ${stockAvailable} sản phẩm.`);
=======
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
>>>>>>> Stashed changes
    }

    // Cập nhật số lượng, đảm bảo không vượt quá số hàng có sẵn
    setQuantity(Math.min(value, stockAvailable)); 
};


  const handleAddToCart = async (productDetailId) => {
    const isAuthenticated = !!localStorage.getItem("isAuthenticated");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

<<<<<<< Updated upstream
    console.log("ProductDetail ID:", productDetailId);
    console.log("Quantity:", quantity);
    console.log("User ID:", userId);

=======
    // Nếu chưa đăng nhập, điều hướng tới trang đăng nhập
>>>>>>> Stashed changes
    if (!token) {
      toastr.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
      window.location.href = "/login"; // Điều hướng về trang đăng nhập
      return;
    }

<<<<<<< Updated upstream
=======
    const totalQuantityInCart = getProductQuantityInCart() + quantity;
    if (totalQuantityInCart > stockAvailable) {
      toastr.error(
        `Số lượng trong giỏ hàng đã vượt quá ${stockAvailable} sản phẩm.`
      );
      return;
    }

>>>>>>> Stashed changes
    try {
      // Lấy tên sản phẩm từ product.productName
      const productName = productDetail?.product?.productName;

      await CartService.addToCart(
        productDetailId,
        quantity,
<<<<<<< Updated upstream
        userId,
        token,
        product.productName,
        stockAvailable
      );
=======
        localStorage.getItem("userId"),
        token,
        productName, // Truyền tên sản phẩm đúng
        stockAvailable
      );

      // Hiện tại đang sử dụng thông báo bên lớp CartDetailService.js nên là thông báo này không cần thiết
      // toastr.success(`${productName} đã được thêm vào giỏ hàng.`);
>>>>>>> Stashed changes
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckout = () => {
<<<<<<< Updated upstream
    if (
      CartService.checkoutCart(quantity, stockAvailable, product.productName)
    ) {
      // Tiến hành thanh toán, nếu cần.
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto my-10 p-8 bg-white shadow-lg rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
=======
    const navigate = useNavigate(); // Khởi tạo useNavigate

    const checkoutData = {
      productDetailId: productDetail.productDetailId,
      quantity: quantity,
      productName: productDetail?.product?.productName,
      stockAvailable: stockAvailable,
    };

    // Chuyển đến trang thanh toán với thông tin sản phẩm
    navigate("/checkout", { state: checkoutData });
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
>>>>>>> Stashed changes
          <div className="flex justify-center items-center">
            <img
              src={product?.imageUrl || "default_image_url.jpg"}
              alt={product?.productName || "Sản phẩm"}
<<<<<<< Updated upstream
              className="rounded-lg w-full lg:w-3/4 h-auto object-cover shadow-lg"
            />
          </div>
          <div className="lg:pl-8">
            <h1 className="text-4xl font-semibold text-gray-900">
              {product?.productName || "Tên sản phẩm"}
            </h1>
            <p className="text-3xl text-red-600 mt-4">
              {price || "Giá sản phẩm"}₫
            </p>

=======
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

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                className="mt-2 block w-24 border border-gray-300 rounded-md p-2 text-center"
                min="1"
                max={stockAvailable}
              />
              {quantity > stockAvailable && (
                <p className="text-red-500 mt-2">
                  Bạn chỉ có thể thêm tối đa {stockAvailable} sản phẩm.
                </p>
              )}
=======
                className="mt-2 block w-24 border border-gray-300 rounded-md p-2 text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max={stockAvailable}
                disabled={stockAvailable === 0}
              />
>>>>>>> Stashed changes
            </div>

            <p className="mt-8 text-lg text-gray-700 font-semibold">
              Mô tả sản phẩm:
            </p>
<<<<<<< Updated upstream
            <p className="text-gray-600 mt-2">
=======
            <p className="text-gray-600 mt-2 leading-relaxed">
>>>>>>> Stashed changes
              {product?.description || "Không có mô tả"}
            </p>

            <div className="mt-10 flex space-x-4">
              <button
                onClick={() => handleAddToCart(productDetail.productDetailId)}
<<<<<<< Updated upstream
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out"
=======
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105"
                disabled={quantity > stockAvailable || stockAvailable === 0}
>>>>>>> Stashed changes
              >
                Thêm vào giỏ
              </button>

              <button
                onClick={handleCheckout}
<<<<<<< Updated upstream
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out"
=======
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105"
>>>>>>> Stashed changes
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
<<<<<<< Updated upstream
      </div>
=======

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
      <Footer></Footer>
>>>>>>> Stashed changes
    </>
  );
};

export default ProductDetail;
