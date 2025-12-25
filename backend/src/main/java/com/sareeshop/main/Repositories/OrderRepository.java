package com.sareeshop.main.Repositories;

import com.sareeshop.main.Entities.Order;
import com.sareeshop.main.Entities.OrderStatus;
import com.sareeshop.main.Entities.PaymentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Find orders by customer
    List<Order> findByCustomerId(Long customerId);
    
    // Find orders by status
    List<Order> findByStatus(OrderStatus status);
    
    // Find orders by payment type
    List<Order> findByPaymentType(PaymentType paymentType);
    
    // Find orders with pending payments (installments)
    List<Order> findByPendingAmountGreaterThan(BigDecimal amount);
    
    // Find orders by date range
    List<Order> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Fixed query for installment orders (Method 1 - Parameterized)
    @Query("SELECT o FROM Order o WHERE o.paymentType = :paymentType AND o.pendingAmount > :amount")
    List<Order> findPendingInstallmentOrders(@Param("paymentType") PaymentType paymentType, 
                                           @Param("amount") BigDecimal amount);
    
    // Alternative Method 2 - Pure JPA (Recommended)
    List<Order> findByPaymentTypeAndPendingAmountGreaterThan(PaymentType paymentType, BigDecimal amount);
    
    // Additional useful queries for your saree shop
    List<Order> findByCustomerIdOrderByOrderDateDesc(Long customerId);
    List<Order> findByStatusAndOrderDateAfter(OrderStatus status, LocalDateTime date);
    
    // Count orders by status (useful for dashboard)
    long countByStatus(OrderStatus status);
}
