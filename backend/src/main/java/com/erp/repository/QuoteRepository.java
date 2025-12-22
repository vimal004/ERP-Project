package com.erp.repository;

import com.erp.entity.Quote;
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
public interface QuoteRepository extends JpaRepository<Quote, Long> {
    List<Quote> findByActiveTrue();

    Page<Quote> findByActiveTrue(Pageable pageable);

    Optional<Quote> findByQuoteNumber(String quoteNumber);

    boolean existsByQuoteNumber(String quoteNumber);

    Page<Quote> findByStatusAndActiveTrue(DocumentStatus status, Pageable pageable);

    Page<Quote> findByCustomerIdAndActiveTrue(Long customerId, Pageable pageable);

    @Query("SELECT q FROM Quote q WHERE (LOWER(q.quoteNumber) LIKE LOWER(CONCAT('%', :term, '%')) OR LOWER(q.customerName) LIKE LOWER(CONCAT('%', :term, '%'))) AND q.active = true")
    Page<Quote> search(@Param("term") String term, Pageable pageable);

    @Query("SELECT q FROM Quote q WHERE q.expiryDate < :date AND q.status = 'SENT' AND q.active = true")
    List<Quote> findExpiredQuotes(@Param("date") LocalDate date);

    long countByActiveTrue();

    long countByStatusAndActiveTrue(DocumentStatus status);

    @Query("SELECT COALESCE(MAX(CAST(SUBSTRING(q.quoteNumber, 4) AS int)), 0) FROM Quote q")
    Integer findMaxQuoteNumber();
}
