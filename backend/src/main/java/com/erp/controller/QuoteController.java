package com.erp.controller;

import com.erp.dto.QuoteRequest;
import com.erp.dto.QuoteResponse;
import com.erp.entity.DocumentStatus;
import com.erp.service.QuoteService;
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
@RequestMapping("/api/quotes")
@CrossOrigin(origins = "*")
public class QuoteController {
    private static final Logger logger = LoggerFactory.getLogger(QuoteController.class);

    @Autowired
    private QuoteService quoteService;

    @PostMapping
    public ResponseEntity<QuoteResponse> create(@Valid @RequestBody QuoteRequest request) {
        logger.info("Creating new quote for customer: {}", request.getCustomerId());
        return ResponseEntity.ok(quoteService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuoteResponse> update(@PathVariable Long id, @Valid @RequestBody QuoteRequest request) {
        logger.info("Updating quote: {}", id);
        return ResponseEntity.ok(quoteService.update(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuoteResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(quoteService.findById(id));
    }

    @GetMapping
    public ResponseEntity<Page<QuoteResponse>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(quoteService.findAll(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<QuoteResponse>> search(
            @RequestParam String term,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(quoteService.search(term, pageable));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        logger.info("Deleting quote: {}", id);
        quoteService.softDelete(id);
        return ResponseEntity.ok(Map.of("message", "Quote deleted successfully"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<QuoteResponse> updateStatus(@PathVariable Long id, @RequestParam String status) {
        logger.info("Updating quote {} status to: {}", id, status);
        return ResponseEntity.ok(quoteService.updateStatus(id, DocumentStatus.valueOf(status)));
    }

    @GetMapping("/statistics")
    public ResponseEntity<QuoteService.QuoteStatistics> getStatistics() {
        return ResponseEntity.ok(quoteService.getStatistics());
    }
}
