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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

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


    public void updateOrderStatus(Long orderId, Long statusOrderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        StatusOrder status = new StatusOrder();
        status.setStatusOrderId(statusOrderId); // Thiết lập trạng thái mới
        order.setStatusOrder(status);

        orderRepository.save(order); // Lưu lại thay đổi
    }


}