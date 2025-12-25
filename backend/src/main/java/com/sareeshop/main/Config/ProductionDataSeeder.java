package com.sareeshop.main.Config;

import com.sareeshop.main.Entities.Saree;
import com.sareeshop.main.Repositories.SareeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class ProductionDataSeeder implements CommandLineRunner {
    
    @Autowired
    private SareeRepository sareeRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (sareeRepository.count() == 0) {
            System.out.println("🌱 Seeding Railway MySQL with Priya's Saree Collection...");
            seedPriyaSareeCollection();
            System.out.println("✅ Railway MySQL database seeded with " + sareeRepository.count() + " sarees!");
        } else {
            System.out.println("📊 Railway MySQL already contains " + sareeRepository.count() + " sarees");
        }
    }
    
    private void seedPriyaSareeCollection() {
        // Traditional Bridal Collection
        createSaree("Banarasi Silk Wedding Saree", "silk", "red", 
                   new BigDecimal("3500.00"), new BigDecimal("2500.00"), 3,
                   "Premium Banarasi silk saree with gold zari work, perfect for weddings");
        
        createSaree("Kanchipuram Silk Saree", "silk", "gold",
                   new BigDecimal("4500.00"), new BigDecimal("3200.00"), 2,
                   "Traditional Kanchipuram silk saree with temple border for festivals");
        
        createSaree("Chanderi Silk Saree", "silk", "pink",
                   new BigDecimal("2200.00"), new BigDecimal("1600.00"), 6,
                   "Lightweight Chanderi silk saree perfect for office wear");
        
        // Daily Wear Collection  
        createSaree("Cotton Handloom Saree", "cotton", "blue",
                   new BigDecimal("1200.00"), new BigDecimal("800.00"), 8,
                   "Comfortable cotton saree for daily wear, breathable and easy to maintain");
        
        createSaree("Cotton Block Print Saree", "cotton", "green",
                   new BigDecimal("900.00"), new BigDecimal("650.00"), 12,
                   "Beautiful block printed cotton saree for everyday elegance");
        
        // Party Wear Collection
        createSaree("Designer Georgette Saree", "georgette", "black",
                   new BigDecimal("2800.00"), new BigDecimal("2000.00"), 5,
                   "Elegant designer saree with sequin work for parties");
        
        createSaree("Chiffon Party Saree", "chiffon", "purple",
                   new BigDecimal("2100.00"), new BigDecimal("1500.00"), 4,
                   "Flowing chiffon saree with beautiful drape for special occasions");
    }
    
    private void createSaree(String title, String fabric, String color, 
                           BigDecimal sellingPrice, BigDecimal costPrice, 
                           Integer stock, String description) {
        Saree saree = new Saree();
        saree.setTitle(title);
        saree.setFabric(fabric);
        saree.setColor(color);
        saree.setSellingPrice(sellingPrice);
        saree.setCostPrice(costPrice);  // Using costPrice instead of originalPrice
        saree.setStockQuantity(stock);
        saree.setDescription(description);
        saree.setDeleted(false); // Important for your soft delete logic
        
        // Set default image URL (you can update with actual images later)
        saree.setImageUrl("https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=400");
        
        sareeRepository.save(saree);
    }
}
