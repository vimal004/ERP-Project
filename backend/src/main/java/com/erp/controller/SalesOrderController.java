package com.erp.controller;

import com.erp.dto.SalesOrderRequest;
import com.erp.dto.SalesOrderResponse;
import com.erp.entity.DocumentStatus;
import com.erp.service.SalesOrderService;
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
@RequestMapping("/api/sales-orders")
@CrossOrigin(origins = "*")
public class SalesOrderController {
    private static final Logger logger = LoggerFactory.getLogger(SalesOrderController.class);

    @Autowired
    private SalesOrderService salesOrderService;

    @PostMapping
    public ResponseEntity<SalesOrderResponse> create(@Valid @RequestBody SalesOrderRequest request) {
        logger.info("Creating new sales order for customer: {}", request.getCustomerId());
        return ResponseEntity.ok(salesOrderService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalesOrderResponse> update(@PathVariable Long id,
            @Valid @RequestBody SalesOrderRequest request) {
        logger.info("Updating sales order: {}", id);
        return ResponseEntity.ok(salesOrderService.update(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalesOrderResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(salesOrderService.findById(id));
    }

    @GetMapping
    public ResponseEntity<Page<SalesOrderResponse>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(salesOrderService.findAll(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<SalesOrderResponse>> search(
            @RequestParam String term,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(salesOrderService.search(term, pageable));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        logger.info("Deleting sales order: {}", id);
        salesOrderService.softDelete(id);
        return ResponseEntity.ok(Map.of("message", "Sales Order deleted successfully"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SalesOrderResponse> updateStatus(@PathVariable Long id, @RequestParam String status) {
        logger.info("Updating sales order {} status to: {}", id, status);
        return ResponseEntity.ok(salesOrderService.updateStatus(id, DocumentStatus.valueOf(status)));
    }

    @GetMapping("/statistics")
    public ResponseEntity<SalesOrderService.SalesOrderStatistics> getStatistics() {
        return ResponseEntity.ok(salesOrderService.getStatistics());
    }
}
