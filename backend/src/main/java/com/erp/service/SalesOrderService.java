package com.erp.service;

import com.erp.dto.SalesOrderRequest;
import com.erp.dto.SalesOrderResponse;
import com.erp.dto.LineItemDTO;
import com.erp.entity.SalesOrder;
import com.erp.entity.LineItem;
import com.erp.entity.DocumentStatus;
import com.erp.repository.SalesOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@SuppressWarnings("null")
public class SalesOrderService {

    @Autowired
    private SalesOrderRepository salesOrderRepository;

    @Transactional
    public SalesOrderResponse create(SalesOrderRequest request) {
        SalesOrder order = new SalesOrder();
        order.setSalesOrderNumber(generateOrderNumber());
        mapRequestToEntity(request, order);
        order.setStatus(DocumentStatus.DRAFT);
        order.setCreatedBy(getCurrentUsername());
        SalesOrder saved = salesOrderRepository.save(order);
        return SalesOrderResponse.fromEntity(saved);
    }

    @Transactional
    public SalesOrderResponse update(Long id, SalesOrderRequest request) {
        SalesOrder order = salesOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sales Order not found"));
        mapRequestToEntity(request, order);
        order.setUpdatedBy(getCurrentUsername());
        SalesOrder saved = salesOrderRepository.save(order);
        return SalesOrderResponse.fromEntity(saved);
    }

    public SalesOrderResponse findById(Long id) {
        return salesOrderRepository.findById(id)
                .map(SalesOrderResponse::fromEntity)
                .orElseThrow(() -> new RuntimeException("Sales Order not found"));
    }

    public Page<SalesOrderResponse> findAll(Pageable pageable) {
        return salesOrderRepository.findByActiveTrue(pageable).map(SalesOrderResponse::fromEntity);
    }

    public Page<SalesOrderResponse> search(String term, Pageable pageable) {
        return salesOrderRepository.search(term, pageable).map(SalesOrderResponse::fromEntity);
    }

    @Transactional
    public void softDelete(Long id) {
        SalesOrder order = salesOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sales Order not found"));
        order.setActive(false);
        order.setUpdatedBy(getCurrentUsername());
        salesOrderRepository.save(order);
    }

    @Transactional
    public SalesOrderResponse updateStatus(Long id, DocumentStatus status) {
        SalesOrder order = salesOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sales Order not found"));
        order.setStatus(status);
        order.setUpdatedBy(getCurrentUsername());
        return SalesOrderResponse.fromEntity(salesOrderRepository.save(order));
    }

    private void mapRequestToEntity(SalesOrderRequest request, SalesOrder order) {
        order.setCustomerId(request.getCustomerId());
        order.setCustomerName(request.getCustomerName());
        order.setQuoteId(request.getQuoteId());
        order.setReference(request.getReference());
        order.setSalesOrderDate(request.getSalesOrderDate() != null ? request.getSalesOrderDate() : LocalDate.now());
        order.setExpectedShipmentDate(request.getExpectedShipmentDate());
        order.setPaymentTerms(request.getPaymentTerms());
        order.setDeliveryMethod(request.getDeliveryMethod());
        order.setSalesperson(request.getSalesperson());
        order.setShippingCharges(request.getShippingCharges());
        order.setAdjustment(request.getAdjustment());
        order.setCustomerNotes(request.getCustomerNotes());
        order.setTermsAndConditions(request.getTermsAndConditions());
        order.setAttachmentUrl(request.getAttachmentUrl());

        if (request.getLineItems() != null) {
            List<LineItem> items = new ArrayList<>();
            for (LineItemDTO dto : request.getLineItems()) {
                LineItem item = new LineItem();
                item.setItemId(dto.getItemId());
                item.setItemName(dto.getItemName());
                item.setQuantity(dto.getQuantity());
                item.setRate(dto.getRate());
                item.setDiscountPercent(dto.getDiscountPercent());
                item.setTaxPercent(dto.getTaxPercent());
                item.calculateAmount();
                items.add(item);
            }
            order.setLineItems(items);
        }
        order.calculateTotals();
    }

    private String generateOrderNumber() {
        Integer max = salesOrderRepository.findMaxSalesOrderNumber();
        int next = (max != null ? max : 0) + 1;
        return String.format("SO-%05d", next);
    }

    private String getCurrentUsername() {
        try {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        } catch (Exception e) {
            return "system";
        }
    }

    public record SalesOrderStatistics(long total, long draft, long confirmed, long shipped) {
    }

    public SalesOrderStatistics getStatistics() {
        return new SalesOrderStatistics(
                salesOrderRepository.countByActiveTrue(),
                salesOrderRepository.countByStatusAndActiveTrue(DocumentStatus.DRAFT),
                salesOrderRepository.countByStatusAndActiveTrue(DocumentStatus.CONFIRMED),
                salesOrderRepository.countByStatusAndActiveTrue(DocumentStatus.SHIPPED));
    }
}
