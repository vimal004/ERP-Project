package com.erp.dto;

import com.erp.entity.RecurringInvoice;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class RecurringInvoiceResponse {
    private Long id;
    private Long customerId;
    private String customerName;
    private String profileName;
    private Integer repeatEvery;
    private String repeatUnit;
    private LocalDate startOn;
    private LocalDate endsOn;
    private Boolean neverExpires;
    private LocalDate lastInvoiceDate;
    private LocalDate nextInvoiceDate;
    private String paymentTerms;
    private String salesperson;
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

    public RecurringInvoiceResponse() {
    }

    public static RecurringInvoiceResponse fromEntity(RecurringInvoice invoice) {
        RecurringInvoiceResponse response = new RecurringInvoiceResponse();
        response.setId(invoice.getId());
        response.setCustomerId(invoice.getCustomerId());
        response.setCustomerName(invoice.getCustomerName());
        response.setProfileName(invoice.getProfileName());
        response.setRepeatEvery(invoice.getRepeatEvery());
        response.setRepeatUnit(invoice.getRepeatUnit());
        response.setStartOn(invoice.getStartOn());
        response.setEndsOn(invoice.getEndsOn());
        response.setNeverExpires(invoice.isNeverExpires());
        response.setLastInvoiceDate(invoice.getLastInvoiceDate());
        response.setNextInvoiceDate(invoice.getNextInvoiceDate());
        response.setPaymentTerms(invoice.getPaymentTerms());
        response.setSalesperson(invoice.getSalesperson());
        response.setSubTotal(invoice.getSubTotal());
        response.setShippingCharges(invoice.getShippingCharges());
        response.setAdjustment(invoice.getAdjustment());
        response.setTotal(invoice.getTotal());
        response.setCustomerNotes(invoice.getCustomerNotes());
        response.setTermsAndConditions(invoice.getTermsAndConditions());
        response.setAttachmentUrl(invoice.getAttachmentUrl());
        response.setStatus(invoice.getStatus() != null ? invoice.getStatus().name() : null);
        response.setActive(invoice.isActive());
        response.setCreatedAt(invoice.getCreatedAt());
        response.setUpdatedAt(invoice.getUpdatedAt());
        response.setCreatedBy(invoice.getCreatedBy());
        response.setUpdatedBy(invoice.getUpdatedBy());
        if (invoice.getLineItems() != null) {
            response.setLineItems(invoice.getLineItems().stream()
                    .map(item -> LineItemDTO.builder()
                            .id(item.getId()).itemId(item.getItemId()).itemName(item.getItemName())
                            .quantity(item.getQuantity()).rate(item.getRate()).amount(item.getAmount()).build())
                    .collect(Collectors.toList()));
        }
        return response;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getProfileName() {
        return profileName;
    }

    public void setProfileName(String profileName) {
        this.profileName = profileName;
    }

    public Integer getRepeatEvery() {
        return repeatEvery;
    }

    public void setRepeatEvery(Integer repeatEvery) {
        this.repeatEvery = repeatEvery;
    }

    public String getRepeatUnit() {
        return repeatUnit;
    }

    public void setRepeatUnit(String repeatUnit) {
        this.repeatUnit = repeatUnit;
    }

    public LocalDate getStartOn() {
        return startOn;
    }

    public void setStartOn(LocalDate startOn) {
        this.startOn = startOn;
    }

    public LocalDate getEndsOn() {
        return endsOn;
    }

    public void setEndsOn(LocalDate endsOn) {
        this.endsOn = endsOn;
    }

    public Boolean getNeverExpires() {
        return neverExpires;
    }

    public void setNeverExpires(Boolean neverExpires) {
        this.neverExpires = neverExpires;
    }

    public LocalDate getLastInvoiceDate() {
        return lastInvoiceDate;
    }

    public void setLastInvoiceDate(LocalDate lastInvoiceDate) {
        this.lastInvoiceDate = lastInvoiceDate;
    }

    public LocalDate getNextInvoiceDate() {
        return nextInvoiceDate;
    }

    public void setNextInvoiceDate(LocalDate nextInvoiceDate) {
        this.nextInvoiceDate = nextInvoiceDate;
    }

    public String getPaymentTerms() {
        return paymentTerms;
    }

    public void setPaymentTerms(String paymentTerms) {
        this.paymentTerms = paymentTerms;
    }

    public String getSalesperson() {
        return salesperson;
    }

    public void setSalesperson(String salesperson) {
        this.salesperson = salesperson;
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
