package com.sareeshop.main.Entities;

import jakarta.persistence.*;
import java.math.BigDecimal;

import org.hibernate.annotations.Where;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "sarees")
@Where(clause = "deleted = false") // ✅ PERFECT - This maintains soft delete functionality
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "targetClass"}) // ✅ ENHANCED
public class Saree {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    private String fabric;        
    private String color;
    private String description;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal sellingPrice;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal costPrice;
    
    @Column(nullable = false)
    private Integer stockQuantity = 0;
    
    @Column(name = "image_url")
    private String imageUrl;  
    
    @Column(name = "image_filename")
    private String imageFilename;

    @Column(name = "deleted", nullable = false)
    private boolean deleted = false;
    
    // Constructors
    public Saree() {}
    
    public Saree(String title, String fabric, String color, BigDecimal sellingPrice, BigDecimal costPrice, Integer stockQuantity) {
        this.title = title;
        this.fabric = fabric;
        this.color = color;
        this.sellingPrice = sellingPrice;
        this.costPrice = costPrice;
        this.stockQuantity = stockQuantity;
        this.deleted = false; // ✅ ADDED: Explicit initialization
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getFabric() { return fabric; }
    public void setFabric(String fabric) { this.fabric = fabric; }
    
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getSellingPrice() { return sellingPrice; }
    public void setSellingPrice(BigDecimal sellingPrice) { this.sellingPrice = sellingPrice; }
    
    public BigDecimal getCostPrice() { return costPrice; }
    public void setCostPrice(BigDecimal costPrice) { this.costPrice = costPrice; }
    
    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public String getImageFilename() { return imageFilename; }
    public void setImageFilename(String imageFilename) { this.imageFilename = imageFilename; }
    
    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
}
