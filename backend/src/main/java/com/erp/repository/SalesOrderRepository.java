package com.erp.repository;

import com.erp.entity.SalesOrder;
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
public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {
    List<SalesOrder> findByActiveTrue();

    Page<SalesOrder> findByActiveTrue(Pageable pageable);

    Optional<SalesOrder> findBySalesOrderNumber(String salesOrderNumber);

    boolean existsBySalesOrderNumber(String salesOrderNumber);

    Page<SalesOrder> findByStatusAndActiveTrue(DocumentStatus status, Pageable pageable);

    Page<SalesOrder> findByCustomerIdAndActiveTrue(Long customerId, Pageable pageable);

    @Query("SELECT s FROM SalesOrder s WHERE (LOWER(s.salesOrderNumber) LIKE LOWER(CONCAT('%', :term, '%')) OR LOWER(s.customerName) LIKE LOWER(CONCAT('%', :term, '%'))) AND s.active = true")
    Page<SalesOrder> search(@Param("term") String term, Pageable pageable);

    long countByActiveTrue();

    long countByStatusAndActiveTrue(DocumentStatus status);

    @Query("SELECT COALESCE(MAX(CAST(SUBSTRING(s.salesOrderNumber, 4) AS int)), 0) FROM SalesOrder s")
    Integer findMaxSalesOrderNumber();
}
