package com.example.petcareproject.Model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "status_orders")
public class StatusOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long statusOrderId;

    @Column(name = "statusName", columnDefinition = "NVARCHAR(255)")
    private String statusName;
}
