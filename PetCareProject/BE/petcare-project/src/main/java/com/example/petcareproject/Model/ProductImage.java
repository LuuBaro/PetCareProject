package com.example.petcareproject.Model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "product_images")
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productImageId;
    private String productImageUrl;
    private Boolean status;

    @ManyToOne
    @JoinColumn(name = "productDetailId")
    private ProductDetail productDetail;
}
