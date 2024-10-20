package com.example.petcareproject.Services;

import com.example.petcareproject.Model.StatusOrder;
import com.example.petcareproject.Repository.StatusOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Service
public class StatusOrderService {

    @Autowired
    private StatusOrderRepository statusOrderRepository;

    public List<StatusOrder> getAllStatusOrders() {
        return statusOrderRepository.findAll();
    }

    @GetMapping
    public List<StatusOrder> getStatusOrders() {
        return statusOrderRepository.findAll();
    }
}

