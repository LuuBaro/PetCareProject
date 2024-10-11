package com.example.petcareproject.Repository;

import com.example.petcareproject.Model.StatusOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StatusOrderRepository extends JpaRepository<StatusOrder, Long> {
    // Bạn có thể thêm các phương thức tùy chỉnh nếu cần
}
