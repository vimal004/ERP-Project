package com.erp.dto;

import com.erp.entity.Invoice;
import com.erp.entity.LineItem;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class InvoiceResponse {
    private Long id;
    private String invoiceNumber;
    private Long customerId;
    private String customerName;
    private Long salesOrderId;
    private String reference;
    private LocalDate invoiceDate;
    private LocalDate dueDate;
    private String paymentTerms;
    private String salesperson;
    private List<LineItemDTO> lineItems;
    private BigDecimal subTotal;
    private BigDecimal shippingCharges;
    private BigDecimal adjustment;
    private BigDecimal total;
    private BigDecimal amountPaid;
    private BigDecimal balanceDue;
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
    public InvoiceResponse() {
    }

    // Factory method to create from entity
    public static InvoiceResponse fromEntity(Invoice invoice) {
        InvoiceResponse response = new InvoiceResponse();
        response.setId(invoice.getId());
        response.setInvoiceNumber(invoice.getInvoiceNumber());
        response.setCustomerId(invoice.getCustomerId());
        response.setCustomerName(invoice.getCustomerName());
        response.setSalesOrderId(invoice.getSalesOrderId());
        response.setReference(invoice.getReference());
        response.setInvoiceDate(invoice.getInvoiceDate());
        response.setDueDate(invoice.getDueDate());
        response.setPaymentTerms(invoice.getPaymentTerms());
        response.setSalesperson(invoice.getSalesperson());
        response.setSubTotal(invoice.getSubTotal());
        response.setShippingCharges(invoice.getShippingCharges());
        response.setAdjustment(invoice.getAdjustment());
        response.setTotal(invoice.getTotal());
        response.setAmountPaid(invoice.getAmountPaid());
        response.setBalanceDue(invoice.getBalanceDue());
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
                    .map(InvoiceResponse::mapLineItem)
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

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
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

    public Long getSalesOrderId() {
        return salesOrderId;
    }

    public void setSalesOrderId(Long salesOrderId) {
        this.salesOrderId = salesOrderId;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public LocalDate getInvoiceDate() {
        return invoiceDate;
    }

    public void setInvoiceDate(LocalDate invoiceDate) {
        this.invoiceDate = invoiceDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
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

    public BigDecimal getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(BigDecimal amountPaid) {
        this.amountPaid = amountPaid;
    }

    public BigDecimal getBalanceDue() {
        return balanceDue;
    }

    public void setBalanceDue(BigDecimal balanceDue) {
        this.balanceDue = balanceDue;
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
