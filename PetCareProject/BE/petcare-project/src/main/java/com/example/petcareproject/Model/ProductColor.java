package com.example.petcareproject.Model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "product_colors")
public class ProductColor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productColorId;

    @Column(name = "color", columnDefinition = "NVARCHAR(255)")
    private String color;
    private Boolean status;

    @ManyToOne
    @JoinColumn(name = "productDetailId")
    private ProductDetail productDetail;

}
