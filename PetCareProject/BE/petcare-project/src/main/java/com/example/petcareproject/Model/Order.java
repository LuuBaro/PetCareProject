package com.example.petcareproject.Model;

import ch.qos.logback.core.status.Status;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;
    private Date orderDate;
    private String paymentMethod;
    private String paymentStatus;
    private String shippingAddress;
    private double shippingCost;
    private double totalAmount;
    private Boolean type;
    private int pointEarned;
    private int pointUsed;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "statusId")
    private StatusOrder statusOrder;

    @ManyToOne
    @JoinColumn(name = "voucherId")
    private Voucher voucher;

    @ManyToOne
    @JoinColumn(name = "addressId")
    private Address address;

    @ManyToOne
    @JoinColumn(name = "pointId")
    private Point point;
}
