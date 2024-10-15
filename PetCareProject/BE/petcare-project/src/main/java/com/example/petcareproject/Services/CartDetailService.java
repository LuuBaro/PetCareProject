package com.example.petcareproject.Services;

import com.example.petcareproject.Model.CartDetail;
import com.example.petcareproject.Model.ProductDetail;
import com.example.petcareproject.Model.User;
import com.example.petcareproject.Repository.CartDetailRepository;
import com.example.petcareproject.Repository.ProductDetailRepository;
import com.example.petcareproject.Repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartDetailService {

    @Autowired
    private CartDetailRepository cartDetailRepository;

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired
    private UserRepository userRepository;

    public CartDetail addToCart(Long productDetailId, int quantityItem, Long userId) {
        // Retrieve User by userId
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Retrieve ProductDetail by productDetailId
        ProductDetail productDetail = productDetailRepository.findById(productDetailId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if the product already exists in the user's cart
        CartDetail existingCartDetail = cartDetailRepository.findByUserAndProductDetail(user, productDetail);
        if (existingCartDetail != null) {
            // If the product exists, update the quantity
            int newQuantity = Math.min(existingCartDetail.getQuantityItem() + quantityItem, productDetail.getQuantity());
            existingCartDetail.setQuantityItem(newQuantity);
            return cartDetailRepository.save(existingCartDetail);
        }

        // If the product does not exist, create a new CartDetail
        CartDetail cartDetail = new CartDetail();
        cartDetail.setQuantityItem(Math.min(quantityItem, productDetail.getQuantity()));
        cartDetail.setProductDetail(productDetail);
        cartDetail.setUser(user);

        // Save to the database
        return cartDetailRepository.save(cartDetail);
    }

    public List<CartDetail> getCartItemsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return cartDetailRepository.findByUser(user);
    }

    public CartDetail updateCartItem(Long productDetailId, int quantityItem, Long userId) {
        // Tìm kiếm người dùng
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Tìm kiếm sản phẩm theo productDetailId
        ProductDetail productDetail = productDetailRepository.findById(productDetailId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Tìm CartDetail theo người dùng và sản phẩm
        CartDetail cartDetail = cartDetailRepository.findByUserAndProductDetail(user, productDetail);
        if (cartDetail != null) {
            // Cập nhật số lượng sản phẩm
            cartDetail.setQuantityItem(quantityItem);
            return cartDetailRepository.save(cartDetail);
        } else {
            throw new RuntimeException("Sản phẩm không tồn tại trong giỏ hàng.");
        }
    }

    public void removeCartItem(Long cartDetailId, Long userId) {
        // Logic để xóa sản phẩm khỏi giỏ hàng dựa trên cartDetailId
        CartDetail cartDetail = cartDetailRepository.findById(cartDetailId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong giỏ hàng."));

        if (!cartDetail.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền xóa sản phẩm này.");
        }

        cartDetailRepository.delete(cartDetail);
    }

    public void clearCartAfterCheckout(Long userId) {
        // Retrieve the user by userId
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find all cart items for the user
        List<CartDetail> cartItems = cartDetailRepository.findByUser(user);


        if (cartItems.isEmpty()) {
            throw new RuntimeException("No items in the cart to clear.");
        }

        // Delete all the cart items for this user
        cartDetailRepository.deleteAll(cartItems);
    }

    public void updateQuantityCheckout(Long userId) {
        // Retrieve the user by userId
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find all cart items for the user
        List<CartDetail> cartItems = cartDetailRepository.findByUser(user);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("No items in the cart to update.");
        }

        // Loop through each cart item and update the product quantity in ProductDetail
        for (CartDetail cartDetail : cartItems) {
            ProductDetail productDetail = cartDetail.getProductDetail();
            int newQuantity = productDetail.getQuantity() - cartDetail.getQuantityItem();

            // Check if there's enough stock
            if (newQuantity < 0) {
                throw new RuntimeException("Not enough stock for product: " + productDetail.getProduct().getProductName());
            }

            // Update the product quantity in ProductDetail
            productDetail.setQuantity(newQuantity);
            productDetailRepository.save(productDetail);
        }
    }



}
