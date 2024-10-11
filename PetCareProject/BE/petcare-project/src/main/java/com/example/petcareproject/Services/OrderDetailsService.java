package com.example.petcareproject.Services;

import com.example.petcareproject.Model.OrderDetail;
import com.example.petcareproject.Repository.OrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderDetailsService {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    public List<OrderDetail> findOrdersByUserId(Long userId) {
        return orderDetailRepository.findByOrderUserId(userId);
    }
}
