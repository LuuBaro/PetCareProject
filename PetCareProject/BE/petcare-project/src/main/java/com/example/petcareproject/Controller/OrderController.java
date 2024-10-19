package com.example.petcareproject.Controller;

import com.example.petcareproject.Model.Order;
import com.example.petcareproject.Model.OrderDetail;
import com.example.petcareproject.Model.StatusOrder;
import com.example.petcareproject.Repository.OrderRepository;
import com.example.petcareproject.Services.CartDetailService;
import com.example.petcareproject.Services.EmailService;
import com.example.petcareproject.Services.OrderDetailsService;
import com.example.petcareproject.Services.OrderService;
import com.example.petcareproject.dto.CancellationRequest;
import com.example.petcareproject.dto.OrderDTO;
import com.example.petcareproject.dto.OrderDetailDTO;
import jakarta.transaction.Transactional;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Data
    public static class CheckoutRequest {
        public List<OrderDetailDTO> products;
        public double total;
        public String address;
        public Long userId; // Thêm userId
        public String paymentMethod;
    }

    @Autowired
    private OrderDetailsService orderDetailsService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartDetailService cartDetailService;

    @PostMapping("/checkout")
    public ResponseEntity<String> checkout(@RequestBody CheckoutRequest request) {
        try {
            // Step 1: Process the order (create the order and order details)
            orderService.processOrder(request);

            // Step 2: Update product quantities based on the order details
            cartDetailService.updateQuantityCheckout(request.userId);

            // Step 3: Clear the cart after checkout
            cartDetailService.clearCartAfterCheckout(request.userId);

            return ResponseEntity.ok("Đặt hàng thành công");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Đã xảy ra lỗi khi đặt hàng: " + e.getMessage());
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderDetails(@PathVariable Long orderId) {
        OrderDTO orderDTO = orderService.getOrderDetails(orderId);
        return ResponseEntity.ok(orderDTO);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDTO>> getUserOrders(@PathVariable Long userId) {
        List<OrderDTO> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/user/{userId}/orders")
    public ResponseEntity<List<OrderDTO>> getOrdersByUserId(@PathVariable Long userId) {
        List<OrderDTO> orders = orderService.getOrdersByUserId(userId); // Lấy đơn hàng theo userId
        return ResponseEntity.ok(orders); // Trả về danh sách đơn hàng
    }

    // Lấy tất cả các đơn hàng
    @GetMapping("/all")
    public List<OrderDTO> getAllOrders() {
        return orderService.getAllOrders();
    }

    // Endpoint để cập nhật trạng thái đơn hàng
    @PutMapping("/{orderId}/status/{statusId}")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Long orderId, @PathVariable Long statusId) {
        try {
            orderService.updateOrderStatus(orderId, statusId);
            return ResponseEntity.ok("Order status updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/cancel/{orderId}")
    public ResponseEntity<String> cancelOrder(@PathVariable Long orderId, @RequestParam String reason) {
        // Gọi phương thức hủy đơn hàng và gửi email thông báo
        orderService.processOrderCancellation(orderId, reason); // Truyền lý do từ frontend
        return ResponseEntity.ok("Đơn hàng đã được hủy và email thông báo đã được gửi");
    }


}



