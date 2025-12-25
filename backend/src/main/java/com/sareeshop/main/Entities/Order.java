package com.sareeshop.main.Entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "orders")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "targetClass"})
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER) 
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonIgnoreProperties({
        "orders",          
        "user",             
        "hibernateLazyInitializer", 
        "handler"
    }) 
    private Customer customer;
    
    @Column(nullable = false)
    private LocalDateTime orderDate;
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount;
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal paidAmount = BigDecimal.ZERO;
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal pendingAmount;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    
    @Enumerated(EnumType.STRING)
    private PaymentType paymentType;
    
    private String shippingAddress;
    private String notes;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("order-orderitems") // ✅ KEEP THIS - Order manages OrderItems
    private List<OrderItem> orderItems = new ArrayList<>(); // ✅ Initialize to prevent null
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("order-installments") // ✅ ADD THIS - Order manages installments
    private List<InstallmentPayment> installmentPayments = new ArrayList<>(); // ✅ Initialize
    
    // Constructors
    public Order() {
        this.orderDate = LocalDateTime.now();
        this.paidAmount = BigDecimal.ZERO;
        this.orderItems = new ArrayList<>(); // ✅ Initialize collections
        this.installmentPayments = new ArrayList<>();
    }
    
    public Order(Customer customer, BigDecimal totalAmount) {
        this();
        this.customer = customer;
        this.totalAmount = totalAmount;
        updatePendingAmount();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }
    
    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
    
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { 
        this.totalAmount = totalAmount;
        updatePendingAmount();
    }
    
    public BigDecimal getPaidAmount() { 
        return paidAmount != null ? paidAmount : BigDecimal.ZERO; 
    }
    public void setPaidAmount(BigDecimal paidAmount) { 
        this.paidAmount = paidAmount != null ? paidAmount : BigDecimal.ZERO;
        updatePendingAmount();
    }
    
    public BigDecimal getPendingAmount() { return pendingAmount; }
    public void setPendingAmount(BigDecimal pendingAmount) { this.pendingAmount = pendingAmount; }
    
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    
    public PaymentType getPaymentType() { return paymentType; }
    public void setPaymentType(PaymentType paymentType) { this.paymentType = paymentType; }
    
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public List<OrderItem> getOrderItems() { 
        return orderItems != null ? orderItems : new ArrayList<>(); 
    }
    public void setOrderItems(List<OrderItem> orderItems) { 
        this.orderItems = orderItems != null ? orderItems : new ArrayList<>(); 
    }
    
    public List<InstallmentPayment> getInstallmentPayments() { 
        return installmentPayments != null ? installmentPayments : new ArrayList<>(); 
    }
    public void setInstallmentPayments(List<InstallmentPayment> installmentPayments) { 
        this.installmentPayments = installmentPayments != null ? installmentPayments : new ArrayList<>(); 
    }
    
    // ✅ Helper methods for safer operations
    public void addOrderItem(OrderItem orderItem) {
        if (this.orderItems == null) {
            this.orderItems = new ArrayList<>();
        }
        this.orderItems.add(orderItem);
        if (orderItem.getOrder() != this) {
            orderItem.setOrder(this);
        }
    }
    
    public void addInstallmentPayment(InstallmentPayment payment) {
        if (this.installmentPayments == null) {
            this.installmentPayments = new ArrayList<>();
        }
        this.installmentPayments.add(payment);
        if (payment.getOrder() != this) {
            payment.setOrder(this);
        }
    }
    
    // Helper method
    private void updatePendingAmount() {
        if (totalAmount != null && paidAmount != null) {
            this.pendingAmount = totalAmount.subtract(paidAmount);
        }
    }
    
    // ✅ Calculate total from order items
    public void calculateTotalFromItems() {
        if (orderItems != null && !orderItems.isEmpty()) {
            BigDecimal total = orderItems.stream()
                .map(item -> item.getTotalPrice() != null ? item.getTotalPrice() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            setTotalAmount(total);
        }
    }
}
