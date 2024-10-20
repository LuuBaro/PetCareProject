package com.example.petcareproject.Repository;


import com.example.petcareproject.Model.ProductCategogy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductCategoriesRepository extends JpaRepository<ProductCategogy, Long> {
}
