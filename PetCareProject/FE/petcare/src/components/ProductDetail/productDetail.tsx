import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDetailService from "../../service/ProductDetailService";
import CartService from "../../service/CartDetailService"; // Import CartService
import Header from "../header/Header";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

toastr.options.timeOut = 2000;

const ProductDetail = () => {
  const { id: productId } = useParams();
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [stockAvailable, setStockAvailable] = useState(0);

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      try {
        const response = await ProductDetailService.getProductDetailsByProductId(productId);
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

  const { product, price } = productDetail;

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value));

    // Kiểm tra số lượng và hiển thị thông báo nếu vượt quá số lượng có sẵn
    if (value > stockAvailable) {
        toastr.error(`Bạn chỉ có thể thêm tối đa ${stockAvailable} sản phẩm.`);
    }

    // Cập nhật số lượng, đảm bảo không vượt quá số hàng có sẵn
    setQuantity(Math.min(value, stockAvailable)); 
};


  const handleAddToCart = async (productDetailId) => {
    const isAuthenticated = !!localStorage.getItem("isAuthenticated");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    console.log("ProductDetail ID:", productDetailId);
    console.log("Quantity:", quantity);
    console.log("User ID:", userId);

    if (!token) {
      toastr.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }

    try {
      await CartService.addToCart(
        productDetailId,
        quantity,
        userId,
        token,
        product.productName,
        stockAvailable
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckout = () => {
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
          <div className="flex justify-center items-center">
            <img
              src={product?.imageUrl || "default_image_url.jpg"}
              alt={product?.productName || "Sản phẩm"}
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
                className="mt-2 block w-24 border border-gray-300 rounded-md p-2 text-center"
                min="1"
                max={stockAvailable}
              />
              {quantity > stockAvailable && (
                <p className="text-red-500 mt-2">
                  Bạn chỉ có thể thêm tối đa {stockAvailable} sản phẩm.
                </p>
              )}
            </div>

            <p className="mt-8 text-lg text-gray-700 font-semibold">
              Mô tả sản phẩm:
            </p>
            <p className="text-gray-600 mt-2">
              {product?.description || "Không có mô tả"}
            </p>

            <div className="mt-10 flex space-x-4">
              <button
                onClick={() => handleAddToCart(productDetail.productDetailId)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out"
              >
                Thêm vào giỏ
              </button>

              <button
                onClick={handleCheckout}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out"
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
