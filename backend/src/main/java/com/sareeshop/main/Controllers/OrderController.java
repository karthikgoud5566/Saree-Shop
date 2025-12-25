package com.sareeshop.main.Controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.sareeshop.main.DTO.PlaceOrderRequest;
import com.sareeshop.main.Entities.Order;
import com.sareeshop.main.Entities.OrderStatus;
import com.sareeshop.main.Entities.User;
import com.sareeshop.main.Repositories.OrderRepository;
import com.sareeshop.main.Services.OrderService;

import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class OrderController {

    @Autowired
    private OrderService orderService;
    
    @Autowired
    private OrderRepository orderRepository;

    /* ---------- TEST ENDPOINT (NO AUTH REQUIRED) ---------- */
    
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testEndpoint() {
        System.out.println("🧪 TEST ENDPOINT HIT - Backend is working!");
        System.out.println("Current time: " + java.time.LocalDateTime.now());
        System.out.println("Server running on port: 8080");
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Backend is running perfectly!");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        response.put("server", "Spring Boot - OrderController");
        response.put("port", "8080");
        
        return ResponseEntity.ok(response);
    }

    /* ---------- CREATE ORDERS (CUSTOMER AUTH REQUIRED) ---------- */

    @PostMapping("/full")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Map<String, Object>> createFullPaymentOrder(@RequestBody Map<String, Object> orderData) {
        System.out.println("=== FULL PAYMENT ORDER REQUEST ===");
        System.out.println("Timestamp: " + java.time.LocalDateTime.now());
        System.out.println("Received order data: " + orderData);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Extract and validate data
            if (!orderData.containsKey("customerId")) {
                response.put("success", false);
                response.put("message", "Customer ID is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (!orderData.containsKey("items")) {
                response.put("success", false);
                response.put("message", "Order items are required");
                return ResponseEntity.badRequest().body(response);
            }

            Long customerId = Long.valueOf(orderData.get("customerId").toString());
            String shippingAddress = (String) orderData.get("shippingAddress");
            List<Map<String, Object>> items = (List<Map<String, Object>>) orderData.get("items");
            
            System.out.println("✅ Parsed - Customer ID: " + customerId);
            System.out.println("✅ Parsed - Shipping Address: " + shippingAddress);
            System.out.println("✅ Parsed - Items count: " + items.size());
            
            // Extract saree IDs and quantities from items
            List<Long> sareeIds = items.stream()
                .map(item -> Long.valueOf(item.get("sareeId").toString()))
                .collect(java.util.stream.Collectors.toList());
                
            List<Integer> quantities = items.stream()
                .map(item -> Integer.valueOf(item.get("quantity").toString()))
                .collect(java.util.stream.Collectors.toList());
            
            System.out.println("✅ Saree IDs: " + sareeIds);
            System.out.println("✅ Quantities: " + quantities);
            
            // Create order using existing service method
            System.out.println("🚀 Calling orderService.createFullPaymentOrder...");
            Order order = orderService.createFullPaymentOrder(customerId, sareeIds, quantities);
            System.out.println("✅ Order created with ID: " + order.getId());
            
            // Update shipping address if provided
            if (shippingAddress != null && !shippingAddress.trim().isEmpty()) {
                System.out.println("🚀 Updating shipping address...");
                Map<String, Object> updates = new HashMap<>();
                updates.put("shippingAddress", shippingAddress);
                order = orderService.updateOrderFields(order.getId(), updates);
                System.out.println("✅ Shipping address updated");
            }
            
            response.put("success", true);
            response.put("message", "Order placed successfully!");
            response.put("orderId", order.getId());
            response.put("totalAmount", order.getTotalAmount());
            
            System.out.println("🎉 ORDER SUCCESS - ID: " + order.getId() + ", Amount: " + order.getTotalAmount());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ FULL PAYMENT ORDER ERROR: " + e.getMessage());
            e.printStackTrace();
            
            response.put("success", false);
            response.put("message", "Failed to place order: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/installment")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Map<String, Object>> createInstallmentOrder(@RequestBody Map<String, Object> orderData) {
        System.out.println("=== INSTALLMENT ORDER REQUEST ===");
        System.out.println("Timestamp: " + java.time.LocalDateTime.now());
        System.out.println("Received order data: " + orderData);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Extract and validate data
            if (!orderData.containsKey("customerId") || !orderData.containsKey("items") || !orderData.containsKey("advanceAmount")) {
                response.put("success", false);
                response.put("message", "Customer ID, items, and advance amount are required");
                return ResponseEntity.badRequest().body(response);
            }

            Long customerId = Long.valueOf(orderData.get("customerId").toString());
            String shippingAddress = (String) orderData.get("shippingAddress");
            List<Map<String, Object>> items = (List<Map<String, Object>>) orderData.get("items");
            BigDecimal advanceAmount = new BigDecimal(orderData.get("advanceAmount").toString());
            
            System.out.println("✅ Parsed - Customer ID: " + customerId);
            System.out.println("✅ Parsed - Advance Amount: " + advanceAmount);
            System.out.println("✅ Parsed - Items count: " + items.size());
            
            // Extract saree IDs and quantities from items
            List<Long> sareeIds = items.stream()
                .map(item -> Long.valueOf(item.get("sareeId").toString()))
                .collect(java.util.stream.Collectors.toList());
                
            List<Integer> quantities = items.stream()
                .map(item -> Integer.valueOf(item.get("quantity").toString()))
                .collect(java.util.stream.Collectors.toList());
            
            // Create installment order using existing service method
            System.out.println("🚀 Calling orderService.createInstallmentOrder...");
            Order order = orderService.createInstallmentOrder(customerId, sareeIds, quantities, advanceAmount);
            System.out.println("✅ Installment order created with ID: " + order.getId());
            
            // Update shipping address if provided
            if (shippingAddress != null && !shippingAddress.trim().isEmpty()) {
                Map<String, Object> updates = new HashMap<>();
                updates.put("shippingAddress", shippingAddress);
                order = orderService.updateOrderFields(order.getId(), updates);
            }
            
            response.put("success", true);
            response.put("message", "Installment order placed successfully!");
            response.put("orderId", order.getId());
            response.put("totalAmount", order.getTotalAmount());
            response.put("paidAmount", order.getPaidAmount());
            response.put("pendingAmount", order.getPendingAmount());
            
            System.out.println("🎉 INSTALLMENT ORDER SUCCESS - ID: " + order.getId());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ INSTALLMENT ORDER ERROR: " + e.getMessage());
            e.printStackTrace();
            
            response.put("success", false);
            response.put("message", "Failed to place installment order: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /* ---------- OTHER ENDPOINTS ---------- */

    @PostMapping("/{orderId}/payment")
    public ResponseEntity<Order> addInstallmentPayment(
            @PathVariable Long orderId,
            @RequestParam BigDecimal amount,
            @RequestParam(defaultValue = "CASH") String method) {

        Order order = orderService.recordInstallmentPayment(orderId, amount, method);
        return ResponseEntity.ok(order);
    }
    
    @PostMapping("/place-order")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> placeOrder(@RequestBody PlaceOrderRequest request) {
        System.out.println("🚀 POST /api/orders/place-order - Creating order for customer: " + request.getCustomerId());
        
        try {
            // ✅ FIXED: Extract saree IDs and quantities properly
            List<Long> sareeIds = request.getItems().stream()
                .map(PlaceOrderRequest.OrderItemRequest::getSareeId)
                .collect(Collectors.toList());
                
            List<Integer> quantities = request.getItems().stream()
                .map(PlaceOrderRequest.OrderItemRequest::getQuantity)
                .collect(Collectors.toList());
            
            // Use your existing createFullPaymentOrder method with correct parameters
            Order order = orderService.createFullPaymentOrder(
                request.getCustomerId(),
                sareeIds,
                quantities
            );
            
            // ✅ Update shipping address if provided
            if (request.getShippingAddress() != null && !request.getShippingAddress().trim().isEmpty()) {
                Map<String, Object> updates = new HashMap<>();
                updates.put("shippingAddress", request.getShippingAddress());
                order = orderService.updateOrderFields(order.getId(), updates);
            }
            
            // ✅ Add notes if provided
            if (request.getNotes() != null && !request.getNotes().trim().isEmpty()) {
                Map<String, Object> updates = new HashMap<>();
                updates.put("notes", request.getNotes());
                order = orderService.updateOrderFields(order.getId(), updates);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Order placed successfully!");
            response.put("order", order);
            
            System.out.println("✅ Order created successfully with ID: " + order.getId());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error creating order: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to place order: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    
    

    
    
    
    
    
    
    
    
    @GetMapping
    public List<Order> all() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> one(@PathVariable Long id) {
        return orderService.getOrderById(id)
                           .map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public List<Order> byCustomer(@PathVariable Long customerId) {
        return orderService.getOrdersByCustomerId(customerId);
    }

    @GetMapping("/pending-installments")
    public List<Order> pendingInstallments() {
        return orderService.getPendingInstallmentOrders();
    }

    @GetMapping("/outstanding/total")
    public BigDecimal totalOutstanding() {
        return orderService.getTotalOutstandingAmount();
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        try {
            Order updatedOrder = orderService.updateOrderFields(id, updates);
            return ResponseEntity.ok(updatedOrder);
            
        } catch (RuntimeException e) {
            System.out.println("Order update error: " + e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.out.println("Order update error: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/my-orders")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<Order>> getMyOrders(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            if (user.getCustomer() != null) {
                List<Order> orders = orderService.getOrdersByCustomerId(user.getCustomer().getId());
                return ResponseEntity.ok(orders);
            }
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/debug")
    public ResponseEntity<Map<String, Object>> debugOrders() {
        Map<String, Object> debug = new HashMap<>();
        
        try {
            long dbCount = orderRepository.count();
            List<Order> allOrders = orderRepository.findAll();
            
            debug.put("dbCount", dbCount);
            debug.put("foundCount", allOrders.size());
            debug.put("orderIds", allOrders.stream().map(Order::getId).collect(Collectors.toList()));
            
            // Test JSON serialization
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            
            try {
                String jsonTest = mapper.writeValueAsString(allOrders);
                debug.put("jsonSerializationSuccess", true);
                debug.put("jsonLength", jsonTest.length());
            } catch (Exception jsonError) {
                debug.put("jsonSerializationSuccess", false);
                debug.put("jsonError", jsonError.getMessage());
            }
            
        } catch (Exception e) {
            debug.put("error", e.getMessage());
            e.printStackTrace();
        }
        
        return ResponseEntity.ok(debug);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        System.out.println("🗑️ DELETE request for order ID: " + id);
        try {
            // Simple existence check
            if (!orderService.getOrderById(id).isPresent()) {
                System.out.println("❌ Order not found: " + id);
                return ResponseEntity.notFound().build();
            }
            
            // Delete without complex validation
            orderService.deleteOrder(id);
            System.out.println("✅ Order deleted successfully: " + id);
            return ResponseEntity.ok().build();
            
        } catch (Exception e) {
            System.err.println("❌ Error deleting order: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }



}
