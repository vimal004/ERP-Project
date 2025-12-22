package com.erp.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class DeliveryChallanRequest {
    @NotNull(message = "Customer ID is required")
    private Long customerId;
    private String customerName;
    private Long salesOrderId;
    private String challanType; // SUPPLY, JOB_WORK, DELIVERY
    private String reference;
    private LocalDate challanDate;
    private List<LineItemDTO> lineItems;
    private BigDecimal shippingCharges;
    private BigDecimal adjustment;
    private String customerNotes;
    private String termsAndConditions;
    private String attachmentUrl;

    public DeliveryChallanRequest() {
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
}
