package com.example.petcareproject.Model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "product_sizes")
public class ProductSize {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productSizeId;
    private String productSize;
    private Boolean status;

    @ManyToOne
    @JoinColumn(name = "productDetailId")
    private ProductDetail productDetail;
}
