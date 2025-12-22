package com.erp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Invoice entity representing sales invoices
 */
@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_number", unique = true, nullable = false)
    private String invoiceNumber;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "order_number")
    private String orderNumber;

    @Column(name = "sales_order_id")
    private Long salesOrderId;

    @Column(name = "invoice_date", nullable = false)
    private LocalDate invoiceDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "payment_terms")
    private String paymentTerms;

    @Column(name = "salesperson")
    private String salesperson;

    @Column(name = "subject", length = 1000)
    private String subject;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "invoice_id")
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

    @Column(name = "total", precision = 19, scale = 4)
    private BigDecimal total;

    @Column(name = "amount_paid", precision = 19, scale = 4)
    private BigDecimal amountPaid;

    @Column(name = "balance_due", precision = 19, scale = 4)
    private BigDecimal balanceDue;

    @Column(name = "currency")
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private DocumentStatus status = DocumentStatus.DRAFT;

    @Column(name = "customer_notes", length = 2000)
    private String customerNotes;

    @Column(name = "terms_conditions", length = 2000)
    private String termsConditions;

    @Column(name = "reference_number")
    private String referenceNumber;

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
    public Invoice() {
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
        BigDecimal tax = taxTotal != null ? taxTotal : BigDecimal.ZERO;
        BigDecimal disc = discountTotal != null ? discountTotal : BigDecimal.ZERO;
        this.total = this.subTotal.add(tax).add(adj).subtract(disc);

        BigDecimal paid = amountPaid != null ? amountPaid : BigDecimal.ZERO;
        this.balanceDue = this.total.subtract(paid);
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

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public Long getSalesOrderId() {
        return salesOrderId;
    }

    public void setSalesOrderId(Long salesOrderId) {
        this.salesOrderId = salesOrderId;
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
