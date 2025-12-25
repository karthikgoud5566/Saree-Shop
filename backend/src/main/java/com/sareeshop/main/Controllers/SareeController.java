package com.sareeshop.main.Controllers;

import com.sareeshop.main.Entities.*;
import com.sareeshop.main.ServiceImpl.ImageUploadService;
import com.sareeshop.main.Services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sarees")
public class SareeController {
    
    @Autowired
    private SareeService sareeService; 
    
    @Autowired
    private ImageUploadService imageUploadService;
    
    @GetMapping
    public ResponseEntity<List<Saree>> getAllSarees() {
        List<Saree> sarees = sareeService.getAllSarees();
        return ResponseEntity.ok(sarees);
    }
    
    
    
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Saree> addSaree(@RequestBody Saree saree) {
        System.out.println("🚀 POST /api/sarees - Creating new saree");
        System.out.println("📝 Received saree data: " + saree.getTitle());
        
        try {
        	
            System.out.println("✅ Adding new saree and clearing cache");
            Saree savedSaree = sareeService.addSaree(saree);
            System.out.println("✅ Saree created with ID: " + savedSaree.getId());
            
           
            return ResponseEntity.ok(savedSaree);
            
        } catch (Exception e) {
            System.err.println("❌ Error creating saree: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    
    
    @GetMapping("/{id}")
    public ResponseEntity<Saree> getSareeById(@PathVariable Long id) {
        return sareeService.getSareeById(id)
            .map(saree -> ResponseEntity.ok(saree))
            .orElse(ResponseEntity.notFound().build());
    }
    
    
    
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Saree> updateSaree(@PathVariable Long id, @RequestBody Saree saree) {
        try {
            Saree updatedSaree = sareeService.updateSaree(id, saree);
            return ResponseEntity.ok(updatedSaree);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSaree(@PathVariable Long id) {
        sareeService.deleteSaree(id);
        return ResponseEntity.ok().build();
    }
    
   
    @GetMapping("/search/color/{color}")
    public ResponseEntity<List<Saree>> searchByColor(@PathVariable String color) {
        List<Saree> sarees = sareeService.searchSareesByColor(color);
        return ResponseEntity.ok(sarees);
    }
    
    @GetMapping("/search/fabric/{fabric}")
    public ResponseEntity<List<Saree>> searchByFabric(@PathVariable String fabric) {
        List<Saree> sarees = sareeService.searchSareesByFabric(fabric);
        return ResponseEntity.ok(sarees);
    }
    
    
    @PostMapping("/{id}/upload-image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> uploadSareeImage(
            @PathVariable Long id, 
            @RequestParam("image") MultipartFile file) {
        
        System.out.println("=== UPLOAD REQUEST RECEIVED ===");
        System.out.println("Saree ID: " + id);
        System.out.println("File received: " + (file != null));
        if (file != null) {
            System.out.println("File name: " + file.getOriginalFilename());
            System.out.println("File size: " + file.getSize());
            System.out.println("File type: " + file.getContentType());
        }
        System.out.println("================================");
        
        // Rest of your existing method
        Map<String, String> result = imageUploadService.uploadAndUpdateSareeImage(id, file);
        
        if (result.containsKey("error")) {
            System.out.println("ERROR: " + result.get("error"));
            return ResponseEntity.badRequest().body(result);
        }
        
        System.out.println("SUCCESS: " + result.get("message"));
        return ResponseEntity.ok(result);
    }

}
