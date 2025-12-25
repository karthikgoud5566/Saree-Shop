package com.sareeshop.main.DataIntializer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sareeshop.main.DTO.SignupRequest;
import com.sareeshop.main.Services.AuthService;

import jakarta.annotation.PostConstruct;

@Component
public class DataInitializer {

    @Autowired
    private AuthService authService;

    @PostConstruct
    public void init() {
        // Create default admin user if it doesn't exist
        try {
            SignupRequest adminRequest = new SignupRequest();
            adminRequest.setName("Admin User");
            adminRequest.setEmail("admin@priyasarees.com");
            adminRequest.setPassword("123");
            adminRequest.setPhoneNumber("9999999999");
            
            authService.createAdmin(adminRequest);
            System.out.println("Default admin user created: admin@priyasarees.com / admin123");
        } catch (Exception e) {
            System.out.println("Admin user already exists or could not be created");
        }
    }
}

