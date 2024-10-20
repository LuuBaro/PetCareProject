package com.example.petcareproject.Controller;

import com.example.petcareproject.Model.StatusOrder;
import com.example.petcareproject.Services.StatusOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/status-orders")
public class StatusOrderController {

    @Autowired
    private StatusOrderService statusOrderService;

    @GetMapping
    public ResponseEntity<List<StatusOrder>> getAllStatusOrders() {
        List<StatusOrder> statusOrders = statusOrderService.getAllStatusOrders();
        return ResponseEntity.ok(statusOrders);
    }
}

