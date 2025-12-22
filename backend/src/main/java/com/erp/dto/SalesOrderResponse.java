package com.erp.dto;

import com.erp.entity.SalesOrder;
import com.erp.entity.LineItem;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class SalesOrderResponse {
    private Long id;
    private String salesOrderNumber;
    private Long customerId;
    private String customerName;
    private Long quoteId;
    private String reference;
    private LocalDate salesOrderDate;
    private LocalDate expectedShipmentDate;
    private String paymentTerms;
    private String deliveryMethod;
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

    // Constructors
    public SalesOrderResponse() {
    }

    // Factory method to create from entity
    public static SalesOrderResponse fromEntity(SalesOrder order) {
        SalesOrderResponse response = new SalesOrderResponse();
        response.setId(order.getId());
        response.setSalesOrderNumber(order.getSalesOrderNumber());
        response.setCustomerId(order.getCustomerId());
        response.setCustomerName(order.getCustomerName());
        response.setQuoteId(order.getQuoteId());
        response.setReference(order.getReference());
        response.setSalesOrderDate(order.getSalesOrderDate());
        response.setExpectedShipmentDate(order.getExpectedShipmentDate());
        response.setPaymentTerms(order.getPaymentTerms());
        response.setDeliveryMethod(order.getDeliveryMethod());
        response.setSalesperson(order.getSalesperson());
        response.setSubTotal(order.getSubTotal());
        response.setShippingCharges(order.getShippingCharges());
        response.setAdjustment(order.getAdjustment());
        response.setTotal(order.getTotal());
        response.setCustomerNotes(order.getCustomerNotes());
        response.setTermsAndConditions(order.getTermsAndConditions());
        response.setAttachmentUrl(order.getAttachmentUrl());
        response.setStatus(order.getStatus() != null ? order.getStatus().name() : null);
        response.setActive(order.isActive());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        response.setCreatedBy(order.getCreatedBy());
        response.setUpdatedBy(order.getUpdatedBy());

        if (order.getLineItems() != null) {
            response.setLineItems(order.getLineItems().stream()
                    .map(SalesOrderResponse::mapLineItem)
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

    public String getSalesOrderNumber() {
        return salesOrderNumber;
    }

    public void setSalesOrderNumber(String salesOrderNumber) {
        this.salesOrderNumber = salesOrderNumber;
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

    public Long getQuoteId() {
        return quoteId;
    }

    public void setQuoteId(Long quoteId) {
        this.quoteId = quoteId;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public LocalDate getSalesOrderDate() {
        return salesOrderDate;
    }

    public void setSalesOrderDate(LocalDate salesOrderDate) {
        this.salesOrderDate = salesOrderDate;
    }

    public LocalDate getExpectedShipmentDate() {
        return expectedShipmentDate;
    }

    public void setExpectedShipmentDate(LocalDate expectedShipmentDate) {
        this.expectedShipmentDate = expectedShipmentDate;
    }

    public String getPaymentTerms() {
        return paymentTerms;
    }

    public void setPaymentTerms(String paymentTerms) {
        this.paymentTerms = paymentTerms;
    }

    public String getDeliveryMethod() {
        return deliveryMethod;
    }

    public void setDeliveryMethod(String deliveryMethod) {
        this.deliveryMethod = deliveryMethod;
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
