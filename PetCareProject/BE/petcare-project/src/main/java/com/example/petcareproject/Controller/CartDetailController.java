package com.example.petcareproject.Controller;

import com.example.petcareproject.Model.CartDetail;
import com.example.petcareproject.Services.CartDetailService;
import com.example.petcareproject.dto.CartDetailRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartDetailController {

    @Autowired
    private CartDetailService cartDetailService;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody CartDetailRequestDTO cartDetailDTO) {
        Long productDetailId = cartDetailDTO.getProductDetailId();
        int quantityItem = cartDetailDTO.getQuantityItem();
        Long userId = cartDetailDTO.getUserId();

        try {
            CartDetail cartDetail = cartDetailService.addToCart(productDetailId, quantityItem, userId);
            return ResponseEntity.ok(cartDetail);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getCartItems(@PathVariable Long userId) {
        try {
            List<CartDetail> cartItems = cartDetailService.getCartItemsByUserId(userId);
            return ResponseEntity.ok(cartItems);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateCartItem(@RequestBody CartDetailRequestDTO cartDetailDTO) {
        try {
            if (cartDetailDTO.getProductDetailId() == null || cartDetailDTO.getUserId() == null) {
                return ResponseEntity.status(400).body("Thiếu thông tin cần thiết.");
            }

            CartDetail updatedCartDetail = cartDetailService.updateCartItem(
                    cartDetailDTO.getProductDetailId(),
                    cartDetailDTO.getQuantityItem(),
                    cartDetailDTO.getUserId()
            );
            return ResponseEntity.ok(updatedCartDetail);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }


    @DeleteMapping("/remove/{cartDetailId}")
    public ResponseEntity<?> removeCartItem(@PathVariable Long cartDetailId, @RequestBody Map<String, Long> requestBody) {
        Long userId = requestBody.get("userId");
        try {
            cartDetailService.removeCartItem(cartDetailId, userId); // Sử dụng cartDetailId để xóa sản phẩm trong giỏ hàng
            return ResponseEntity.ok("Sản phẩm đã được xóa khỏi giỏ hàng.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }


}
