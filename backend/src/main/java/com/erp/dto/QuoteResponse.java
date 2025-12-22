package com.erp.dto;

import com.erp.entity.Quote;
import com.erp.entity.LineItem;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class QuoteResponse {
    private Long id;
    private String quoteNumber;
    private Long customerId;
    private String customerName;
    private String reference;
    private LocalDate quoteDate;
    private LocalDate expiryDate;
    private String salesperson;
    private String subject;
    private List<LineItemDTO> lineItems;
    private BigDecimal subTotal;
    private BigDecimal shippingCharges;
    private BigDecimal adjustment;
    private BigDecimal total;
    private String customerNotes;
    private String termsAndConditions;
    private String attachmentUrl;
    private String status;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;

    // Constructors
    public QuoteResponse() {
    }

    // Factory method to create from entity
    public static QuoteResponse fromEntity(Quote quote) {
        QuoteResponse response = new QuoteResponse();
        response.setId(quote.getId());
        response.setQuoteNumber(quote.getQuoteNumber());
        response.setCustomerId(quote.getCustomerId());
        response.setCustomerName(quote.getCustomerName());
        response.setReference(quote.getReference());
        response.setQuoteDate(quote.getQuoteDate());
        response.setExpiryDate(quote.getExpiryDate());
        response.setSalesperson(quote.getSalesperson());
        response.setSubject(quote.getSubject());
        response.setSubTotal(quote.getSubTotal());
        response.setShippingCharges(quote.getShippingCharges());
        response.setAdjustment(quote.getAdjustment());
        response.setTotal(quote.getTotal());
        response.setCustomerNotes(quote.getCustomerNotes());
        response.setTermsAndConditions(quote.getTermsAndConditions());
        response.setAttachmentUrl(quote.getAttachmentUrl());
        response.setStatus(quote.getStatus() != null ? quote.getStatus().name() : null);
        response.setActive(quote.isActive());
        response.setCreatedAt(quote.getCreatedAt());
        response.setUpdatedAt(quote.getUpdatedAt());
        response.setCreatedBy(quote.getCreatedBy());
        response.setUpdatedBy(quote.getUpdatedBy());

        if (quote.getLineItems() != null) {
            response.setLineItems(quote.getLineItems().stream()
                    .map(QuoteResponse::mapLineItem)
                    .collect(Collectors.toList()));
        }

        return response;
    }

    private static LineItemDTO mapLineItem(LineItem item) {
        return LineItemDTO.builder()
                .id(item.getId())
                .itemId(item.getItemId())
                .itemName(item.getItemName())
                .itemDescription(item.getItemDescription())
                .unit(item.getUnit())
                .quantity(item.getQuantity())
                .rate(item.getRate())
                .discountPercent(item.getDiscountPercent())
                .discountAmount(item.getDiscountAmount())
                .amount(item.getAmount())
                .taxPercent(item.getTaxPercent())
                .taxAmount(item.getTaxAmount())
                .build();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuoteNumber() {
        return quoteNumber;
    }

    public void setQuoteNumber(String quoteNumber) {
        this.quoteNumber = quoteNumber;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public LocalDate getQuoteDate() {
        return quoteDate;
    }

    public void setQuoteDate(LocalDate quoteDate) {
        this.quoteDate = quoteDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getSalesperson() {
        return salesperson;
    }

    public void setSalesperson(String salesperson) {
        this.salesperson = salesperson;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public List<LineItemDTO> getLineItems() {
        return lineItems;
    }

    public void setLineItems(List<LineItemDTO> lineItems) {
        this.lineItems = lineItems;
    }

    public BigDecimal getSubTotal() {
        return subTotal;
    }

    public void setSubTotal(BigDecimal subTotal) {
        this.subTotal = subTotal;
    }

    public BigDecimal getShippingCharges() {
        return shippingCharges;
    }

    public void setShippingCharges(BigDecimal shippingCharges) {
        this.shippingCharges = shippingCharges;
    }

    public BigDecimal getAdjustment() {
        return adjustment;
    }

    public void setAdjustment(BigDecimal adjustment) {
        this.adjustment = adjustment;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getCustomerNotes() {
        return customerNotes;
    }

    public void setCustomerNotes(String customerNotes) {
        this.customerNotes = customerNotes;
    }

    public String getTermsAndConditions() {
        return termsAndConditions;
    }

    public void setTermsAndConditions(String termsAndConditions) {
        this.termsAndConditions = termsAndConditions;
    }

    public String getAttachmentUrl() {
        return attachmentUrl;
    }

    public void setAttachmentUrl(String attachmentUrl) {
        this.attachmentUrl = attachmentUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
}
