package com.example.petcareproject.Model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @Column(name = "productName", columnDefinition = "NVARCHAR(255)")
    private String productName;
    private int productQuantity;

    @Column(name = "description", columnDefinition = "NVARCHAR(255)")
    private String description;
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "productCategogyId")
    private ProductCategogy category;

    @ManyToOne
    @JoinColumn(name = "brandId")
    private Brand brand;
}
