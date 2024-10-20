package com.example.petcareproject.Controller;


import com.example.petcareproject.Model.ProductCategogy;
import com.example.petcareproject.Repository.ProductCategoriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/product-categories")
@CrossOrigin(origins = "http://localhost:5173") // Ensure the correct frontend URL
public class ProductCategoriesController {

    @Autowired
    private ProductCategoriesRepository productCategoriesRepository;

    // Get all product categories
    @GetMapping
    public List<ProductCategogy> getAllProductCategories() {
        return productCategoriesRepository.findAll();
    }

    // Get a single product category by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductCategogy> getProductCategoryById(@PathVariable Long id) {
        Optional<ProductCategogy> productCategory = productCategoriesRepository.findById(id);
        return productCategory.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create a new product category
    @PostMapping
    public ResponseEntity<ProductCategogy> createProductCategory(@RequestBody ProductCategogy productCategory) {
        ProductCategogy savedProductCategory = productCategoriesRepository.save(productCategory);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProductCategory);
    }

    // Update an existing product category
    @PutMapping("/{id}")
    public ResponseEntity<ProductCategogy> updateProductCategory(@PathVariable Long id,
                                                                   @RequestBody ProductCategogy productCategory) {
        if (!productCategoriesRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productCategory.setProductCategogyId(id); // Ensure the product has the correct ID
        ProductCategogy updatedProductCategory = productCategoriesRepository.save(productCategory);
        return ResponseEntity.ok(updatedProductCategory);
    }

    // Delete a product category
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductCategory(@PathVariable Long id) {
        if (!productCategoriesRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productCategoriesRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
