package com.example.petcareproject.dto;


import lombok.Data;

import java.util.List;

@Data
public class OrderDTO {
    private Long orderId;
    private String orderDate;
    private double totalAmount;
    private String status; // Trạng thái đơn hàng
    private List<OrderDetailDTO> orderDetails; // Chi tiết đơn hàng

    // Inner DTO for OrderDetail
    @Data
    public static class OrderDetailDTO {
        private Long productDetailId; // ID của sản phẩm
        private int quantity; // Số lượng sản phẩm
        private double price; // Giá của sản phẩm
    }
}
