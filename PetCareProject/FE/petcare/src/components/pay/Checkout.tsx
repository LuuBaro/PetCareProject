import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import Header from "../header/Header";
import Modal from "react-modal";
import Swal from "sweetalert2";
import AddressModal from "./AddressModal";
import {calculateShippingFee} from "../../service/AddressService";

interface Product {
    productId: number;
    image: string;
    productName: string;
    price: number;
    quantity: number;
}

Modal.setAppElement('#root');
const Checkout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const products: Product[] = location.state?.products || [];
    const total: number = location.state?.total || 0;
    const [refreshCheckout, setRefreshCheckout] = useState(0);
    // const [shippingFee, setShippingFee] = useState<number>(0);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId) {
        throw new Error("User ID is missing from local storage");
    }

    const [address, setAddress] = useState<any | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
    const [vnpResponseCode, setVnpResponseCode] = useState<string | null>(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const responseCode = queryParams.get("vnp_ResponseCode");

        // if (responseCode) {
        //     handleVNPayResponse(responseCode);
        // }
        fetchFirstAddress();
        // fetchShippingFee();
    }, [userId, location.search, refreshCheckout, address]);

    // const fetchShippingFee = async () => {
    //     if (address) {
    //         const fee = await calculateShippingFee(address); // Assuming address has the required data for calculation
    //         setShippingFee(fee);
    //     }
    // };

    const fetchFirstAddress = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/addresses/first?userId=${userId}`);
            if (!response.ok) throw new Error(`Error fetching address: ${response.statusText}`);

            const data = await response.json();
            setAddress(data.fullAddress);
        } catch (error) {
            console.error("Error fetching address:", error);
            alert("Could not fetch address.");
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const clearCartAfterCheckout = () => {
        localStorage.removeItem("cartItems");
        console.log("Giỏ hàng đã được xóa sau khi thanh toán thành công.");
    };

    // const handleVNPayResponse = async (responseCode: string) => {
    //     if (responseCode === "00") {  // Payment was successful
    //         try {
    //             const queryParams = new URLSearchParams(location.search);
    //             const response = await fetch(`http://localhost:8080/api/payment-result?${queryParams.toString()}`, {
    //                 method: "GET",
    //                 headers: {
    //                     "Authorization": `Bearer ${token}`,
    //                 },
    //             });

    //             if (response.redirected) {
    //                 window.location.href = response.url;
    //                 return;
    //             }

    //             if (response.ok) {
    //                 Swal.fire({
    //                     title: "Thanh toán thành công!",
    //                     text: "Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn sẽ được xử lý ngay.",
    //                     icon: "success",
    //                     confirmButtonText: "OK",
    //                 }).then(() => {
    //                     clearCartAfterCheckout();
    //                     navigate("/user");
    //                 });
    //             }
    //         } catch (error) {
    //             console.error("Error fetching VNPay return result:", error);
    //             Swal.fire({
    //                 title: "Thanh toán thất bại!",
    //                 text: "Vui lòng thử lại.",
    //                 icon: "error",
    //                 confirmButtonText: "OK",
    //             }).then(() => {
    //                 navigate("/checkout");
    //             });
    //         }
    //     } else {
    //         Swal.fire({
    //             title: "Thanh toán thất bại!",
    //             text: "Vui lòng thử lại.",
    //             icon: "error",
    //             confirmButtonText: "OK",
    //         }).then(() => {
    //             navigate("/checkout");
    //         });
    //     }
    // };

    const handlePayment = async () => {
        if (!selectedPaymentMethod) {
            Swal.fire({
                icon: "warning",
                title: "Thiếu phương thức thanh toán",
                text: "Vui lòng chọn phương thức thanh toán.",
            });
            return;
        }
    
    if (!address) {
            Swal.fire({
                icon: "warning",
                title: "Thiếu địa chỉ",
                text: "Vui lòng cung cấp địa chỉ giao hàng.",
            });
            return;
        }
    
        if (products.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Giỏ hàng trống",
                text: "Giỏ hàng trống, không thể thanh toán.",
            });
            return;
        }
        console.log("Thông tin sản phẩm:", products);
        console.log("Tổng tiền:", total);
        console.log("Địa chỉ giao hàng:", address);
        console.log("User ID:", userId);
    
        if (selectedPaymentMethod === "cod") {
            try {
                console.log("Đang tiến hành thanh toán COD...");
    
                const response = await fetch("http://localhost:8080/api/checkout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        products: products.map((productDetail) => ({
                            productDetailId: productDetail.productId,
                            quantity: productDetail.quantity,
                            price: productDetail.price,
                            productName: productDetail.productName,
                        })),
                        total: total,
                        address: address,
                        userId: userId,
                        paymentMethod: "COD",
                    }),
                });
    
                if (!response.ok) {
                    const errorText = await response.text();
                    console.log("Lỗi khi thanh toán COD:", errorText); // Log lỗi nếu thanh toán thất bại
                    throw new Error(`Thanh toán thất bại: ${errorText}`);
                }
    
                console.log("Thanh toán COD thành công!"); // Log khi thanh toán thành công
    
                Swal.fire({
                    title: "Thanh toán thành công!",
                    text: "Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn sẽ được xử lý ngay.",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(() => {
                    clearCartAfterCheckout();
                    navigate("/user");
                });
            } catch (error) {
                console.error("Lỗi khi thanh toán COD:", error);
                alert(`Thanh toán thất bại: ${error.message}`);
            }
        } else if (selectedPaymentMethod === "vnpay") {
            try {
                console.log("Đang tiến hành thanh toán VNPay...");
    
                // VNPay
                const response1 = await fetch("http://localhost:8080/api/pay", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        amount: total + 15000,
                        returnUrl: "http://localhost:5173/user",
                    }),
                });
    
                if (!response1.ok) {
                    const errorText = await response1.text();
                    console.log("Lỗi khi gửi yêu cầu thanh toán VNPay:", errorText); // Log lỗi nếu yêu cầu thất bại
                    throw new Error(`VNPay Payment failed: ${errorText}`);
                }
    
                const response2 = await fetch("http://localhost:8080/api/checkout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        products: products.map((productDetail) => ({
                            productDetailId: productDetail.productId,
                            quantity: productDetail.quantity,
                            price: productDetail.price,
                            productName: productDetail.productName,
                        })),
                        total: total,
                        address: address,
                        userId: userId,
                        paymentMethod: "VNPAY",
                    }),
                });
    
                const data = await response1.json();
                console.log("VNPay Payment URL:", data.paymentUrl); // Log URL của VNPay
                const paymentUrl = data.paymentUrl;
                window.location.href = paymentUrl; // Chuyển hướng tới trang thanh toán VNPay
            } catch (error) {
                console.error("Lỗi khi thanh toán VNPay:", error);
                alert(`Thanh toán VNPay thất bại: ${error.message}`);
            }
        }
    };
    

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const saveAddress = async (newAddress: any) => {
        const formattedFullAddress = `${newAddress.street}, ${newAddress.ward}, ${newAddress.district}, ${newAddress.province}`;

        try {
            const response = await fetch("http://localhost:8080/api/addresses", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    userId,
                    fullAddress: formattedFullAddress,
                    ...newAddress,
                }),
            });

            if (!response.ok) throw new Error("Failed to save address.");

            setAddress(formattedFullAddress);
            closeModal();
        } catch (error) {
            console.error("Error saving address:", error);
            alert("Could not save address.");
        }
    };

    return (
        <div>
            <Header/>
            <div className="bg-gray-100 min-h-screen p-4">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <h1 className="text-2xl font-bold text-[#00b7c0]">Thanh Toán</h1>
                    </div>

                    {/* Địa chỉ giao hàng */}
                    <div className="border-t border-b py-4 mb-4">
                        <div className="flex items-center mb-2">
                            <i className="fas fa-map-marker-alt text-red-500 mr-2"></i>
                            <span className="font-bold">Địa Chỉ Nhận Hàng</span>
                        </div>
                        <div className="ml-6">
                            {/*<p className="font-bold mb-2"></p>*/}
                            <p className="font-bold mb-2">
                                {loading ? "Loading..." : address || "Chưa có địa chỉ nào."}
                            </p>
                            <button onClick={openModal} className="text-blue-500">
                                Thay Đổi
                            </button>
                        </div>
                    </div>

                    {/* Danh sách sản phẩm */}
                    <div>
                        <table className="w-full table-auto mb-4">
                            <thead>
                            <tr className="border-b-2 border-[#F2BC27] font-bold text-xl">
                                <th className="p-2 text-left">Sản phẩm</th>
                                <th className="p-2 text-left">Đơn giá</th>
                                <th className="p-2 text-left">Số lượng</th>
                                <th className="p-2 text-right">Thành tiền</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.map((product) => (
                                <tr key={product.productId} className="border-t">
                                    <td className="p-2 flex items-center">
                                        <img
                                            src={product.image}
                                            alt={product.productName}
                                            className="w-16 h-16 object-cover rounded-lg mr-4"
                                        />
                                        <span>{product.productName}</span>
                                    </td>
                                    <td className="p-2">{formatPrice(product.price)}</td>
                                    <td className="p-8 text-left">{product.quantity}</td>
                                    <td className="p-2 text-right font-bold">
                                        {formatPrice(product.price * product.quantity)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Voucher */}
                    <div className="border-b pb-4 mb-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                                <i className="fas fa-ticket-alt text-red-500 mr-2"></i>
                                <span className="text-lg">PetCare Voucher</span>
                            </div>
                            <a href="#" className="text-blue-500">
                                Chọn Voucher
                            </a>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <i className="fas fa-coins text-yellow-500 mr-2"></i>
                                <span className="text-lg">PetCare Xu</span>
                            </div>
                            <span className="text-gray-500">Không thể sử dụng Xu</span>
                        </div>
                    </div>

                    {/* Phương thức thanh toán */}
                    <div className="border-b pb-4 mb-4">
                        <div className="text-lg font-semibold mb-2">Phương thức thanh toán</div>
                        <div className="flex justify-between items-center">
                            <span>
                                {selectedPaymentMethod === "cod"
                                    ? "Thanh toán khi nhận hàng"
                                    : selectedPaymentMethod === "vnpay"
                                        ? "Thanh toán bằng VNPay"
                                        : "Chưa chọn phương thức thanh toán"}
                            </span>
                            <button onClick={() => setPaymentModalOpen(true)} className="text-blue-500">
                                THAY ĐỔI
                            </button>
                        </div>
                    </div>

                    {/* Modal to select payment method */}
                    <Modal
                        isOpen={paymentModalOpen}
                        onRequestClose={() => setPaymentModalOpen(false)}
                        contentLabel="Payment Modal"
                        ariaHideApp={false}
                        style={{
                            content: {
                                width: "50%",
                                maxWidth: "600px",
                                height: "250px", // Adjust height based on content
                                margin: "auto",
                                borderRadius: "10px",
                                padding: "30px",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
                                display: "flex", // Align modal content vertically
                                flexDirection: "column",
                                justifyContent: "center",
                            },
                        }}
                    >
                        <div className="modal-content">
                            {/* Modal Header */}
                            <div className="modal-header">
                                <h2 className="text-xl font-bold text-center">Chọn phương thức thanh toán</h2>
                                {/*<button className="modal-close" onClick={() => setPaymentModalOpen(false)}>*/}
                                {/*    &times;*/}
                                {/*</button>*/}
                            </div>

                            {/* Payment Options */}
                            <div className="payment-options mt-4">
                                {/* Cash on Delivery (COD) */}
                                <div className="payment-option">
                                    <label>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            checked={selectedPaymentMethod === "cod"}
                                            onChange={() => setSelectedPaymentMethod("cod")}
                                            className="mr-2"
                                        />
                                        Thanh toán khi nhận hàng
                                    </label>
                                </div>

                                {/* VNPay Payment */}
                                <div className="payment-option mt-2">
                                    <label>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            checked={selectedPaymentMethod === "vnpay"}
                                            onChange={() => setSelectedPaymentMethod("vnpay")}
                                            className="mr-2"
                                        />
                                        Thanh toán bằng VNPay
                                    </label>
                                </div>
                            </div>

                            {/* Confirm and Close Modal */}
                            <div className="modal-footer flex justify-end mt-6">
                                {/* Cancel Button */}
                                <button
                                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition mr-4" // Added margin right for spacing
                                    onClick={() => setPaymentModalOpen(false)}
                                >
                                    Hủy
                                </button>

                                {/* Confirm Button */}
                                <button
                                    onClick={() => setPaymentModalOpen(false)} // Close the modal after selecting
                                    className="bg-[#00b7c0] text-white px-6 py-2 rounded-lg hover:bg-[#41797c] transition"
                                >
                                    Xác nhận
                                </button>
                            </div>

                        </div>
                    </Modal>


                    {/* Tổng số tiền */}
                    <div className="bg-gray-50 p-4 mb-4">
                        <div className="flex justify-between items-center mb-4">
                            <span>Tổng tiền hàng</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span>Phí vận chuyển</span>
                            <span>15.000 ₫</span> {/* Static for now */}
                            {/*<span>{formatPrice(shippingFee)}</span>*/}
                        </div>
                    </div>
                    {/* Tổng cộng */}
                    <div className="mt-6 text-right">
                        <h2 className="text-xl font-bold text-red-500">
                            Tổng cộng: {formatPrice(total + 15000)}
                            {/*Tổng cộng: {formatPrice(total + shippingFee)}*/}
                        </h2>
                        <button
                            onClick={handlePayment}
                            className="bg-[#00b7c0] text-white px-6 py-2 rounded-lg hover:bg-[#41797c] transition duration-300 mt-4"
                        >
                            Đặt hàng
                        </button>
                    </div>
                    <div className="text-center text-gray-500 text-sm mt-4">
                        Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo{" "}
                        <a href="#" className="text-blue-500">
                            Điều khoản PetCare
                        </a>
                    </div>
                </div>
            </div>

            {/* Modal để chọn địa chỉ */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Chọn Địa Chỉ"
                ariaHideApp={false}
                style={{
                    content: {
                        width: "60%", // Tăng kích thước modal
                        maxWidth: "700px", // Đảm bảo modal không quá lớn
                        height: "80%", // Tăng chiều cao của modal
                        margin: "auto", // Canh giữa modal
                        borderRadius: "10px", // Bo góc nhẹ
                        padding: "20px", // Thêm khoảng cách bên trong modal
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Thêm shadow để modal nổi bật hơn
                    },
                }}
            >
                <div className="modal-header">
                    <h2 className="text-xl font-bold text-center">
                        Chọn Địa Chỉ Giao Hàng
                    </h2>
                </div>
                <div className="modal-body">
                    <AddressModal
                        isOpen={modalIsOpen}
                        onClose={closeModal}
                        userId={userId}
                        onAddressSelected={(addressId) => {
                            // Fetch the full address from the API based on the addressId
                            fetch(`http://localhost:8080/api/addresses/${addressId}`, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            })
                                .then((res) => {
                                    if (!res.ok) {
                                        throw new Error("Network response was not ok");
                                    }
                                    return res.json();
                                })
                                .then((data) => setAddress(data)) // Store the whole address object
                                .catch((error) =>
                                    console.error("Error fetching address:", error)
                                );
                            setRefreshCheckout((prev) => prev + 1);
                        }}
                        currentCheckoutAddressId={address?.addressId ?? null}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default Checkout;