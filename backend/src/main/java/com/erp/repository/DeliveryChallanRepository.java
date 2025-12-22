package com.erp.repository;

import com.erp.entity.DeliveryChallan;
import com.erp.entity.DocumentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryChallanRepository extends JpaRepository<DeliveryChallan, Long> {
    List<DeliveryChallan> findByActiveTrue();

    Page<DeliveryChallan> findByActiveTrue(Pageable pageable);

    Optional<DeliveryChallan> findByDeliveryChallanNumber(String deliveryChallanNumber);

    boolean existsByDeliveryChallanNumber(String deliveryChallanNumber);

    Page<DeliveryChallan> findByStatusAndActiveTrue(DocumentStatus status, Pageable pageable);

    Page<DeliveryChallan> findByCustomerIdAndActiveTrue(Long customerId, Pageable pageable);

    Page<DeliveryChallan> findByChallanTypeAndActiveTrue(String challanType, Pageable pageable);

    @Query("SELECT d FROM DeliveryChallan d WHERE (LOWER(d.deliveryChallanNumber) LIKE LOWER(CONCAT('%', :term, '%')) OR LOWER(d.customerName) LIKE LOWER(CONCAT('%', :term, '%'))) AND d.active = true")
    Page<DeliveryChallan> search(@Param("term") String term, Pageable pageable);

    long countByActiveTrue();

    long countByStatusAndActiveTrue(DocumentStatus status);

    @Query("SELECT COALESCE(MAX(CAST(SUBSTRING(d.deliveryChallanNumber, 4) AS int)), 0) FROM DeliveryChallan d")
    Integer findMaxDeliveryChallanNumber();
}
