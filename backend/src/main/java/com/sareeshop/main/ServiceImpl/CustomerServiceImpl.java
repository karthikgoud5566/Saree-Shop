package com.sareeshop.main.ServiceImpl;



import com.sareeshop.main.Entities.Customer;
import com.sareeshop.main.Repositories.*;
import com.sareeshop.main.Services.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CustomerServiceImpl implements CustomerService {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Override
    @Transactional(readOnly = true)
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Customer> getCustomerByPhoneNumber(String phoneNumber) {
        return customerRepository.findByPhoneNumber(phoneNumber);
    }
    
    @Override
    public Customer addCustomer(Customer customer) {
        // Business validation
        if (customer.getTotalOutstanding() == null) {
            customer.setTotalOutstanding(BigDecimal.ZERO);
        }
        
        // Check if phone number already exists
        if (customerRepository.findByPhoneNumber(customer.getPhoneNumber()).isPresent()) {
            throw new IllegalArgumentException("Customer with this phone number already exists");
        }
        
        return customerRepository.save(customer);
    }
    
    @Override
    public Customer updateCustomer(Long id, Customer customer) {
        return customerRepository.findById(id)
            .map(existingCustomer -> {
                existingCustomer.setName(customer.getName());
                existingCustomer.setEmail(customer.getEmail());
                existingCustomer.setAddress(customer.getAddress());
                existingCustomer.setDateOfBirth(customer.getDateOfBirth());
                existingCustomer.setPreferences(customer.getPreferences());
                return customerRepository.save(existingCustomer);
            })
            .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
    }
    
   
    @Override
    @Transactional
    public void deleteCustomer(Long id) {
        System.out.println("🗑️ Deleting customer with ID: " + id);
        
        customerRepository.deleteById(id);
 
        System.out.println("✅ Customer deleted successfully: " + id);
    }

    
    @Override
    @Transactional(readOnly = true)
    public List<Customer> searchCustomersByName(String name) {
        return customerRepository.findByNameContainingIgnoreCase(name);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Customer> getCustomersWithOutstanding() {
        return customerRepository.findByTotalOutstandingGreaterThan(BigDecimal.ZERO);
    }
    
    @Override
    public void updateCustomerOutstanding(Long customerId, BigDecimal amount) {
        customerRepository.findById(customerId)
            .ifPresent(customer -> {
                customer.setTotalOutstanding(customer.getTotalOutstanding().add(amount));
                customerRepository.save(customer);
            });
    }
    
    @Override
    public void recordPayment(Long customerId, BigDecimal paymentAmount) {
        customerRepository.findById(customerId)
            .ifPresent(customer -> {
                customer.setTotalOutstanding(customer.getTotalOutstanding().subtract(paymentAmount));
                customer.setLastPaymentDate(LocalDate.now());
                customerRepository.save(customer);
            });
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Customer> getCustomersSortedByOutstanding() {
        return customerRepository.findAllOrderByTotalOutstandingDesc();
    }

}

