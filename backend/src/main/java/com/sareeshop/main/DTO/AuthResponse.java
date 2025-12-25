package com.sareeshop.main.DTO;



import com.sareeshop.main.Entities.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private String email;
    private String name;
    private Role role;
    private Long userId;
    private Long customerId; // Only for CUSTOMER role
    
    public AuthResponse(String token, String email, String name, Role role, Long userId, Long customerId) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.role = role;
        this.userId = userId;
        this.customerId = customerId;
    }
}
