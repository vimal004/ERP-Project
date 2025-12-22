package com.erp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * RecurringInvoice entity for automated recurring billing
 */
@Entity
@Table(name = "recurring_invoices")
public class RecurringInvoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "profile_name", nullable = false)
    private String profileName;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "order_number")
    private String orderNumber;

    @Column(name = "repeat_every")
    private Integer repeatEvery;

    @Column(name = "repeat_unit")
    private String repeatUnit; // Week, Month, Year

    @Column(name = "start_on")
    private LocalDate startOn;

    @Column(name = "ends_on")
    private LocalDate endsOn;

    @Column(name = "never_expires")
    private boolean neverExpires = true;

    @Column(name = "payment_terms")
    private String paymentTerms;

    @Column(name = "salesperson")
    private String salesperson;

    @Column(name = "subject", length = 1000)
    private String subject;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "recurring_invoice_id")
    private List<LineItem> items = new ArrayList<>();

    @Column(name = "sub_total", precision = 19, scale = 4)
    private BigDecimal subTotal;

    @Column(name = "discount_total", precision = 19, scale = 4)
    private BigDecimal discountTotal;

    @Column(name = "tax_total", precision = 19, scale = 4)
    private BigDecimal taxTotal;

    @Column(name = "adjustment_label")
    private String adjustmentLabel;

    @Column(name = "adjustment_amount", precision = 19, scale = 4)
    private BigDecimal adjustmentAmount;

    @Column(name = "round_off", precision = 19, scale = 4)
    private BigDecimal roundOff;

    @Column(name = "total", precision = 19, scale = 4)
    private BigDecimal total;

    @Column(name = "currency")
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private DocumentStatus status = DocumentStatus.ACTIVE;

    @Column(name = "next_invoice_date")
    private LocalDate nextInvoiceDate;

    @Column(name = "last_invoice_date")
    private LocalDate lastInvoiceDate;

    @Column(name = "customer_notes", length = 2000)
    private String customerNotes;

    @Column(name = "terms_conditions", length = 2000)
    private String termsConditions;

    @Column(name = "shipping_charges", precision = 19, scale = 4)
    private java.math.BigDecimal shippingCharges = java.math.BigDecimal.ZERO;

    @Column(name = "adjustment", precision = 19, scale = 4)
    private java.math.BigDecimal adjustment = java.math.BigDecimal.ZERO;

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
    public RecurringInvoice() {
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        calculateTotals();
        if (nextInvoiceDate == null) {
            nextInvoiceDate = startOn;
        }
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
        BigDecimal tax = taxTotal != null ? taxTotal : BigDecimal.ZERO;
        BigDecimal disc = discountTotal != null ? discountTotal : BigDecimal.ZERO;
        BigDecimal round = roundOff != null ? roundOff : BigDecimal.ZERO;
        this.total = this.subTotal.add(tax).add(adj).add(round).subtract(disc);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProfileName() {
        return profileName;
    }

    public void setProfileName(String profileName) {
        this.profileName = profileName;
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

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
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

    public boolean isNeverExpires() {
        return neverExpires;
    }

    public void setNeverExpires(boolean neverExpires) {
        this.neverExpires = neverExpires;
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

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
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

    public BigDecimal getDiscountTotal() {
        return discountTotal;
    }

    public void setDiscountTotal(BigDecimal discountTotal) {
        this.discountTotal = discountTotal;
    }

    public BigDecimal getTaxTotal() {
        return taxTotal;
    }

    public void setTaxTotal(BigDecimal taxTotal) {
        this.taxTotal = taxTotal;
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

    public BigDecimal getRoundOff() {
        return roundOff;
    }

    public void setRoundOff(BigDecimal roundOff) {
        this.roundOff = roundOff;
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

    public LocalDate getNextInvoiceDate() {
        return nextInvoiceDate;
    }

    public void setNextInvoiceDate(LocalDate nextInvoiceDate) {
        this.nextInvoiceDate = nextInvoiceDate;
    }

    public LocalDate getLastInvoiceDate() {
        return lastInvoiceDate;
    }

    public void setLastInvoiceDate(LocalDate lastInvoiceDate) {
        this.lastInvoiceDate = lastInvoiceDate;
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

    public java.math.BigDecimal getShippingCharges() {
        return shippingCharges;
    }

    public void setShippingCharges(java.math.BigDecimal shippingCharges) {
        this.shippingCharges = shippingCharges;
    }

    public java.math.BigDecimal getAdjustment() {
        return adjustment;
    }

    public void setAdjustment(java.math.BigDecimal adjustment) {
        this.adjustment = adjustment;
    }

    public String getAttachmentUrl() {
        return attachmentUrl;
    }

    public void setAttachmentUrl(String attachmentUrl) {
        this.attachmentUrl = attachmentUrl;
    }
}
