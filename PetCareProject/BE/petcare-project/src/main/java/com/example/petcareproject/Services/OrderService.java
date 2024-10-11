package com.example.petcareproject.Services;

import com.example.petcareproject.Controller.OrderController;
import com.example.petcareproject.Model.*;
import com.example.petcareproject.Repository.OrderDetailRepository;
import com.example.petcareproject.Repository.OrderRepository;
import com.example.petcareproject.Repository.ProductDetailRepository;
import com.example.petcareproject.Repository.UserRepository;
import com.example.petcareproject.dto.OrderDTO;
import com.example.petcareproject.dto.OrderDetailDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private UserRepository userRepository;

    // Xử lý quá trình đặt hàng
    public void processOrder(OrderController.CheckoutRequest request) {
        // Tìm người dùng theo userId
        User user = userRepository.findById(request.userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        // Tạo đối tượng Order
        Order order = new Order();
        order.setOrderDate(new java.util.Date());
        order.setPaymentMethod("Thanh toán khi nhận hàng");
        order.setPaymentStatus("Chưa thanh toán");
        order.setShippingAddress(request.address);
        order.setShippingCost(15000);
        order.setTotalAmount(request.total + 15000);
        order.setType(true);
        order.setPointEarned(0);
        order.setPointUsed(0);
        order.setUser(user);

        // Thiết lập trạng thái mặc định là "Chờ xác nhận"
        StatusOrder defaultStatus = new StatusOrder();
        defaultStatus.setStatusOrderId(1L); // ID cho "Chờ xác nhận"
        order.setStatusOrder(defaultStatus);

        // Lưu Order vào DB
        Order savedOrder = orderRepository.save(order);

        // Lưu các OrderDetail
        for (OrderDetailDTO productDTO : request.products) {
            // Tìm sản phẩm theo productDetailId
            ProductDetail productDetail = productDetailRepository.findById(productDTO.getProductDetailId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setQuantity(productDTO.getQuantity());
            orderDetail.setPrice(productDTO.getPrice());
            orderDetail.setOrder(savedOrder);
            orderDetail.setProductDetail(productDetail); // Gán ProductDetail tìm được
            orderDetailRepository.save(orderDetail);
        }
    }

    // Cập nhật trạng thái đơn hàng
    public void updateOrderStatus(Long orderId, Long statusOrderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        StatusOrder status = new StatusOrder();
        status.setStatusOrderId(statusOrderId); // Thiết lập trạng thái mới
        order.setStatusOrder(status);

        orderRepository.save(order);
    }

    // Lấy danh sách đơn hàng theo userId
//    public List<OrderDTO> getUserOrders(Long userId) {
//        List<Order> orders = orderRepository.findByUser_UserId(userId);
//
//        return orders.stream()
//                .map(this::convertToOrderDTO)
//                .collect(Collectors.toList());
//    }

    // Chuyển đổi OrderDetail thành OrderDetailDTO
    private OrderDetailDTO convertToOrderDetailDTO(OrderDetail orderDetail) {
        OrderDetailDTO orderDetailDTO = new OrderDetailDTO();
        orderDetailDTO.setProductDetailId(orderDetail.getProductDetail().getProductDetailId());
        orderDetailDTO.setQuantity(orderDetail.getQuantity());
        orderDetailDTO.setPrice(orderDetail.getPrice());
        orderDetailDTO.setOrderId(orderDetail.getOrder().getOrderId());

        ProductDetail productDetail = orderDetail.getProductDetail();
        Product product = productDetail.getProduct();

        orderDetailDTO.setProductId(product.getProductId());
        orderDetailDTO.setProductName(product.getProductName());
        orderDetailDTO.setProductImage(product.getImageUrl());
        orderDetailDTO.setProductPrice(productDetail.getPrice());
        orderDetailDTO.setProductCategory(product.getCategory().getCategogyName());
        orderDetailDTO.setProductBrand(product.getBrand().getBrandName());

        return orderDetailDTO;
    }


    // Chuyển đổi Order thành OrderDTO
    public OrderDTO convertToOrderDTO(Order order) {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setOrderId(order.getOrderId());
        orderDTO.setOrderDate(order.getOrderDate().toString());
        orderDTO.setTotalAmount(order.getTotalAmount());
        orderDTO.setStatus(order.getStatusOrder().getStatusName());
        orderDTO.setPaymentMethod(order.getPaymentMethod());
        orderDTO.setShippingAddress(order.getShippingAddress());

        // Truy vấn danh sách OrderDetail dựa trên orderId
        List<OrderDetail> orderDetails = orderDetailRepository.findByOrder_OrderId(order.getOrderId());

        List<OrderDetailDTO> orderDetailDTOs = orderDetails.stream()
                .map(this::convertToOrderDetailDTO)
                .collect(Collectors.toList());

        orderDTO.setOrderDetails(orderDetailDTOs);
        return orderDTO;
    }
    public OrderDTO getOrderDetails(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        // Chuyển đổi Order thành OrderDTO, bao gồm cả địa chỉ
        OrderDTO orderDTO = convertToOrderDTO(order);
        orderDTO.setShippingAddress(order.getShippingAddress()); // Thêm thông tin địa chỉ
        return orderDTO;
    }

    public List<OrderDTO> getUserOrders(Long userId) {
        List<Order> orders = orderRepository.findByUser_UserId(userId);

        return orders.stream()
                .map(order -> {
                    OrderDTO orderDTO = convertToOrderDTO(order);

                    // Lấy thông tin người dùng
                    User user = order.getUser();

                    // Ẩn số điện thoại và email
                    String maskedPhone = maskPhoneNumber(user.getPhone());
                    String maskedEmail = maskEmail(user.getEmail());

                    orderDTO.setFullName(user.getFullName());
                    orderDTO.setPhoneNumber(maskedPhone);
                    orderDTO.setEmail(maskedEmail);

                    return orderDTO;
                })
                .collect(Collectors.toList());
    }

    // Hàm che số điện thoại
    private String maskPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.length() < 10) {
            return phoneNumber;
        }
        return phoneNumber.substring(0, 3) + "****" + phoneNumber.substring(7);
    }

    // Hàm che email
    private String maskEmail(String email) {
        int atIndex = email.indexOf("@");
        if (atIndex <= 1) {
            return email;
        }
        return email.substring(0, 1) + "****" + email.substring(atIndex);
    }


}
