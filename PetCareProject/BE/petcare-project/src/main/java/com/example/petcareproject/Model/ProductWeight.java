package com.example.petcareproject.Model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "product_weights")
public class ProductWeight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productWeightId;
    private String weightValue;
    private Boolean status;

    @ManyToOne
    @JoinColumn(name = "productDetailId")
    private ProductDetail productDetail;
}
