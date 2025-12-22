package com.erp.controller;

import com.erp.dto.InvoiceRequest;
import com.erp.dto.InvoiceResponse;
import com.erp.service.InvoiceService;
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

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class InvoiceController {
    private static final Logger logger = LoggerFactory.getLogger(InvoiceController.class);

    @Autowired
    private InvoiceService invoiceService;

    @PostMapping
    public ResponseEntity<InvoiceResponse> create(@Valid @RequestBody InvoiceRequest request) {
        logger.info("Creating new invoice for customer: {}", request.getCustomerId());
        return ResponseEntity.ok(invoiceService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvoiceResponse> update(@PathVariable Long id, @Valid @RequestBody InvoiceRequest request) {
        logger.info("Updating invoice: {}", id);
        return ResponseEntity.ok(invoiceService.update(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.findById(id));
    }

    @GetMapping
    public ResponseEntity<Page<InvoiceResponse>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(invoiceService.findAll(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<InvoiceResponse>> search(
            @RequestParam String term,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(invoiceService.search(term, pageable));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        logger.info("Deleting invoice: {}", id);
        invoiceService.softDelete(id);
        return ResponseEntity.ok(Map.of("message", "Invoice deleted successfully"));
    }

    @PostMapping("/{id}/payment")
    public ResponseEntity<InvoiceResponse> recordPayment(@PathVariable Long id, @RequestParam BigDecimal amount) {
        logger.info("Recording payment of {} for invoice: {}", amount, id);
        return ResponseEntity.ok(invoiceService.recordPayment(id, amount));
    }

    @GetMapping("/statistics")
    public ResponseEntity<InvoiceService.InvoiceStatistics> getStatistics() {
        return ResponseEntity.ok(invoiceService.getStatistics());
    }
}
