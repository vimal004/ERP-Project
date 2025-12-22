package com.erp.dto;

import com.erp.entity.DeliveryChallan;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class DeliveryChallanResponse {
    private Long id;
    private String deliveryChallanNumber;
    private Long customerId;
    private String customerName;
    private Long salesOrderId;
    private String challanType;
    private String reference;
    private LocalDate challanDate;
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

    public DeliveryChallanResponse() {
    }

    public static DeliveryChallanResponse fromEntity(DeliveryChallan challan) {
        DeliveryChallanResponse response = new DeliveryChallanResponse();
        response.setId(challan.getId());
        response.setDeliveryChallanNumber(challan.getDeliveryChallanNumber());
        response.setCustomerId(challan.getCustomerId());
        response.setCustomerName(challan.getCustomerName());
        response.setSalesOrderId(challan.getSalesOrderId());
        response.setChallanType(challan.getChallanType());
        response.setReference(challan.getReference());
        response.setChallanDate(challan.getChallanDate());
        response.setSubTotal(challan.getSubTotal());
        response.setShippingCharges(challan.getShippingCharges());
        response.setAdjustment(challan.getAdjustment());
        response.setTotal(challan.getTotal());
        response.setCustomerNotes(challan.getCustomerNotes());
        response.setTermsAndConditions(challan.getTermsAndConditions());
        response.setAttachmentUrl(challan.getAttachmentUrl());
        response.setStatus(challan.getStatus() != null ? challan.getStatus().name() : null);
        response.setActive(challan.isActive());
        response.setCreatedAt(challan.getCreatedAt());
        response.setUpdatedAt(challan.getUpdatedAt());
        response.setCreatedBy(challan.getCreatedBy());
        response.setUpdatedBy(challan.getUpdatedBy());
        if (challan.getLineItems() != null) {
            response.setLineItems(challan.getLineItems().stream()
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

    public String getDeliveryChallanNumber() {
        return deliveryChallanNumber;
    }

    public void setDeliveryChallanNumber(String num) {
        this.deliveryChallanNumber = num;
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

    public String getChallanType() {
        return challanType;
    }

    public void setChallanType(String challanType) {
        this.challanType = challanType;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public LocalDate getChallanDate() {
        return challanDate;
    }

    public void setChallanDate(LocalDate challanDate) {
        this.challanDate = challanDate;
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

    public void setTermsAndConditions(String t) {
        this.termsAndConditions = t;
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
