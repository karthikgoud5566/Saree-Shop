package com.sareeshop.main;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.sareeshop.main.ServiceImpl.ImageUploadService;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class SareeShopApplication {

	
	
	@Autowired
    private ImageUploadService imageUploadService;
    
    public static void main(String[] args) {
        SpringApplication.run(SareeShopApplication.class, args);
    }
    
    @PostConstruct
    public void testSetup() {
        imageUploadService.testCloudinaryConnection();
    }

}
