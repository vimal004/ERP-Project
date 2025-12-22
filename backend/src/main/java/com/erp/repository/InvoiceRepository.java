package com.erp.repository;

import com.erp.entity.Invoice;
import com.erp.entity.DocumentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByActiveTrue();

    Page<Invoice> findByActiveTrue(Pageable pageable);

    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    boolean existsByInvoiceNumber(String invoiceNumber);

    Page<Invoice> findByStatusAndActiveTrue(DocumentStatus status, Pageable pageable);

    Page<Invoice> findByCustomerIdAndActiveTrue(Long customerId, Pageable pageable);

    @Query("SELECT i FROM Invoice i WHERE (LOWER(i.invoiceNumber) LIKE LOWER(CONCAT('%', :term, '%')) OR LOWER(i.customerName) LIKE LOWER(CONCAT('%', :term, '%'))) AND i.active = true")
    Page<Invoice> search(@Param("term") String term, Pageable pageable);

    @Query("SELECT i FROM Invoice i WHERE i.dueDate < :date AND i.balanceDue > 0 AND i.active = true")
    List<Invoice> findOverdueInvoices(@Param("date") LocalDate date);

    @Query("SELECT i FROM Invoice i WHERE i.balanceDue > 0 AND i.active = true")
    List<Invoice> findUnpaidInvoices();

    long countByActiveTrue();

    long countByStatusAndActiveTrue(DocumentStatus status);

    @Query("SELECT COALESCE(MAX(CAST(SUBSTRING(i.invoiceNumber, 5) AS int)), 0) FROM Invoice i")
    Integer findMaxInvoiceNumber();
}
