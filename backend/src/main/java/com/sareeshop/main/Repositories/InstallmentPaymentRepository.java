package com.sareeshop.main.Repositories;



import com.sareeshop.main.Entities.InstallmentPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InstallmentPaymentRepository extends JpaRepository<InstallmentPayment, Long> {
    
    List<InstallmentPayment> findByOrderId(Long orderId);
    List<InstallmentPayment> findByOrderIdOrderByPaymentDateDesc(Long orderId);
}
