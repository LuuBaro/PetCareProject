package com.example.petcareproject.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDetailRequestDTO {
    private Long productDetailId;
    private int quantityItem;
    private Long userId;
}
