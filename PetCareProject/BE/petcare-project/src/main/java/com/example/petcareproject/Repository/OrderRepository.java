package com.example.petcareproject.Repository;


import com.example.petcareproject.Model.Order;
import com.example.petcareproject.Model.OrderDetail;
import com.example.petcareproject.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Bạn có thể thêm các phương thức tùy chỉnh nếu cần
    List<Order> findByUser_UserId(Long userId);

    @Query("SELECT od FROM OrderDetail od WHERE od.order.user.userId = :userId")
    List<OrderDetail> findByOrderUserId(@Param("userId") Long userId);

    List<Order> findAll();

}
