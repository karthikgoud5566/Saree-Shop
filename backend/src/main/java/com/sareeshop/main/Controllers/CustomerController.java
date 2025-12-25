package com.sareeshop.main.Controllers;
import com.sareeshop.main.Entities.Customer;
import com.sareeshop.main.Entities.User;
import com.sareeshop.main.Services.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}) // ✅ Add CORS support
public class CustomerController {
    
    @Autowired
    private CustomerService customerService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // ✅ Add admin authorization for viewing all customers
    public ResponseEntity<List<Customer>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // ✅ ADD THIS - Main fix for 403 error
    public ResponseEntity<Customer> addCustomer(@RequestBody Customer customer) {
        System.out.println("🚀 POST /api/customers - Creating customer: " + customer.getName());
        
        try {
            Customer savedCustomer = customerService.addCustomer(customer);
            System.out.println("✅ Customer created with ID: " + savedCustomer.getId());
            return ResponseEntity.ok(savedCustomer);
            
        } catch (Exception e) { // ✅ Catch all exceptions, not just IllegalArgumentException
            System.err.println("❌ Error creating customer: " + e.getMessage());
            e.printStackTrace(); // ✅ Print full stack trace for debugging
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ✅ Add admin authorization for viewing specific customer
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        return customerService.getCustomerById(id)
            .map(customer -> ResponseEntity.ok(customer))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/me")
    @PreAuthorize("hasRole('CUSTOMER')") // ✅ Keep this as is - customers accessing their own profile
    public ResponseEntity<Customer> getMyProfile(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            if (user.getCustomer() != null) {
                return ResponseEntity.ok(user.getCustomer());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/phone/{phoneNumber}")
    @PreAuthorize("hasRole('ADMIN')") // ✅ Add admin authorization
    public ResponseEntity<Customer> getCustomerByPhone(@PathVariable String phoneNumber) {
        return customerService.getCustomerByPhoneNumber(phoneNumber)
            .map(customer -> ResponseEntity.ok(customer))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/search/{name}")
    @PreAuthorize("hasRole('ADMIN')") // ✅ Add admin authorization
    public ResponseEntity<List<Customer>> searchCustomers(@PathVariable String name) {
        List<Customer> customers = customerService.searchCustomersByName(name);
        return ResponseEntity.ok(customers);
    }
    
    @GetMapping("/outstanding")
    @PreAuthorize("hasRole('ADMIN')") // ✅ Add admin authorization
    public ResponseEntity<List<Customer>> getCustomersWithOutstanding() {
        List<Customer> customers = customerService.getCustomersWithOutstanding();
        return ResponseEntity.ok(customers);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ✅ Add admin authorization for updates
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        System.out.println("🔄 PUT /api/customers/" + id + " - Updating customer");
        
        try {
            Customer updatedCustomer = customerService.updateCustomer(id, customer);
            System.out.println("✅ Customer updated successfully: " + id);
            return ResponseEntity.ok(updatedCustomer);
            
        } catch (RuntimeException e) {
            System.err.println("❌ Error updating customer: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") 
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        System.out.println("🗑️ DELETE request for customer ID: " + id);
        try {
            // Simplified delete - remove complex business logic that causes 400 errors
            customerService.deleteCustomer(id);
            System.out.println("✅ Customer deleted successfully: " + id);
            return ResponseEntity.ok().build();
            
        } catch (Exception e) {
            System.err.println("❌ Error deleting customer: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}
