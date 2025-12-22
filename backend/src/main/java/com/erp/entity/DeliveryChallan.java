package com.erp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * DeliveryChallan entity for delivery documentation
 */
@Entity
@Table(name = "delivery_challans")
public class DeliveryChallan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "delivery_challan_number", unique = true, nullable = false)
    private String deliveryChallanNumber;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "reference_number")
    private String referenceNumber;

    @Column(name = "sales_order_id")
    private Long salesOrderId;

    @Column(name = "delivery_challan_date", nullable = false)
    private LocalDate deliveryChallanDate;

    @Column(name = "challan_type")
    private String challanType; // Supply of Liquid Gas, Job Work, Supply on Approval, Others

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "delivery_challan_id")
    private List<LineItem> items = new ArrayList<>();

    @Column(name = "sub_total", precision = 19, scale = 4)
    private BigDecimal subTotal;

    @Column(name = "adjustment_label")
    private String adjustmentLabel;

    @Column(name = "adjustment_amount", precision = 19, scale = 4)
    private BigDecimal adjustmentAmount;

    @Column(name = "total", precision = 19, scale = 4)
    private BigDecimal total;

    @Column(name = "currency")
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private DocumentStatus status = DocumentStatus.DRAFT;

    @Column(name = "customer_notes", length = 2000)
    private String customerNotes;

    @Column(name = "terms_conditions", length = 2000)
    private String termsConditions;

    @Column(name = "shipping_charges", precision = 19, scale = 4)
    private BigDecimal shippingCharges = BigDecimal.ZERO;

    @Column(name = "adjustment", precision = 19, scale = 4)
    private BigDecimal adjustment = BigDecimal.ZERO;

    @Column(name = "attachment_url")
    private String attachmentUrl;

    @Column(name = "is_active")
    private boolean active = true;

    // Audit fields
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    // Constructors
    public DeliveryChallan() {
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        calculateTotals();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateTotals();
    }

    public void calculateTotals() {
        this.subTotal = BigDecimal.ZERO;
        if (items != null) {
            for (LineItem item : items) {
                if (item.getAmount() != null) {
                    this.subTotal = this.subTotal.add(item.getAmount());
                }
            }
        }
        BigDecimal adj = adjustmentAmount != null ? adjustmentAmount : BigDecimal.ZERO;
        this.total = this.subTotal.add(adj);
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

    public void setDeliveryChallanNumber(String deliveryChallanNumber) {
        this.deliveryChallanNumber = deliveryChallanNumber;
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

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }

    public Long getSalesOrderId() {
        return salesOrderId;
    }

    public void setSalesOrderId(Long salesOrderId) {
        this.salesOrderId = salesOrderId;
    }

    public LocalDate getDeliveryChallanDate() {
        return deliveryChallanDate;
    }

    public void setDeliveryChallanDate(LocalDate deliveryChallanDate) {
        this.deliveryChallanDate = deliveryChallanDate;
    }

    public String getChallanType() {
        return challanType;
    }

    public void setChallanType(String challanType) {
        this.challanType = challanType;
    }

    public List<LineItem> getItems() {
        return items;
    }

    public void setItems(List<LineItem> items) {
        this.items = items;
    }

    public BigDecimal getSubTotal() {
        return subTotal;
    }

    public void setSubTotal(BigDecimal subTotal) {
        this.subTotal = subTotal;
    }

    public String getAdjustmentLabel() {
        return adjustmentLabel;
    }

    public void setAdjustmentLabel(String adjustmentLabel) {
        this.adjustmentLabel = adjustmentLabel;
    }

    public BigDecimal getAdjustmentAmount() {
        return adjustmentAmount;
    }

    public void setAdjustmentAmount(BigDecimal adjustmentAmount) {
        this.adjustmentAmount = adjustmentAmount;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public DocumentStatus getStatus() {
        return status;
    }

    public void setStatus(DocumentStatus status) {
        this.status = status;
    }

    public String getCustomerNotes() {
        return customerNotes;
    }

    public void setCustomerNotes(String customerNotes) {
        this.customerNotes = customerNotes;
    }

    public String getTermsConditions() {
        return termsConditions;
    }

    public void setTermsConditions(String termsConditions) {
        this.termsConditions = termsConditions;
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

    // Alias getters for DTO compatibility
    public String getReference() {
        return referenceNumber;
    }

    public void setReference(String reference) {
        this.referenceNumber = reference;
    }

    public LocalDate getChallanDate() {
        return deliveryChallanDate;
    }

    public void setChallanDate(LocalDate challanDate) {
        this.deliveryChallanDate = challanDate;
    }

    public String getTermsAndConditions() {
        return termsConditions;
    }

    public void setTermsAndConditions(String termsAndConditions) {
        this.termsConditions = termsAndConditions;
    }

    public List<LineItem> getLineItems() {
        return items;
    }

    public void setLineItems(List<LineItem> lineItems) {
        this.items = lineItems;
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

    public String getAttachmentUrl() {
        return attachmentUrl;
    }

    public void setAttachmentUrl(String attachmentUrl) {
        this.attachmentUrl = attachmentUrl;
    }
}
