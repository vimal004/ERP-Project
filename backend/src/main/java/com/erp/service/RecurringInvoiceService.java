package com.erp.service;

import com.erp.dto.RecurringInvoiceRequest;
import com.erp.dto.RecurringInvoiceResponse;
import com.erp.dto.LineItemDTO;
import com.erp.entity.RecurringInvoice;
import com.erp.entity.LineItem;
import com.erp.entity.DocumentStatus;
import com.erp.repository.RecurringInvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@SuppressWarnings("null")
public class RecurringInvoiceService {

    @Autowired
    private RecurringInvoiceRepository recurringInvoiceRepository;

    @Transactional
    public RecurringInvoiceResponse create(RecurringInvoiceRequest request) {
        RecurringInvoice invoice = new RecurringInvoice();
        mapRequestToEntity(request, invoice);
        invoice.setStatus(DocumentStatus.ACTIVE);
        invoice.setNextInvoiceDate(request.getStartOn());
        invoice.setCreatedBy(getCurrentUsername());
        RecurringInvoice saved = recurringInvoiceRepository.save(invoice);
        return RecurringInvoiceResponse.fromEntity(saved);
    }

    @Transactional
    public RecurringInvoiceResponse update(Long id, RecurringInvoiceRequest request) {
        RecurringInvoice invoice = recurringInvoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurring Invoice not found"));
        mapRequestToEntity(request, invoice);
        invoice.setUpdatedBy(getCurrentUsername());
        RecurringInvoice saved = recurringInvoiceRepository.save(invoice);
        return RecurringInvoiceResponse.fromEntity(saved);
    }

    public RecurringInvoiceResponse findById(Long id) {
        return recurringInvoiceRepository.findById(id)
                .map(RecurringInvoiceResponse::fromEntity)
                .orElseThrow(() -> new RuntimeException("Recurring Invoice not found"));
    }

    public Page<RecurringInvoiceResponse> findAll(Pageable pageable) {
        return recurringInvoiceRepository.findByActiveTrue(pageable).map(RecurringInvoiceResponse::fromEntity);
    }

    public Page<RecurringInvoiceResponse> search(String term, Pageable pageable) {
        return recurringInvoiceRepository.search(term, pageable).map(RecurringInvoiceResponse::fromEntity);
    }

    @Transactional
    public void softDelete(Long id) {
        RecurringInvoice invoice = recurringInvoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurring Invoice not found"));
        invoice.setActive(false);
        invoice.setUpdatedBy(getCurrentUsername());
        recurringInvoiceRepository.save(invoice);
    }

    @Transactional
    public RecurringInvoiceResponse pause(Long id) {
        RecurringInvoice invoice = recurringInvoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurring Invoice not found"));
        invoice.setStatus(DocumentStatus.STOPPED);
        invoice.setUpdatedBy(getCurrentUsername());
        return RecurringInvoiceResponse.fromEntity(recurringInvoiceRepository.save(invoice));
    }

    @Transactional
    public RecurringInvoiceResponse resume(Long id) {
        RecurringInvoice invoice = recurringInvoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurring Invoice not found"));
        invoice.setStatus(DocumentStatus.ACTIVE);
        invoice.setUpdatedBy(getCurrentUsername());
        return RecurringInvoiceResponse.fromEntity(recurringInvoiceRepository.save(invoice));
    }

    private void mapRequestToEntity(RecurringInvoiceRequest request, RecurringInvoice invoice) {
        invoice.setCustomerId(request.getCustomerId());
        invoice.setCustomerName(request.getCustomerName());
        invoice.setProfileName(request.getProfileName());
        invoice.setRepeatEvery(request.getRepeatEvery());
        invoice.setRepeatUnit(request.getRepeatUnit());
        invoice.setStartOn(request.getStartOn());
        invoice.setEndsOn(request.getEndsOn());
        invoice.setNeverExpires(request.getNeverExpires());
        invoice.setPaymentTerms(request.getPaymentTerms());
        invoice.setSalesperson(request.getSalesperson());
        invoice.setShippingCharges(request.getShippingCharges());
        invoice.setAdjustment(request.getAdjustment());
        invoice.setCustomerNotes(request.getCustomerNotes());
        invoice.setTermsAndConditions(request.getTermsAndConditions());
        invoice.setAttachmentUrl(request.getAttachmentUrl());

        if (request.getLineItems() != null) {
            List<LineItem> items = new ArrayList<>();
            for (LineItemDTO dto : request.getLineItems()) {
                LineItem item = new LineItem();
                item.setItemId(dto.getItemId());
                item.setItemName(dto.getItemName());
                item.setQuantity(dto.getQuantity());
                item.setRate(dto.getRate());
                item.setDiscountPercent(dto.getDiscountPercent());
                item.setTaxPercent(dto.getTaxPercent());
                item.calculateAmount();
                items.add(item);
            }
            invoice.setLineItems(items);
        }
        invoice.calculateTotals();
    }

    private String getCurrentUsername() {
        try {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        } catch (Exception e) {
            return "system";
        }
    }

    public record RecurringInvoiceStatistics(long total, long active, long stopped) {
    }

    public RecurringInvoiceStatistics getStatistics() {
        return new RecurringInvoiceStatistics(
                recurringInvoiceRepository.countByActiveTrue(),
                recurringInvoiceRepository.countByStatusAndActiveTrue(DocumentStatus.ACTIVE),
                recurringInvoiceRepository.countByStatusAndActiveTrue(DocumentStatus.STOPPED));
    }
}
