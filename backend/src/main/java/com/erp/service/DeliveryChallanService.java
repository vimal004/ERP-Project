package com.erp.service;

import com.erp.dto.DeliveryChallanRequest;
import com.erp.dto.DeliveryChallanResponse;
import com.erp.dto.LineItemDTO;
import com.erp.entity.DeliveryChallan;
import com.erp.entity.LineItem;
import com.erp.entity.DocumentStatus;
import com.erp.repository.DeliveryChallanRepository;
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
public class DeliveryChallanService {

    @Autowired
    private DeliveryChallanRepository deliveryChallanRepository;

    @Transactional
    public DeliveryChallanResponse create(DeliveryChallanRequest request) {
        DeliveryChallan challan = new DeliveryChallan();
        challan.setDeliveryChallanNumber(generateChallanNumber());
        mapRequestToEntity(request, challan);
        challan.setStatus(DocumentStatus.DRAFT);
        challan.setCreatedBy(getCurrentUsername());
        DeliveryChallan saved = deliveryChallanRepository.save(challan);
        return DeliveryChallanResponse.fromEntity(saved);
    }

    @Transactional
    public DeliveryChallanResponse update(Long id, DeliveryChallanRequest request) {
        DeliveryChallan challan = deliveryChallanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery Challan not found"));
        mapRequestToEntity(request, challan);
        challan.setUpdatedBy(getCurrentUsername());
        DeliveryChallan saved = deliveryChallanRepository.save(challan);
        return DeliveryChallanResponse.fromEntity(saved);
    }

    public DeliveryChallanResponse findById(Long id) {
        return deliveryChallanRepository.findById(id)
                .map(DeliveryChallanResponse::fromEntity)
                .orElseThrow(() -> new RuntimeException("Delivery Challan not found"));
    }

    public Page<DeliveryChallanResponse> findAll(Pageable pageable) {
        return deliveryChallanRepository.findByActiveTrue(pageable).map(DeliveryChallanResponse::fromEntity);
    }

    public Page<DeliveryChallanResponse> search(String term, Pageable pageable) {
        return deliveryChallanRepository.search(term, pageable).map(DeliveryChallanResponse::fromEntity);
    }

    @Transactional
    public void softDelete(Long id) {
        DeliveryChallan challan = deliveryChallanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery Challan not found"));
        challan.setActive(false);
        challan.setUpdatedBy(getCurrentUsername());
        deliveryChallanRepository.save(challan);
    }

    @Transactional
    public DeliveryChallanResponse updateStatus(Long id, DocumentStatus status) {
        DeliveryChallan challan = deliveryChallanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery Challan not found"));
        challan.setStatus(status);
        challan.setUpdatedBy(getCurrentUsername());
        return DeliveryChallanResponse.fromEntity(deliveryChallanRepository.save(challan));
    }

    private void mapRequestToEntity(DeliveryChallanRequest request, DeliveryChallan challan) {
        challan.setCustomerId(request.getCustomerId());
        challan.setCustomerName(request.getCustomerName());
        challan.setSalesOrderId(request.getSalesOrderId());
        challan.setChallanType(request.getChallanType());
        challan.setReference(request.getReference());
        challan.setChallanDate(request.getChallanDate() != null ? request.getChallanDate() : LocalDate.now());
        challan.setShippingCharges(request.getShippingCharges());
        challan.setAdjustment(request.getAdjustment());
        challan.setCustomerNotes(request.getCustomerNotes());
        challan.setTermsAndConditions(request.getTermsAndConditions());
        challan.setAttachmentUrl(request.getAttachmentUrl());

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
            challan.setLineItems(items);
        }
        challan.calculateTotals();
    }

    private String generateChallanNumber() {
        Integer max = deliveryChallanRepository.findMaxDeliveryChallanNumber();
        int next = (max != null ? max : 0) + 1;
        return String.format("DC-%05d", next);
    }

    private String getCurrentUsername() {
        try {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        } catch (Exception e) {
            return "system";
        }
    }

    public record DeliveryChallanStatistics(long total, long draft, long delivered) {
    }

    public DeliveryChallanStatistics getStatistics() {
        return new DeliveryChallanStatistics(
                deliveryChallanRepository.countByActiveTrue(),
                deliveryChallanRepository.countByStatusAndActiveTrue(DocumentStatus.DRAFT),
                deliveryChallanRepository.countByStatusAndActiveTrue(DocumentStatus.DELIVERED));
    }
}
