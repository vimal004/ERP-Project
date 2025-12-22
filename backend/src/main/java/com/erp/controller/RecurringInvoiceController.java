package com.erp.controller;

import com.erp.dto.RecurringInvoiceRequest;
import com.erp.dto.RecurringInvoiceResponse;
import com.erp.service.RecurringInvoiceService;
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
@RequestMapping("/api/recurring-invoices")
@CrossOrigin(origins = "*")
public class RecurringInvoiceController {
    private static final Logger logger = LoggerFactory.getLogger(RecurringInvoiceController.class);

    @Autowired
    private RecurringInvoiceService recurringInvoiceService;

    @PostMapping
    public ResponseEntity<RecurringInvoiceResponse> create(@Valid @RequestBody RecurringInvoiceRequest request) {
        logger.info("Creating new recurring invoice for customer: {}", request.getCustomerId());
        return ResponseEntity.ok(recurringInvoiceService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecurringInvoiceResponse> update(@PathVariable Long id,
            @Valid @RequestBody RecurringInvoiceRequest request) {
        logger.info("Updating recurring invoice: {}", id);
        return ResponseEntity.ok(recurringInvoiceService.update(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecurringInvoiceResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(recurringInvoiceService.findById(id));
    }

    @GetMapping
    public ResponseEntity<Page<RecurringInvoiceResponse>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(recurringInvoiceService.findAll(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<RecurringInvoiceResponse>> search(
            @RequestParam String term,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(recurringInvoiceService.search(term, pageable));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        logger.info("Deleting recurring invoice: {}", id);
        recurringInvoiceService.softDelete(id);
        return ResponseEntity.ok(Map.of("message", "Recurring Invoice deleted successfully"));
    }

    @PostMapping("/{id}/pause")
    public ResponseEntity<RecurringInvoiceResponse> pause(@PathVariable Long id) {
        logger.info("Pausing recurring invoice: {}", id);
        return ResponseEntity.ok(recurringInvoiceService.pause(id));
    }

    @PostMapping("/{id}/resume")
    public ResponseEntity<RecurringInvoiceResponse> resume(@PathVariable Long id) {
        logger.info("Resuming recurring invoice: {}", id);
        return ResponseEntity.ok(recurringInvoiceService.resume(id));
    }

    @GetMapping("/statistics")
    public ResponseEntity<RecurringInvoiceService.RecurringInvoiceStatistics> getStatistics() {
        return ResponseEntity.ok(recurringInvoiceService.getStatistics());
    }
}
