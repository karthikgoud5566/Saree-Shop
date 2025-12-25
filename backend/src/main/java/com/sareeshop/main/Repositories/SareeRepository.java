package com.sareeshop.main.Repositories;

import com.sareeshop.main.Entities.*;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SareeRepository extends JpaRepository<Saree, Long> {
	
	
	List<Saree> findByDeletedFalse();
	List<Saree> findByColorContainingIgnoreCase(String color);
    List<Saree> findByFabricContainingIgnoreCase(String fabric);
    List<Saree> findByStockQuantityLessThan(Integer quantity); // For low stock alerts
    List<Saree> findBySellingPriceBetween(Double minPrice, Double maxPrice);
    
    List<Saree> findTop10ByDeletedFalseOrderByStockQuantityDesc();
    
    
    
}
