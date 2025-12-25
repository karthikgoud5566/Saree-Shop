package com.sareeshop.main.DTO;



import lombok.Data;

@Data
public class SignupRequest {
    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private String address;
}

