package com.example.petcareproject.Services;

import com.example.petcareproject.Model.Product;
import com.example.petcareproject.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Fetch all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Fetch product by id
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // Save a product
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // Delete a product by id
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }


    

}
