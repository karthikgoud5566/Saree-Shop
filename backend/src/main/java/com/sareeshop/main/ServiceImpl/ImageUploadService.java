package com.sareeshop.main.ServiceImpl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.sareeshop.main.Entities.Saree;
import com.sareeshop.main.Services.SareeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class ImageUploadService {
    
    @Autowired
    private Cloudinary cloudinary;
    
    @Autowired
    private SareeService sareeService;
    
    // Main method that does everything
    public Map<String, String> uploadAndUpdateSareeImage(Long sareeId, MultipartFile file) {
        Map<String, String> result = new HashMap<>();
        
        try {
            // Step 1: Check if saree exists
            Optional<Saree> sareeOpt = sareeService.getSareeById(sareeId);
            if (sareeOpt.isEmpty()) {
                result.put("error", "Saree not found");
                return result;
            }
            
            // Step 2: Validate the image file
            String validationError = validateImageFile(file);
            if (validationError != null) {
                result.put("error", validationError);
                return result;
            }
            
            // Step 3: Upload to Cloudinary
            String imageUrl = uploadToCloudinary(file);
            
            // Step 4: Update saree in database
            Saree saree = sareeOpt.get();
            saree.setImageUrl(imageUrl);
            sareeService.addSaree(saree);
            
            // Step 5: Return success
            result.put("imageUrl", imageUrl);
            result.put("message", "Image uploaded successfully");
            
            return result;
            
        } catch (Exception e) {
            result.put("error", "Upload failed: " + e.getMessage());
            return result;
        }
    }
    
    // Helper method for validation
    private String validateImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return "Please select a file";
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return "Only image files allowed";
        }
        
        return null; // No errors
    }
    
    // Helper method for Cloudinary upload
    private String uploadToCloudinary(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), 
            ObjectUtils.asMap("folder", "saree-shop")
        );
        
        return (String) uploadResult.get("secure_url");
    }
    
    public void testCloudinaryConnection() {
        try {
            System.out.println("=== TESTING CLOUDINARY CONNECTION ===");
            
            // Correct way to access configuration
            System.out.println("Cloud name: " + cloudinary.config.cloudName);
            System.out.println("API key: " + cloudinary.config.apiKey);
            System.out.println("API secret: " + (cloudinary.config.apiSecret != null ? "***SET***" : "NOT SET"));
            
            // Test upload with a simple string
            Map uploadResult = cloudinary.uploader().upload("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==", 
                ObjectUtils.asMap("folder", "saree-shop-test"));
            
            System.out.println("Test upload successful!");
            System.out.println("Test image URL: " + uploadResult.get("secure_url"));
            System.out.println("====================================");
            
        } catch (Exception e) {
            System.err.println("Cloudinary connection failed:");
            e.printStackTrace();
        }
    }

}
