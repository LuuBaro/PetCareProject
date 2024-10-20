package com.example.petcareproject.Controller;

import com.example.petcareproject.Config.VNPayConfig;
import com.example.petcareproject.Services.VNPayServices;
import com.example.petcareproject.dto.OrderDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class VNPayController {

    @Autowired
    private VNPayServices vnPayServices; // Kiểm tra chắc chắn rằng VNPayServices đã được định nghĩa và đã có @Service

    // API để tạo đơn hàng và điều hướng đến VNPay
    @GetMapping("/create-payment")
    public String createPayment(
            @RequestParam("amount") int amount,
            @RequestParam("orderInfo") String orderInfo,
            HttpServletRequest request
    ) throws UnsupportedEncodingException {
        // URL trở về sau khi thanh toán thành công
        String urlReturn = VNPayConfig.vnp_Returnurl;

        // Gọi dịch vụ VNPayServices để tạo đơn hàng
        String paymentUrl = vnPayServices.createOrder(amount, orderInfo, urlReturn); // Sử dụng phương thức createOrder đã định nghĩa trong VNPayServices
        return paymentUrl; // Trả về URL thanh toán
    }

    @PostMapping("/pay")
    public ResponseEntity<Map<String, String>> pay(@RequestBody Map<String, Object> paymentRequest, HttpServletRequest request) {
        try {
            // Extract data from the request
            int amount = (int) paymentRequest.get("amount");
            String returnUrl = (String) paymentRequest.get("returnUrl");

            // Get the base URL
            String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();

            // Call VNPayServices to create an order and get the payment URL
            String vnpayUrl = vnPayServices.createOrder(amount, "Thanh toán " + new Date(), baseUrl);

            // Return the payment URL as a JSON response
            Map<String, String> response = new HashMap<>();
            response.put("paymentUrl", vnpayUrl);
            response.put("returnUrl", returnUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Handle any errors
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Payment creation failed");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/payment-result")
    public ResponseEntity<String> paymentResult(HttpServletRequest request) {
        int result = vnPayServices.orderReturn(request);
        if (result == 1) {
            // Redirect to the success URL
            return ResponseEntity.status(HttpStatus.FOUND).header("Location", "http://localhost:5173/user").build();
        } else {
            // Redirect to the checkout page on failure
            return ResponseEntity.status(HttpStatus.FOUND).header("Location", "http://localhost:5173/checkout").build();
        }
    }

}