package com.sareeshop.main.ServiceImpl;


import com.sareeshop.main.Entities.*;
import com.sareeshop.main.Repositories.*;
import com.sareeshop.main.Services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.ArrayList;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private SareeRepository sareeRepository;
    
    @Autowired
    private InstallmentPaymentRepository installmentPaymentRepository;
    
    @Override
    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        try {
            List<Order> orders = orderRepository.findAll();
            System.out.println("📊 Total orders found: " + orders.size());
            return orders;
        } catch (Exception e) {
            System.err.println("❌ Error fetching orders: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }
    
    @Override
    public Order createOrder(Order order) {
        // Set default values
        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDateTime.now());
        }
        if (order.getStatus() == null) {
            order.setStatus(OrderStatus.PENDING);
        }
        
        // Calculate pending amount
        if (order.getTotalAmount() != null && order.getPaidAmount() != null) {
            order.setPendingAmount(order.getTotalAmount().subtract(order.getPaidAmount()));
        }
        
        return orderRepository.save(order);
    }
    
    @Override
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        return orderRepository.findById(orderId)
            .map(order -> {
                order.setStatus(status);
                return orderRepository.save(order);
            })
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
    }
    
    @Override
    @Transactional
    public void deleteOrder(Long id) {
        System.out.println("🗑️ Deleting order with ID: " + id);
        
        // Get the order first to update related data
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            
            // Update customer's outstanding balance if this was an installment order
            if (order.getPendingAmount().compareTo(BigDecimal.ZERO) > 0) {
                Customer customer = order.getCustomer();
                customer.setTotalOutstanding(
                    customer.getTotalOutstanding().subtract(order.getPendingAmount())
                );
                customerRepository.save(customer);
            }
            
            // Restore saree stock quantities
            for (OrderItem item : order.getOrderItems()) {
                if (item.getSaree() != null) {
                    Saree saree = item.getSaree();
                    saree.setStockQuantity(saree.getStockQuantity() + item.getQuantity());
                    sareeRepository.save(saree);
                }
            }
        }
        
        // Delete the order (this will cascade delete order items and installment payments)
        orderRepository.deleteById(id);
        System.out.println("✅ Order deleted successfully: " + id);
    }

    
    @Override
    @Transactional(readOnly = true)
    public List<Order> getOrdersByCustomerId(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Order> getPendingInstallmentOrders() {
        // Fixed: Using database-compatible method with proper enum handling
        return orderRepository.findByPaymentTypeAndPendingAmountGreaterThan(
            PaymentType.INSTALLMENT, 
            BigDecimal.ZERO
        );
    }

    

    
    @Override
    public Order recordInstallmentPayment(Long orderId, BigDecimal paymentAmount, String paymentMethod) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Create installment payment record
        InstallmentPayment payment = new InstallmentPayment(order, paymentAmount, paymentMethod);
        installmentPaymentRepository.save(payment);
        
        // Update order amounts
        order.setPaidAmount(order.getPaidAmount().add(paymentAmount));
        order.setPendingAmount(order.getTotalAmount().subtract(order.getPaidAmount()));
        
        // Update order status if fully paid
        if (order.getPendingAmount().compareTo(BigDecimal.ZERO) <= 0) {
            order.setStatus(OrderStatus.DELIVERED);  // Or COMPLETED
        }
        
        // Update customer's total outstanding
        Customer customer = order.getCustomer();
        customer.setTotalOutstanding(customer.getTotalOutstanding().subtract(paymentAmount));
        customer.setLastPaymentDate(LocalDate.now());
        customerRepository.save(customer);
        
        return orderRepository.save(order);
    }
    
    @Override
    @Transactional(readOnly = true)
    public BigDecimal getTotalOutstandingAmount() {
        // Fixed: Using the same database-compatible method
        return orderRepository.findByPaymentTypeAndPendingAmountGreaterThan(
                PaymentType.INSTALLMENT, 
                BigDecimal.ZERO)
            .stream()
            .map(Order::getPendingAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    @Override
    public Order createFullPaymentOrder(Long customerId, List<Long> sareeIds, List<Integer> quantities) {
        // Implementation for creating full payment order
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        Order order = new Order();
        order.setCustomer(customer);
        order.setPaymentType(PaymentType.FULL_PAYMENT);
        order.setStatus(OrderStatus.CONFIRMED);
        
        // Calculate total and create order items
        BigDecimal totalAmount = calculateOrderTotal(sareeIds, quantities, order);
        order.setTotalAmount(totalAmount);
        order.setPaidAmount(totalAmount);
        order.setPendingAmount(BigDecimal.ZERO);
        
        return orderRepository.save(order);
    }
    
    @Override
    public Order createInstallmentOrder(Long customerId, List<Long> sareeIds, List<Integer> quantities, BigDecimal advancePayment) {
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        Order order = new Order();
        order.setCustomer(customer);
        order.setPaymentType(PaymentType.INSTALLMENT);
        order.setStatus(OrderStatus.CONFIRMED);
        order.setPaidAmount(advancePayment);
        
        // Calculate total and create order items
        BigDecimal totalAmount = calculateOrderTotal(sareeIds, quantities, order);
        order.setTotalAmount(totalAmount);
        order.setPendingAmount(totalAmount.subtract(advancePayment));
        
        // Update customer's total outstanding
        customer.setTotalOutstanding(customer.getTotalOutstanding().add(order.getPendingAmount()));
        customerRepository.save(customer);
        
        // Record the advance payment
        InstallmentPayment advanceRecord = new InstallmentPayment(order, advancePayment, "ADVANCE");
        order = orderRepository.save(order);
        advanceRecord.setOrder(order);
        installmentPaymentRepository.save(advanceRecord);
        
        return order;
    }
    
    private BigDecimal calculateOrderTotal(List<Long> sareeIds, List<Integer> quantities, Order order) {
        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();
        
        for (int i = 0; i < sareeIds.size(); i++) {
            Saree saree = sareeRepository.findById(sareeIds.get(i))
                .orElseThrow(() -> new RuntimeException("Saree not found"));
            
            Integer quantity = quantities.get(i);
            BigDecimal itemTotal = saree.getSellingPrice().multiply(BigDecimal.valueOf(quantity));
            total = total.add(itemTotal);
            
            // Create order item
            OrderItem orderItem = new OrderItem(order, saree, quantity, saree.getSellingPrice());
            orderItems.add(orderItem);
            
            // Reduce saree stock
            saree.setStockQuantity(saree.getStockQuantity() - quantity);
            sareeRepository.save(saree);
        }
        
        order.setOrderItems(orderItems);
        return total;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Order> getTodaysOrders() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);
        return orderRepository.findByOrderDateBetween(startOfDay, endOfDay);
    }
    
    
    @Override
    @Transactional
    public Order updateOrderFields(Long id, Map<String, Object> updates) {
        return orderRepository.findById(id)
            .map(existingOrder -> {
                // Update status if provided
                if (updates.containsKey("status")) {
                    String statusStr = (String) updates.get("status");
                    try {
                        OrderStatus status = OrderStatus.valueOf(statusStr.toUpperCase());
                        existingOrder.setStatus(status);
                    } catch (IllegalArgumentException e) {
                        throw new RuntimeException("Invalid status: " + statusStr);
                    }
                }
                
                // Update shipping address if provided
                if (updates.containsKey("shippingAddress")) {
                    existingOrder.setShippingAddress((String) updates.get("shippingAddress"));
                }
                
                // Update notes if provided
                if (updates.containsKey("notes")) {
                    existingOrder.setNotes((String) updates.get("notes"));
                }
                
                return orderRepository.save(existingOrder);
            })
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

}
