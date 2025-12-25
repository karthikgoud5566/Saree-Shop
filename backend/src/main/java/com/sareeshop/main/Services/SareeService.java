package com.sareeshop.main.Services;


import com.sareeshop.main.Entities.Saree;
import java.util.List;
import java.util.Optional;

public interface SareeService {
	
	
	
	
    List<Saree> getAllSarees();
    
    Optional<Saree> getSareeById(Long id);
    
    Saree addSaree(Saree saree);
    
    Saree updateSaree(Long id, Saree saree);
    
    void deleteSaree(Long id);
    
    List<Saree> searchSareesByColor(String color);
    
    List<Saree> searchSareesByFabric(String fabric);
    
    boolean isStockAvailable(Long sareeId, Integer quantity);
    
    void reduceStock(Long sareeId, Integer quantity);
    
    List<Saree> getPopularSarees();

}

