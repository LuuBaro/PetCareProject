package com.example.petcareproject.Controller;

import com.example.petcareproject.Model.Order;
import com.example.petcareproject.Model.OrderDetail;
import com.example.petcareproject.Services.OrderService;
import com.example.petcareproject.dto.OrderDTO;
import com.example.petcareproject.dto.OrderDetailDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api")
public class OrderController {


    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<String> checkout(@RequestBody CheckoutRequest request) {
        try {
            orderService.processOrder(request);
            return ResponseEntity.ok("Đặt hàng thành công");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Đã xảy ra lỗi khi đặt hàng: " + e.getMessage());
        }
    }

    public static class CheckoutRequest {
        public List<OrderDetailDTO> products;
        public double total;
        public String address;
        public Long userId; // Thêm userId
    }


//    @GetMapping("/user/{userId}")
//    public ResponseEntity<List<OrderDetail>> getOrdersByUserId(@PathVariable Long userId) {
//        List<OrderDetail> orderDetails = orderService.getOrdersByUserId(userId);
//        return ResponseEntity.ok(orderDetails);
//    }


}
