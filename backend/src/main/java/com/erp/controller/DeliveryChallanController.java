package com.erp.controller;

import com.erp.dto.DeliveryChallanRequest;
import com.erp.dto.DeliveryChallanResponse;
import com.erp.entity.DocumentStatus;
import com.erp.service.DeliveryChallanService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/delivery-challans")
@CrossOrigin(origins = "*")
public class DeliveryChallanController {
    private static final Logger logger = LoggerFactory.getLogger(DeliveryChallanController.class);

    @Autowired
    private DeliveryChallanService deliveryChallanService;

    @PostMapping
    public ResponseEntity<DeliveryChallanResponse> create(@Valid @RequestBody DeliveryChallanRequest request) {
        logger.info("Creating new delivery challan for customer: {}", request.getCustomerId());
        return ResponseEntity.ok(deliveryChallanService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeliveryChallanResponse> update(@PathVariable Long id,
            @Valid @RequestBody DeliveryChallanRequest request) {
        logger.info("Updating delivery challan: {}", id);
        return ResponseEntity.ok(deliveryChallanService.update(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryChallanResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(deliveryChallanService.findById(id));
    }

    @GetMapping
    public ResponseEntity<Page<DeliveryChallanResponse>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(deliveryChallanService.findAll(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<DeliveryChallanResponse>> search(
            @RequestParam String term,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(deliveryChallanService.search(term, pageable));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        logger.info("Deleting delivery challan: {}", id);
        deliveryChallanService.softDelete(id);
        return ResponseEntity.ok(Map.of("message", "Delivery Challan deleted successfully"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<DeliveryChallanResponse> updateStatus(@PathVariable Long id, @RequestParam String status) {
        logger.info("Updating delivery challan {} status to: {}", id, status);
        return ResponseEntity.ok(deliveryChallanService.updateStatus(id, DocumentStatus.valueOf(status)));
    }

    @GetMapping("/statistics")
    public ResponseEntity<DeliveryChallanService.DeliveryChallanStatistics> getStatistics() {
        return ResponseEntity.ok(deliveryChallanService.getStatistics());
    }
}
