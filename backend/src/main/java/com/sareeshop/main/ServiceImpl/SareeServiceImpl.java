package com.sareeshop.main.ServiceImpl;

import com.sareeshop.main.Entities.*;
import com.sareeshop.main.Repositories.*;
import com.sareeshop.main.Services.*;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;  // ✅ CORRECT import
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SareeServiceImpl implements SareeService {
    
    @Autowired
    private SareeRepository sareeRepository;
    
    @PersistenceContext
    private EntityManager entityManager;
    
    // ✅ OPTIMIZED: Cached method for getting all active sarees
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "sarees", key = "'all-active'")
    public List<Saree> getAllSarees() {
        System.out.println("🔍 Loading sarees from database (not cached)");
        return sareeRepository.findByDeletedFalse();
    }
    
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "saree", key = "#id")
    public Optional<Saree> getSareeById(Long id) {
        System.out.println("🔍 Loading saree " + id + " from database (not cached)");
        return sareeRepository.findById(id);
    }
    
    @Override
    @CacheEvict(value = {"sarees", "popular-sarees"}, allEntries = true)
    public Saree addSaree(Saree saree) {
        System.out.println("✅ Adding new saree and clearing cache");
        // Business logic: Validate saree data
        if (saree.getStockQuantity() == null || saree.getStockQuantity() < 0) {
            saree.setStockQuantity(0);
        }
        if (saree.getSellingPrice() != null && saree.getCostPrice() != null) {
            if (saree.getSellingPrice().compareTo(saree.getCostPrice()) <= 0) {
                throw new IllegalArgumentException("Selling price must be greater than cost price");
            }
        }
        return sareeRepository.save(saree);
    }
    

    
    
    @Override
    @CacheEvict(value = {"sarees", "saree", "popular-sarees"}, allEntries = true)
    public Saree updateSaree(Long id, Saree saree) {
        System.out.println("✅ Updating saree " + id + " and clearing cache");
        return sareeRepository.findById(id)
            .map(existingSaree -> {
                // Update all regular fields
                existingSaree.setTitle(saree.getTitle());
                existingSaree.setFabric(saree.getFabric());
                existingSaree.setColor(saree.getColor());
                existingSaree.setDescription(saree.getDescription());
                existingSaree.setSellingPrice(saree.getSellingPrice());
                existingSaree.setCostPrice(saree.getCostPrice());
                existingSaree.setStockQuantity(saree.getStockQuantity());
                
                // ✅ PRESERVE EXISTING IMAGES - Only update if new image data provided
                if (saree.getImageUrl() != null && !saree.getImageUrl().isEmpty()) {
                    existingSaree.setImageUrl(saree.getImageUrl());
                    System.out.println("🖼️ Image URL updated");
                } else {
                    System.out.println("🖼️ Image URL preserved (no new image provided)");
                }
                
                if (saree.getImageFilename() != null && !saree.getImageFilename().isEmpty()) {
                    existingSaree.setImageFilename(saree.getImageFilename());
                    System.out.println("📁 Image filename updated");
                } else {
                    System.out.println("📁 Image filename preserved");
                }
                
                return sareeRepository.save(existingSaree);
            })
            .orElseThrow(() -> new RuntimeException("Saree not found with id: " + id));
    }

    
    
    
    @Override
    @Transactional
    @CacheEvict(value = {"sarees", "saree", "popular-sarees"}, allEntries = true)
    public void deleteSaree(Long id) {
        System.out.println("🗑️ Soft deleting saree " + id + " and clearing cache");
        Optional<Saree> sareeOpt = sareeRepository.findById(id);
        if (sareeOpt.isPresent()) {
            Saree saree = sareeOpt.get();
            saree.setDeleted(true);
            sareeRepository.save(saree);

            entityManager.flush();
            entityManager.clear();

            System.out.println("✅ Soft deleted saree with id " + id);
        } else {
            throw new RuntimeException("Saree not found: " + id);
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "saree-search", key = "'color-' + #color")
    public List<Saree> searchSareesByColor(String color) {
        System.out.println("🔍 Searching sarees by color: " + color + " (not cached)");
        return sareeRepository.findByColorContainingIgnoreCase(color);
    }
    
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "saree-search", key = "'fabric-' + #fabric")
    public List<Saree> searchSareesByFabric(String fabric) {
        System.out.println("🔍 Searching sarees by fabric: " + fabric + " (not cached)");
        return sareeRepository.findByFabricContainingIgnoreCase(fabric);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean isStockAvailable(Long sareeId, Integer quantity) {
        return sareeRepository.findById(sareeId)
            .map(saree -> saree.getStockQuantity() >= quantity)
            .orElse(false);
    }
    
    
    
    @Override
    @CacheEvict(value = {"sarees", "saree", "popular-sarees"}, allEntries = true)
    public void reduceStock(Long sareeId, Integer quantity) {
        System.out.println("📦 Reducing stock for saree " + sareeId + " and clearing cache");
        sareeRepository.findById(sareeId)
            .ifPresent(saree -> {
                if (saree.getStockQuantity() < quantity) {
                    throw new IllegalArgumentException("Insufficient stock");
                }
                saree.setStockQuantity(saree.getStockQuantity() - quantity);
                sareeRepository.save(saree);
            });
    }
    

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "popular-sarees", key = "'top10'")
    public List<Saree> getPopularSarees() {
        System.out.println("🔍 Loading popular sarees from database (not cached)");
        return sareeRepository.findTop10ByDeletedFalseOrderByStockQuantityDesc();
    }
}
