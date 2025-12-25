package com.sareeshop.main.ServiceImpl;


import org.springframework.stereotype.Service;
import java.util.regex.Pattern;

@Service
public class EmailValidationService {
    
    // Simple but effective email regex
    private static final String EMAIL_REGEX = 
        "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);
    
    /**
     * Simple email validation
     */
    public boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        
        email = email.trim().toLowerCase();
        return EMAIL_PATTERN.matcher(email).matches();
    }
    
    /**
     * Clean and normalize email
     */
    public String normalizeEmail(String email) {
        if (email == null) return null;
        return email.trim().toLowerCase();
    }
    
    /**
     * Simple validation with message
     */
    public ValidationResult validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return new ValidationResult(false, "Email address is required");
        }
        
        if (!isValidEmail(email)) {
            return new ValidationResult(false, "Please enter a valid email address");
        }
        
        return new ValidationResult(true, "Email is valid");
    }
    
    // Simple result class
    public static class ValidationResult {
        private boolean valid;
        private String message;
        
        public ValidationResult(boolean valid, String message) {
            this.valid = valid;
            this.message = message;
        }
        
        public boolean isValid() { return valid; }
        public String getMessage() { return message; }
    }
}
