package com.example.petcareproject.dto;

import lombok.Data;

import java.util.List;

@Data
public class CancellationRequest {
    private List<Long> orderIds;
    private String reason;
    private String email; // Địa chỉ email của khách hàng
}
