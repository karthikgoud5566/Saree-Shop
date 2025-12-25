package com.sareeshop.main.Entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "customers")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "targetClass"})
public class Customer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String phoneNumber;
    
    @Column(unique = true)
    private String email;
    
    private String address;
    private LocalDate dateOfBirth;
    
    // For installment tracking
    @Column(precision = 10, scale = 2)
    private BigDecimal totalOutstanding = BigDecimal.ZERO;
    
    private LocalDate lastPaymentDate;
    private String preferences; // Favorite colors, fabrics, etc.
    
    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore 
    private User user;
   
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("customer-orders") // ✅ FIXED - Customer manages orders
    private List<Order> orders = new ArrayList<>(); // ✅ Initialize to prevent null issues
    
    // Constructors
    public Customer() {
        this.totalOutstanding = BigDecimal.ZERO;
        this.orders = new ArrayList<>(); // ✅ Initialize in default constructor
    }
    
    public Customer(String name, String phoneNumber, String email, String address) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.address = address;
        this.totalOutstanding = BigDecimal.ZERO;
        this.orders = new ArrayList<>(); // ✅ Initialize here too
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    
    public BigDecimal getTotalOutstanding() { 
        return totalOutstanding != null ? totalOutstanding : BigDecimal.ZERO; 
    }
    public void setTotalOutstanding(BigDecimal totalOutstanding) { 
        this.totalOutstanding = totalOutstanding != null ? totalOutstanding : BigDecimal.ZERO; 
    }
    
    public LocalDate getLastPaymentDate() { return lastPaymentDate; }
    public void setLastPaymentDate(LocalDate lastPaymentDate) { this.lastPaymentDate = lastPaymentDate; }
    
    public String getPreferences() { return preferences; }
    public void setPreferences(String preferences) { this.preferences = preferences; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public List<Order> getOrders() { 
        return orders != null ? orders : new ArrayList<>(); 
    }
    public void setOrders(List<Order> orders) { 
        this.orders = orders != null ? orders : new ArrayList<>(); 
    }
    
    // ✅ Helper method to add orders safely
    public void addOrder(Order order) {
        if (this.orders == null) {
            this.orders = new ArrayList<>();
        }
        this.orders.add(order);
        if (order.getCustomer() != this) {
            order.setCustomer(this);
        }
    }
}
