package com.erp.service;

import com.erp.dto.CustomerRequest;
import com.erp.dto.CustomerResponse;
import com.erp.entity.Customer;
import com.erp.entity.CustomerType;
import com.erp.exception.ResourceNotFoundException;
import com.erp.repository.CustomerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for Customer operations
 */
@Service
@SuppressWarnings("null")
public class CustomerService {

    private static final Logger log = LoggerFactory.getLogger(CustomerService.class);

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    /**
     * Get all active customers with pagination
     */
    public Page<CustomerResponse> getAllCustomers(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return customerRepository.findByActiveTrue(pageable)
                .map(CustomerResponse::fromEntity);
    }

    /**
     * Get all active customers as a list (without pagination)
     */
    public List<CustomerResponse> getAllCustomersList() {
        return customerRepository.findByActiveTrue().stream()
                .map(CustomerResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get customer by ID
     */
    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        return CustomerResponse.fromEntity(customer);
    }

    /**
     * Search customers by name or email with pagination
     */
    public Page<CustomerResponse> searchCustomers(String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("displayName").ascending());
        return customerRepository.searchByNameOrEmail(searchTerm, pageable)
                .map(CustomerResponse::fromEntity);
    }

    /**
     * Get customers by type with pagination
     */
    public Page<CustomerResponse> getCustomersByType(CustomerType type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("displayName").ascending());
        return customerRepository.findByCustomerTypeAndActiveTrue(type, pageable)
                .map(CustomerResponse::fromEntity);
    }

    /**
     * Get customers with outstanding balance
     */
    public List<CustomerResponse> getCustomersWithOutstandingBalance() {
        return customerRepository.findCustomersWithOutstandingBalance().stream()
                .map(CustomerResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Create a new customer
     */
    @Transactional
    public CustomerResponse createCustomer(CustomerRequest request) {
        // Validate display name uniqueness (check only active customers)
        if (customerRepository.existsByDisplayNameAndActiveTrue(request.getDisplayName())) {
            throw new IllegalArgumentException(
                    "An active customer with display name '" + request.getDisplayName() + "' already exists");
        }

        Customer customer = mapRequestToEntity(request, new Customer());
        customer.setCreatedBy(getCurrentUsername());
        customer.setUpdatedBy(getCurrentUsername());
        customer.setActive(true);
        customer.setStatus("ACTIVE");

        Customer savedCustomer = customerRepository.save(customer);
        log.info("Created new customer: {} (ID: {})", savedCustomer.getDisplayName(), savedCustomer.getId());

        return CustomerResponse.fromEntity(savedCustomer);
    }

    /**
     * Update an existing customer
     */
    @Transactional
    public CustomerResponse updateCustomer(Long id, CustomerRequest request) {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        // Validate display name uniqueness if changed (check only active customers)
        if (request.getDisplayName() != null && !request.getDisplayName().isEmpty()) {
            if (customerRepository.existsByDisplayNameAndIdNotAndActiveTrue(request.getDisplayName(), id)) {
                throw new IllegalArgumentException(
                        "An active customer with display name '" + request.getDisplayName() + "' already exists");
            }
        }

        Customer updatedCustomer = mapRequestToEntity(request, existingCustomer);
        updatedCustomer.setUpdatedBy(getCurrentUsername());
        updatedCustomer.setLastContactAt(LocalDateTime.now());

        Customer savedCustomer = customerRepository.save(updatedCustomer);
        log.info("Updated customer: {} (ID: {})", savedCustomer.getDisplayName(), savedCustomer.getId());

        return CustomerResponse.fromEntity(savedCustomer);
    }

    /**
     * Soft delete a customer (set active to false)
     */
    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        customer.setActive(false);
        customer.setStatus("INACTIVE");
        customer.setUpdatedBy(getCurrentUsername());
        customerRepository.save(customer);
        log.info("Soft deleted customer: {} (ID: {})", customer.getDisplayName(), customer.getId());
    }

    /**
     * Hard delete a customer (permanently remove)
     */
    @Transactional
    public void permanentlyDeleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        customerRepository.delete(customer);
        log.info("Permanently deleted customer: {} (ID: {})", customer.getDisplayName(), id);
    }

    /**
     * Restore a soft-deleted customer
     */
    @Transactional
    public CustomerResponse restoreCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        customer.setActive(true);
        customer.setStatus("ACTIVE");
        customer.setUpdatedBy(getCurrentUsername());
        Customer savedCustomer = customerRepository.save(customer);
        log.info("Restored customer: {} (ID: {})", customer.getDisplayName(), id);

        return CustomerResponse.fromEntity(savedCustomer);
    }

    /**
     * Get customer statistics
     */
    public CustomerStatistics getCustomerStatistics() {
        long totalCustomers = customerRepository.countByActiveTrue();
        long businessCount = customerRepository.countByCustomerTypeAndActiveTrue(CustomerType.BUSINESS);
        long individualCount = customerRepository.countByCustomerTypeAndActiveTrue(CustomerType.INDIVIDUAL);
        long withOutstandingBalance = customerRepository.findCustomersWithOutstandingBalance().size();

        return new CustomerStatistics(totalCustomers, businessCount, individualCount, withOutstandingBalance);
    }

    /**
     * Map CustomerRequest to Customer entity
     */
    private Customer mapRequestToEntity(CustomerRequest request, Customer customer) {
        customer.setCustomerType(request.getCustomerType());
        customer.setSalutation(request.getSalutation());
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setCompanyName(request.getCompanyName());
        customer.setDisplayName(request.getDisplayName());
        customer.setEmail(request.getEmail());
        customer.setWorkPhone(request.getWorkPhone());
        customer.setMobilePhone(request.getMobilePhone());
        customer.setLanguage(request.getLanguage());

        // Other details
        customer.setPan(request.getPan());
        customer.setCurrency(request.getCurrency() != null ? request.getCurrency() : "INR");
        customer.setOpeningBalance(request.getOpeningBalance() != null ? request.getOpeningBalance() : BigDecimal.ZERO);
        customer.setPaymentTerms(request.getPaymentTerms());
        customer.setEnablePortal(request.getEnablePortal() != null ? request.getEnablePortal() : false);

        // Billing address
        customer.setBillingAttention(request.getBillingAttention());
        customer.setBillingCountry(request.getBillingCountry());
        customer.setBillingAddress1(request.getBillingAddress1());
        customer.setBillingAddress2(request.getBillingAddress2());
        customer.setBillingCity(request.getBillingCity());
        customer.setBillingState(request.getBillingState());
        customer.setBillingPinCode(request.getBillingPinCode());
        customer.setBillingPhone(request.getBillingPhone());
        customer.setBillingFax(request.getBillingFax());

        // Shipping address
        customer.setShippingAttention(request.getShippingAttention());
        customer.setShippingCountry(request.getShippingCountry());
        customer.setShippingAddress1(request.getShippingAddress1());
        customer.setShippingAddress2(request.getShippingAddress2());
        customer.setShippingCity(request.getShippingCity());
        customer.setShippingState(request.getShippingState());
        customer.setShippingPinCode(request.getShippingPinCode());
        customer.setShippingPhone(request.getShippingPhone());
        customer.setShippingFax(request.getShippingFax());

        // Remarks
        customer.setRemarks(request.getRemarks());

        return customer;
    }

    /**
     * Get current authenticated username
     */
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return "system";
    }

    /**
     * Record class for customer statistics
     */
    public record CustomerStatistics(
            long totalCustomers,
            long businessCount,
            long individualCount,
            long withOutstandingBalance) {
    }
}
