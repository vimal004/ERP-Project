package com.erp.repository;

import com.erp.entity.RecurringInvoice;
import com.erp.entity.DocumentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RecurringInvoiceRepository extends JpaRepository<RecurringInvoice, Long> {
    List<RecurringInvoice> findByActiveTrue();

    Page<RecurringInvoice> findByActiveTrue(Pageable pageable);

    Page<RecurringInvoice> findByStatusAndActiveTrue(DocumentStatus status, Pageable pageable);

    Page<RecurringInvoice> findByCustomerIdAndActiveTrue(Long customerId, Pageable pageable);

    @Query("SELECT r FROM RecurringInvoice r WHERE (LOWER(r.profileName) LIKE LOWER(CONCAT('%', :term, '%')) OR LOWER(r.customerName) LIKE LOWER(CONCAT('%', :term, '%'))) AND r.active = true")
    Page<RecurringInvoice> search(@Param("term") String term, Pageable pageable);

    @Query("SELECT r FROM RecurringInvoice r WHERE r.nextInvoiceDate <= :date AND r.status = 'ACTIVE' AND r.active = true")
    List<RecurringInvoice> findDueForInvoicing(@Param("date") LocalDate date);

    long countByActiveTrue();

    long countByStatusAndActiveTrue(DocumentStatus status);
}
