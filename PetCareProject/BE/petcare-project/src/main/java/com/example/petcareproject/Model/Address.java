package com.example.petcareproject.Model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long addressId;

    @Column(name = "district", columnDefinition = "NVARCHAR(255)")
    private String district;

    @Column(name = "province", columnDefinition = "NVARCHAR(255)")
    private String province;

    @Column(name = "street", columnDefinition = "NVARCHAR(255)")
    private String street;

    @Column(name = "ward", columnDefinition = "NVARCHAR(255)")
    private String ward;

    @Column(name = "fullAddress", columnDefinition = "NVARCHAR(255)")
    private String fullAddress;
    private Boolean isDefault = false;

    private void updateFullAddress() {
        this.fullAddress = String.format("%s, %s, %s, %s",
                this.street, this.ward, this.district, this.province);
    }

    public void setWard(String ward) {
        this.ward = ward;
        updateFullAddress();
    }

    public void setDistrict(String district) {
        this.district = district;
        updateFullAddress();
    }

    public void setProvince(String province) {
        this.province = province;
        updateFullAddress();
    }

    public void setStreet(String street) {
        this.street = street;
        updateFullAddress();
    }
    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

}
