package com.example.petcareproject.Services;

import com.example.petcareproject.Model.ProductDetail;
import com.example.petcareproject.Repository.ProductDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductDetailService {

    @Autowired
    private ProductDetailRepository productDetailRepository;

    // Create or Update a ProductDetail
    public ProductDetail saveOrUpdateProductDetail(ProductDetail productDetail) {
        return productDetailRepository.save(productDetail);
    }

    // Get all ProductDetails
    public List<ProductDetail> getAllProductDetails() {
        return productDetailRepository.findAll();
    }

    // Get a ProductDetail by ID
    public Optional<ProductDetail> getProductDetailById(Long id) {
        return productDetailRepository.findById(id);
    }

    // Delete a ProductDetail by ID
    public void deleteProductDetail(Long id) {
        productDetailRepository.deleteById(id);
    }


    public ProductDetail getProductDetailByProductId(Long productId) {
        return productDetailRepository.findByProductId(productId);
    }

    public void updateQuantity(Long productId, int newQuantity) {
        productDetailRepository.updateProductDetailQuantity(productId, newQuantity);
    }
}
