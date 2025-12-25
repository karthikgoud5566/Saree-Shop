package com.sareeshop.main.DTO;

import java.util.List;

public class PlaceOrderRequest {
    private Long customerId;
    private List<OrderItemRequest> items;
    private String shippingAddress;
    private String notes;
    
    // Getters and setters
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    
    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
    
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public static class OrderItemRequest {
        private Long sareeId;
        private Integer quantity;
        
        public Long getSareeId() { return sareeId; }
        public void setSareeId(Long sareeId) { this.sareeId = sareeId; }
        
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}
