package com.erp.dto;

import java.math.BigDecimal;

public class LineItemDTO {
    private Long id;
    private Long itemId;
    private String itemName;
    private String itemDescription;
    private String unit;
    private BigDecimal quantity;
    private BigDecimal rate;
    private BigDecimal discountPercent;
    private BigDecimal discountAmount;
    private BigDecimal amount;
    private BigDecimal taxPercent;
    private BigDecimal taxAmount;

    // Constructors
    public LineItemDTO() {
    }

    public LineItemDTO(Long itemId, String itemName, BigDecimal quantity, BigDecimal rate) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.quantity = quantity;
        this.rate = rate;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getItemDescription() {
        return itemDescription;
    }

    public void setItemDescription(String itemDescription) {
        this.itemDescription = itemDescription;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getRate() {
        return rate;
    }

    public void setRate(BigDecimal rate) {
        this.rate = rate;
    }

    public BigDecimal getDiscountPercent() {
        return discountPercent;
    }

    public void setDiscountPercent(BigDecimal discountPercent) {
        this.discountPercent = discountPercent;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getTaxPercent() {
        return taxPercent;
    }

    public void setTaxPercent(BigDecimal taxPercent) {
        this.taxPercent = taxPercent;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final LineItemDTO dto = new LineItemDTO();

        public Builder id(Long id) {
            dto.id = id;
            return this;
        }

        public Builder itemId(Long itemId) {
            dto.itemId = itemId;
            return this;
        }

        public Builder itemName(String itemName) {
            dto.itemName = itemName;
            return this;
        }

        public Builder itemDescription(String itemDescription) {
            dto.itemDescription = itemDescription;
            return this;
        }

        public Builder unit(String unit) {
            dto.unit = unit;
            return this;
        }

        public Builder quantity(BigDecimal quantity) {
            dto.quantity = quantity;
            return this;
        }

        public Builder rate(BigDecimal rate) {
            dto.rate = rate;
            return this;
        }

        public Builder discountPercent(BigDecimal discountPercent) {
            dto.discountPercent = discountPercent;
            return this;
        }

        public Builder discountAmount(BigDecimal discountAmount) {
            dto.discountAmount = discountAmount;
            return this;
        }

        public Builder amount(BigDecimal amount) {
            dto.amount = amount;
            return this;
        }

        public Builder taxPercent(BigDecimal taxPercent) {
            dto.taxPercent = taxPercent;
            return this;
        }

        public Builder taxAmount(BigDecimal taxAmount) {
            dto.taxAmount = taxAmount;
            return this;
        }

        public LineItemDTO build() {
            return dto;
        }
    }
}
