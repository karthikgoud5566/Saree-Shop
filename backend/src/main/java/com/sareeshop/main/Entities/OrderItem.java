package com.sareeshop.main.Entities;

import jakarta.persistence.*;
import java.math.BigDecimal;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "order_items")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "targetClass"})
public class OrderItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference("order-orderitems") // ✅ KEEP ONLY THIS - Remove @JsonIgnore
    private Order order;
    
    @ManyToOne(fetch = FetchType.EAGER) // ✅ Changed to EAGER for better saree data access
    @JoinColumn(name = "saree_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "targetClass", "orders"}) // ✅ Prevent circular reference
    @NotFound(action = NotFoundAction.IGNORE)
    private Saree saree;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal unitPrice;
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal totalPrice;
    
    // Constructors
    public OrderItem() {}
    
    public OrderItem(Order order, Saree saree, Integer quantity, BigDecimal unitPrice) {
        this.order = order;
        this.saree = saree;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = unitPrice.multiply(BigDecimal.valueOf(quantity));
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    
    public Saree getSaree() { return saree; }
    public void setSaree(Saree saree) { this.saree = saree; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { 
        this.quantity = quantity;
        updateTotalPrice();
    }
    
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { 
        this.unitPrice = unitPrice;
        updateTotalPrice();
    }
    
    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
    
    // ✅ Helper methods for handling deleted saree references
    @JsonIgnore
    public boolean isSareeDeleted() {
        return saree == null;
    }
    
    // ✅ Safe getter for saree ID (essential for admin UI)
    @JsonProperty("sareeId")
    public Long getSareeId() {
        try {
            return saree != null ? saree.getId() : null;
        } catch (Exception e) {
            return null;
        }
    }
    
    // ✅ Safe getter for saree title
    @JsonProperty("sareeTitle")
    public String getSareeTitle() {
        try {
            return saree != null ? saree.getTitle() : "Deleted Saree";
        } catch (Exception e) {
            return "Deleted Saree";
        }
    }
    
    // ✅ Safe getter for saree fabric
    @JsonProperty("sareeFabric")
    public String getSareeFabric() {
        try {
            return saree != null ? saree.getFabric() : "N/A";
        } catch (Exception e) {
            return "N/A";
        }
    }
    
    // ✅ Safe getter for saree color
    @JsonProperty("sareeColor")
    public String getSareeColor() {
        try {
            return saree != null ? saree.getColor() : "N/A";
        } catch (Exception e) {
            return "N/A";
        }
    }
    
    // ✅ Safe getter for saree price
    @JsonProperty("sareePrice")
    public BigDecimal getSareePrice() {
        try {
            return saree != null ? saree.getSellingPrice() : unitPrice;
        } catch (Exception e) {
            return unitPrice; // Fallback to stored unit price
        }
    }
    
    // ✅ Safe getter for saree image URL
    @JsonProperty("sareeImageUrl")
    public String getSareeImageUrl() {
        try {
            return saree != null ? saree.getImageUrl() : null;
        } catch (Exception e) {
            return null;
        }
    }
    
    // Helper method
    private void updateTotalPrice() {
        if (quantity != null && unitPrice != null) {
            this.totalPrice = unitPrice.multiply(BigDecimal.valueOf(quantity));
        }
    }
}
