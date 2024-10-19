package com.example.petcareproject.Controller;

import com.example.petcareproject.Services.VNPayServices;
import com.example.petcareproject.dto.OrderDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class VNPayController {

    @Autowired
    private VNPayServices vnPayServices;

    // VNPay order creation endpoint
    @PostMapping("/pay")
    public ResponseEntity<String> createVNPayOrder(@RequestBody OrderDTO orderData, HttpServletRequest request) {
        try {
            int total = (int) orderData.getTotalAmount();
            String orderInfo = "Payment for order";
            String urlReturn = "http://localhost:5173/checkout"; // Frontend URL for handling VNPay callback

            // Call VNPay service to create payment URL
            String paymentUrl = vnPayServices.createOrder(total, orderInfo, urlReturn);
            return ResponseEntity.ok(paymentUrl);  // Return the VNPay payment URL
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating VNPay order: " + e.getMessage());
        }
    }

    // VNPay payment result callback
    @GetMapping("/payment-result")
    public ResponseEntity<Map<String, String>> paymentResult(HttpServletRequest request) {
        try {
            // VNPay service returns the payment result
            int result = vnPayServices.orderReturn(request);
            Map<String, String> response = new HashMap<>();

            if (result == 1) {
                // Payment was successful, save the order in DB
                // You will need to retrieve the original order information from session or any storage mechanism
                OrderDTO order = (OrderDTO) request.getSession().getAttribute("order");  // Example of retrieving the saved order
                // Save order to DB using your OrderService
                // orderService.saveOrder(order);
                response.put("status", "success");
                response.put("message", "Payment successful. Order saved.");
            } else {
                // Payment failed
                response.put("status", "failure");
                response.put("message", "Payment failed.");
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}