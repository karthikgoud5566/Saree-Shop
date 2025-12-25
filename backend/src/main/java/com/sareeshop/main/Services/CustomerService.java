package com.sareeshop.main.Services;

import com.sareeshop.main.Entities.Customer;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface CustomerService {
    List<Customer> getAllCustomers();
    Optional<Customer> getCustomerById(Long id);
    Optional<Customer> getCustomerByPhoneNumber(String phoneNumber);
    Customer addCustomer(Customer customer);
    Customer updateCustomer(Long id, Customer customer);
    void deleteCustomer(Long id);
    List<Customer> searchCustomersByName(String name);
    
    // Installment related methods
    List<Customer> getCustomersWithOutstanding();
    List<Customer> getCustomersSortedByOutstanding(); // NEW METHOD
    void updateCustomerOutstanding(Long customerId, BigDecimal amount);
    void recordPayment(Long customerId, BigDecimal paymentAmount);
    
    
    
    

}
