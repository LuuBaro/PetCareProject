package com.example.petcareproject.Repository;

import com.example.petcareproject.Model.Order;
import com.example.petcareproject.Model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {

    List<OrderDetail> findByOrder_OrderId(Long orderId); // Thay đổi dòng này
    // Lấy danh sách OrderDetail theo userId thông qua Order

    @Query("SELECT od FROM OrderDetail od WHERE od.order.user.userId = :userId")
    List<OrderDetail> findByOrderUserId(@Param("userId") Long userId);

    // Tìm tất cả các chi tiết đơn hàng theo đơn hàng
    List<OrderDetail> findByOrder(Order order);


}
