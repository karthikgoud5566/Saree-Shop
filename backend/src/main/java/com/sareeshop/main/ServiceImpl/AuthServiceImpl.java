package com.sareeshop.main.ServiceImpl;

import com.sareeshop.main.Entities.Customer;
import com.sareeshop.main.Entities.Role;
import com.sareeshop.main.Entities.User;
import com.sareeshop.main.Repositories.CustomerRepository;
import com.sareeshop.main.Repositories.UserRepository;
import com.sareeshop.main.	DTO.AuthResponse;
import com.sareeshop.main.DTO.LoginRequest;
import com.sareeshop.main.DTO.SignupRequest;
import com.sareeshop.main.Security.JWTUtils;
import com.sareeshop.main.Services.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JWTUtils jwtUtils;

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
                loginRequest.getPassword()
            )
        );

        User user = (User) authentication.getPrincipal();
        String jwt = jwtUtils.generateToken(user);

        Long customerId = null;
        if (user.getRole() == Role.CUSTOMER && user.getCustomer() != null) {
            customerId = user.getCustomer().getId();
        }

        return new AuthResponse(jwt, user.getEmail(), user.getName(), user.getRole(), user.getId(), customerId);
    }

    @Override
    @Transactional
    public AuthResponse signup(SignupRequest signupRequest) {
        // Check if user already exists
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        
        if (userRepository.existsByPhoneNumber(signupRequest.getPhoneNumber())) {
            throw new RuntimeException("Phone number is already in use!");
        }

        // Create new user
        User user = new User();
        user.setName(signupRequest.getName());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setPhoneNumber(signupRequest.getPhoneNumber());
        user.setRole(Role.CUSTOMER);

        User savedUser = userRepository.save(user);

        // Create customer profile
        Customer customer = new Customer();
        customer.setName(signupRequest.getName());
        customer.setPhoneNumber(signupRequest.getPhoneNumber());
        customer.setEmail(signupRequest.getEmail());
        customer.setAddress(signupRequest.getAddress());
        customer.setUser(savedUser);

        Customer savedCustomer = customerRepository.save(customer);
        
        // Update user with customer reference
        savedUser.setCustomer(savedCustomer);
        userRepository.save(savedUser);

        String jwt = jwtUtils.generateToken(savedUser);

        return new AuthResponse(jwt, savedUser.getEmail(), savedUser.getName(), 
                               savedUser.getRole(), savedUser.getId(), savedCustomer.getId());
    }

    @Override
    @Transactional
    public AuthResponse createAdmin(SignupRequest signupRequest) {
        // Check if user already exists
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        // Create admin user
        User user = new User();
        user.setName(signupRequest.getName());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setPhoneNumber(signupRequest.getPhoneNumber());
        user.setRole(Role.ADMIN);

        User savedUser = userRepository.save(user);
        String jwt = jwtUtils.generateToken(savedUser);

        return new AuthResponse(jwt, savedUser.getEmail(), savedUser.getName(), 
                               savedUser.getRole(), savedUser.getId(), null);
    }
}
