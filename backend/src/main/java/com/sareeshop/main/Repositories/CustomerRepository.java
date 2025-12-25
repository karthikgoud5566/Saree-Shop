package com.sareeshop.main.Repositories;

import com.sareeshop.main.Entities.Customer;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    Optional<Customer> findByPhoneNumber(String phoneNumber);
    Optional<Customer> findByEmail(String email);
    List<Customer> findByNameContainingIgnoreCase(String name);
    
    // For installment tracking - CORRECTED METHODS
    List<Customer> findByTotalOutstandingGreaterThan(BigDecimal amount);
    
    // Use @Query annotation for complex sorting
    @Query("SELECT c FROM Customer c ORDER BY c.totalOutstanding DESC")
    List<Customer> findAllOrderByTotalOutstandingDesc();
    
    // Or use the correct Spring Data JPA method name
    List<Customer> findAllByOrderByTotalOutstandingDesc();
}
