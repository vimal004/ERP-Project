package com.erp.service;

import com.erp.dto.InvoiceRequest;
import com.erp.dto.InvoiceResponse;
import com.erp.dto.LineItemDTO;
import com.erp.entity.Invoice;
import com.erp.entity.LineItem;
import com.erp.entity.DocumentStatus;
import com.erp.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@SuppressWarnings("null")
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Transactional
    public InvoiceResponse create(InvoiceRequest request) {
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(generateInvoiceNumber());
        mapRequestToEntity(request, invoice);
        invoice.setStatus(DocumentStatus.DRAFT);
        invoice.setAmountPaid(BigDecimal.ZERO);
        invoice.setCreatedBy(getCurrentUsername());
        Invoice saved = invoiceRepository.save(invoice);
        return InvoiceResponse.fromEntity(saved);
    }

    @Transactional
    public InvoiceResponse update(Long id, InvoiceRequest request) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        mapRequestToEntity(request, invoice);
        invoice.setUpdatedBy(getCurrentUsername());
        Invoice saved = invoiceRepository.save(invoice);
        return InvoiceResponse.fromEntity(saved);
    }

    public InvoiceResponse findById(Long id) {
        return invoiceRepository.findById(id)
                .map(InvoiceResponse::fromEntity)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
    }

    public Page<InvoiceResponse> findAll(Pageable pageable) {
        return invoiceRepository.findByActiveTrue(pageable).map(InvoiceResponse::fromEntity);
    }

    public Page<InvoiceResponse> search(String term, Pageable pageable) {
        return invoiceRepository.search(term, pageable).map(InvoiceResponse::fromEntity);
    }

    @Transactional
    public void softDelete(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        invoice.setActive(false);
        invoice.setUpdatedBy(getCurrentUsername());
        invoiceRepository.save(invoice);
    }

    @Transactional
    public InvoiceResponse recordPayment(Long id, BigDecimal amount) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        BigDecimal newPaid = invoice.getAmountPaid().add(amount);
        invoice.setAmountPaid(newPaid);
        invoice.calculateTotals();
        if (invoice.getBalanceDue().compareTo(BigDecimal.ZERO) <= 0) {
            invoice.setStatus(DocumentStatus.PAID);
        }
        invoice.setUpdatedBy(getCurrentUsername());
        return InvoiceResponse.fromEntity(invoiceRepository.save(invoice));
    }

    private void mapRequestToEntity(InvoiceRequest request, Invoice invoice) {
        invoice.setCustomerId(request.getCustomerId());
        invoice.setCustomerName(request.getCustomerName());
        invoice.setSalesOrderId(request.getSalesOrderId());
        invoice.setReference(request.getReference());
        invoice.setInvoiceDate(request.getInvoiceDate() != null ? request.getInvoiceDate() : LocalDate.now());
        invoice.setDueDate(request.getDueDate());
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

    private String generateInvoiceNumber() {
        Integer max = invoiceRepository.findMaxInvoiceNumber();
        int next = (max != null ? max : 0) + 1;
        return String.format("INV-%05d", next);
    }

    private String getCurrentUsername() {
        try {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        } catch (Exception e) {
            return "system";
        }
    }

    public record InvoiceStatistics(long total, long draft, long sent, long paid, long overdue) {
    }

    public InvoiceStatistics getStatistics() {
        long overdue = invoiceRepository.findOverdueInvoices(LocalDate.now()).size();
        return new InvoiceStatistics(
                invoiceRepository.countByActiveTrue(),
                invoiceRepository.countByStatusAndActiveTrue(DocumentStatus.DRAFT),
                invoiceRepository.countByStatusAndActiveTrue(DocumentStatus.SENT),
                invoiceRepository.countByStatusAndActiveTrue(DocumentStatus.PAID),
                overdue);
    }
}
