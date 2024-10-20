package com.example.petcareproject.Repository;

import com.example.petcareproject.Model.CartDetail;
import com.example.petcareproject.Model.ProductDetail;
import com.example.petcareproject.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartDetailRepository extends JpaRepository<CartDetail, Long> {
    CartDetail findByUserAndProductDetail(User user, ProductDetail productDetail);
    List<CartDetail> findByUser(User user);

}
