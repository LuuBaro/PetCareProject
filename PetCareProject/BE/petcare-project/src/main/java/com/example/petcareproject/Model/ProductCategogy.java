package com.example.petcareproject.Model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "product_catagogies")
public class ProductCategogy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productCategogyId;

    @Column(name = "categogyName", columnDefinition = "NVARCHAR(255)")
    private String categogyName;
}
