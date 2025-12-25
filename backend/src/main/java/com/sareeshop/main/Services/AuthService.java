package com.sareeshop.main.Services;

import com.sareeshop.main.DTO.AuthResponse;
import com.sareeshop.main.DTO.LoginRequest;
import com.sareeshop.main.DTO.SignupRequest;

public interface AuthService {
    AuthResponse login(LoginRequest loginRequest);
    AuthResponse signup(SignupRequest signupRequest);
    AuthResponse createAdmin(SignupRequest signupRequest);
}
