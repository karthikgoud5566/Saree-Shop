package com.sareeshop.main.Services;



import com.sareeshop.main.Entities.Order;
import com.sareeshop.main.Entities.OrderStatus;
import com.sareeshop.main.Entities.PaymentType;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface OrderService {
    
    // Basic CRUD operations
    List<Order> getAllOrders();
    Optional<Order> getOrderById(Long id);
    Order createOrder(Order order);
    Order updateOrderStatus(Long orderId, OrderStatus status);
    void deleteOrder(Long id);
    
    // Customer specific orders
    List<Order> getOrdersByCustomerId(Long customerId);
    
    // Payment related operations
    List<Order> getPendingInstallmentOrders();
    Order recordInstallmentPayment(Long orderId, BigDecimal paymentAmount, String paymentMethod);
    BigDecimal getTotalOutstandingAmount();
    
    // Business logic methods
    Order createFullPaymentOrder(Long customerId, List<Long> sareeIds, List<Integer> quantities);
    Order createInstallmentOrder(Long customerId, List<Long> sareeIds, List<Integer> quantities, BigDecimal advancePayment);
    
    // Reporting methods
    List<Order> getOrdersByStatus(OrderStatus status);
    List<Order> getTodaysOrders();
    
 // Add this method to handle Map-based updates
    Order updateOrderFields(Long id, Map<String, Object> updates);


}
