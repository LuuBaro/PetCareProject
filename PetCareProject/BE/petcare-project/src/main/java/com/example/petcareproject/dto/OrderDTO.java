package com.example.petcareproject.dto;


import lombok.Data;

import java.util.List;

@Data
public class OrderDTO {
    private Long orderId;
    private String orderDate;
    private double totalAmount;
    private Long statusOrderId; // Thêm trường này
    private String status; // Trạng thái đơn hàng
    private String paymentMethod;
    private String shippingAddress;
    private List<OrderDetailDTO> orderDetails; // Không cần OrderDTO.OrderDetailDTO

    // Thêm các trường mới
    private Long userId; // Thêm trường này
    private String fullName;
    private String phoneNumber;
    private String email;
}

