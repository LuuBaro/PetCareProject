package com.example.petcareproject.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "product_vouchers")
public class ProductVoucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productVoucherId;
    private double discountAmount;
    private Date startDate;
    private Date endDate;

    @ManyToOne
    @JoinColumn(name = "productDetailId")
    private ProductDetail productDetail;
}
