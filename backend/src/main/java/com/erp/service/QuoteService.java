package com.erp.service;

import com.erp.dto.QuoteRequest;
import com.erp.dto.QuoteResponse;
import com.erp.dto.LineItemDTO;
import com.erp.entity.Quote;
import com.erp.entity.LineItem;
import com.erp.entity.DocumentStatus;
import com.erp.repository.QuoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@SuppressWarnings("null")
public class QuoteService {

    @Autowired
    private QuoteRepository quoteRepository;

    @Transactional
    public QuoteResponse create(QuoteRequest request) {
        Quote quote = new Quote();
        quote.setQuoteNumber(generateQuoteNumber());
        mapRequestToEntity(request, quote);
        quote.setStatus(DocumentStatus.DRAFT);
        quote.setCreatedBy(getCurrentUsername());
        Quote saved = quoteRepository.save(quote);
        return QuoteResponse.fromEntity(saved);
    }

    @Transactional
    public QuoteResponse update(Long id, QuoteRequest request) {
        Quote quote = quoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quote not found"));
        mapRequestToEntity(request, quote);
        quote.setUpdatedBy(getCurrentUsername());
        Quote saved = quoteRepository.save(quote);
        return QuoteResponse.fromEntity(saved);
    }

    public QuoteResponse findById(Long id) {
        return quoteRepository.findById(id)
                .map(QuoteResponse::fromEntity)
                .orElseThrow(() -> new RuntimeException("Quote not found"));
    }

    public Page<QuoteResponse> findAll(Pageable pageable) {
        return quoteRepository.findByActiveTrue(pageable).map(QuoteResponse::fromEntity);
    }

    public Page<QuoteResponse> search(String term, Pageable pageable) {
        return quoteRepository.search(term, pageable).map(QuoteResponse::fromEntity);
    }

    public Page<QuoteResponse> findByStatus(DocumentStatus status, Pageable pageable) {
        return quoteRepository.findByStatusAndActiveTrue(status, pageable).map(QuoteResponse::fromEntity);
    }

    @Transactional
    public void softDelete(Long id) {
        Quote quote = quoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quote not found"));
        quote.setActive(false);
        quote.setUpdatedBy(getCurrentUsername());
        quoteRepository.save(quote);
    }

    @Transactional
    public QuoteResponse updateStatus(Long id, DocumentStatus status) {
        Quote quote = quoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quote not found"));
        quote.setStatus(status);
        quote.setUpdatedBy(getCurrentUsername());
        return QuoteResponse.fromEntity(quoteRepository.save(quote));
    }

    private void mapRequestToEntity(QuoteRequest request, Quote quote) {
        quote.setCustomerId(request.getCustomerId());
        quote.setCustomerName(request.getCustomerName());
        quote.setReference(request.getReference());
        quote.setQuoteDate(request.getQuoteDate() != null ? request.getQuoteDate() : LocalDate.now());
        quote.setExpiryDate(request.getExpiryDate());
        quote.setSalesperson(request.getSalesperson());
        quote.setSubject(request.getSubject());
        quote.setShippingCharges(request.getShippingCharges());
        quote.setAdjustment(request.getAdjustment());
        quote.setCustomerNotes(request.getCustomerNotes());
        quote.setTermsAndConditions(request.getTermsAndConditions());
        quote.setAttachmentUrl(request.getAttachmentUrl());

        if (request.getLineItems() != null) {
            List<LineItem> items = new ArrayList<>();
            for (LineItemDTO dto : request.getLineItems()) {
                LineItem item = new LineItem();
                item.setItemId(dto.getItemId());
                item.setItemName(dto.getItemName());
                item.setItemDescription(dto.getItemDescription());
                item.setUnit(dto.getUnit());
                item.setQuantity(dto.getQuantity());
                item.setRate(dto.getRate());
                item.setDiscountPercent(dto.getDiscountPercent());
                item.setTaxPercent(dto.getTaxPercent());
                item.calculateAmount();
                items.add(item);
            }
            quote.setLineItems(items);
        }
        quote.calculateTotals();
    }

    private String generateQuoteNumber() {
        Integer max = quoteRepository.findMaxQuoteNumber();
        int next = (max != null ? max : 0) + 1;
        return String.format("QT-%05d", next);
    }

    private String getCurrentUsername() {
        try {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        } catch (Exception e) {
            return "system";
        }
    }

    public record QuoteStatistics(long total, long draft, long sent, long accepted, long expired) {
    }

    public QuoteStatistics getStatistics() {
        return new QuoteStatistics(
                quoteRepository.countByActiveTrue(),
                quoteRepository.countByStatusAndActiveTrue(DocumentStatus.DRAFT),
                quoteRepository.countByStatusAndActiveTrue(DocumentStatus.SENT),
                quoteRepository.countByStatusAndActiveTrue(DocumentStatus.ACCEPTED),
                quoteRepository.countByStatusAndActiveTrue(DocumentStatus.EXPIRED));
    }
}
