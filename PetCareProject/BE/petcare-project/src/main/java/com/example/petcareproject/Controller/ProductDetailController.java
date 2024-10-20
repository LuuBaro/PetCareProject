package com.example.petcareproject.Controller;

import com.example.petcareproject.Model.ProductDetail;
import com.example.petcareproject.Services.ProductDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/product-details")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductDetailController {

    @Autowired
    private ProductDetailService productDetailService;

    // Create or Update a ProductDetail
    @PostMapping
    public ResponseEntity<ProductDetail> createOrUpdateProductDetail(@RequestBody ProductDetail productDetail) {
        ProductDetail savedProductDetail = productDetailService.saveOrUpdateProductDetail(productDetail);
        return new ResponseEntity<>(savedProductDetail, HttpStatus.CREATED);
    }

    // Get all ProductDetails
    @GetMapping
    public ResponseEntity<List<ProductDetail>> getAllProductDetails() {
        List<ProductDetail> productDetails = productDetailService.getAllProductDetails();
        return new ResponseEntity<>(productDetails, HttpStatus.OK);
    }

    // Get a ProductDetail by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductDetail> getProductDetailById(@PathVariable Long id) {
        Optional<ProductDetail> productDetail = productDetailService.getProductDetailById(id);
        if (productDetail.isPresent()) {
            return new ResponseEntity<>(productDetail.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Delete a ProductDetail by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductDetail(@PathVariable Long id) {
        Optional<ProductDetail> productDetail = productDetailService.getProductDetailById(id);
        if (productDetail.isPresent()) {
            productDetailService.deleteProductDetail(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/by-product/{productId}")
    public ResponseEntity<ProductDetail> getProductDetailByProductId(@PathVariable Long productId) {
        ProductDetail productDetail = productDetailService.getProductDetailByProductId(productId);
        if (productDetail != null) {
            return new ResponseEntity<>(productDetail, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


}
