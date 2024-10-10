package com.example.petcareproject.dto;

import lombok.Data;

@Data
public class OrderDetailDTO {
    private Long productDetailId; // ID của sản phẩm
    private int quantity; // Số lượng sản phẩm
    private double price; // Giá của sản phẩm
}
