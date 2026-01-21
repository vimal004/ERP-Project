package com.erp.service;

import com.erp.dto.ItemRequest;
import com.erp.dto.ItemResponse;
import com.erp.entity.Item;
import com.erp.entity.ItemType;
import com.erp.exception.ResourceNotFoundException;
import com.erp.repository.ItemRepository;
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

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for Item operations
 */
@Service
@SuppressWarnings("null")
public class ItemService {

    private static final Logger log = LoggerFactory.getLogger(ItemService.class);

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    /**
     * Get all active items with pagination
     */
    public Page<ItemResponse> getAllItems(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return itemRepository.findByActiveTrue(pageable)
                .map(ItemResponse::fromEntity);
    }

    /**
     * Get all active items as a list (without pagination)
     */
    public List<ItemResponse> getAllItemsList() {
        return itemRepository.findByActiveTrue().stream()
                .map(ItemResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get item by ID
     */
    public ItemResponse getItemById(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        return ItemResponse.fromEntity(item);
    }

    /**
     * Get item by SKU
     */
    public ItemResponse getItemBySku(String sku) {
        Item item = itemRepository.findBySku(sku)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with SKU: " + sku));
        return ItemResponse.fromEntity(item);
    }

    /**
     * Search items by name with pagination
     */
    public Page<ItemResponse> searchItems(String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return itemRepository.searchByNameOrSku(searchTerm, pageable)
                .map(ItemResponse::fromEntity);
    }

    /**
     * Get items by type with pagination
     */
    public Page<ItemResponse> getItemsByType(ItemType type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return itemRepository.findByTypeAndActiveTrue(type, pageable)
                .map(ItemResponse::fromEntity);
    }

    /**
     * Get sellable items
     */
    public List<ItemResponse> getSellableItems() {
        return itemRepository.findBySellableTrueAndActiveTrue().stream()
                .map(ItemResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get purchasable items
     */
    public List<ItemResponse> getPurchasableItems() {
        return itemRepository.findByPurchasableTrueAndActiveTrue().stream()
                .map(ItemResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get low stock items
     */
    public List<ItemResponse> getLowStockItems() {
        return itemRepository.findLowStockItems().stream()
                .map(ItemResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Create a new item
     */
    @Transactional
    public ItemResponse createItem(ItemRequest request) {
        // Validate SKU uniqueness if provided
        if (request.getSku() != null && !request.getSku().isEmpty()) {
            if (itemRepository.existsBySku(request.getSku())) {
                throw new IllegalArgumentException("An item with SKU '" + request.getSku() + "' already exists");
            }
        }

        Item item = mapRequestToEntity(request, new Item());
        item.setCreatedBy(getCurrentUsername());
        item.setUpdatedBy(getCurrentUsername());

        Item savedItem = itemRepository.save(item);
        log.info("Created new item: {} (ID: {})", savedItem.getName(), savedItem.getId());

        return ItemResponse.fromEntity(savedItem);
    }

    /**
     * Update an existing item
     */
    @Transactional
    public ItemResponse updateItem(Long id, ItemRequest request) {
        Item existingItem = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        // Validate SKU uniqueness if changed
        if (request.getSku() != null && !request.getSku().isEmpty()) {
            if (itemRepository.existsBySkuAndIdNot(request.getSku(), id)) {
                throw new IllegalArgumentException("An item with SKU '" + request.getSku() + "' already exists");
            }
        }

        Item updatedItem = mapRequestToEntity(request, existingItem);
        updatedItem.setUpdatedBy(getCurrentUsername());

        Item savedItem = itemRepository.save(updatedItem);
        log.info("Updated item: {} (ID: {})", savedItem.getName(), savedItem.getId());

        return ItemResponse.fromEntity(savedItem);
    }

    /**
     * Soft delete an item (set active to false)
     */
    @Transactional
    public void deleteItem(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        item.setActive(false);
        item.setUpdatedBy(getCurrentUsername());
        itemRepository.save(item);
        log.info("Soft deleted item: {} (ID: {})", item.getName(), item.getId());
    }

    /**
     * Hard delete an item (permanently remove)
     */
    @Transactional
    public void permanentlyDeleteItem(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        itemRepository.delete(item);
        log.info("Permanently deleted item: {} (ID: {})", item.getName(), id);
    }

    /**
     * Restore a soft-deleted item
     */
    @Transactional
    public ItemResponse restoreItem(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        item.setActive(true);
        item.setUpdatedBy(getCurrentUsername());
        Item savedItem = itemRepository.save(item);
        log.info("Restored item: {} (ID: {})", item.getName(), id);

        return ItemResponse.fromEntity(savedItem);
    }

    /**
     * Get item statistics
     */
    public ItemStatistics getItemStatistics() {
        long totalItems = itemRepository.countByActiveTrue();
        long goodsCount = itemRepository.countByTypeAndActiveTrue(ItemType.GOODS);
        long servicesCount = itemRepository.countByTypeAndActiveTrue(ItemType.SERVICE);
        long lowStockCount = itemRepository.findLowStockItems().size();

        return new ItemStatistics(totalItems, goodsCount, servicesCount, lowStockCount);
    }

    /**
     * Map ItemRequest to Item entity
     */
    private Item mapRequestToEntity(ItemRequest request, Item item) {
        item.setName(request.getName());
        item.setType(request.getType());
        item.setUnit(request.getUnit());

        // Sales info
        item.setSellable(request.getSellable() != null ? request.getSellable() : true);
        item.setSellingPrice(request.getSellingPrice());
        item.setSalesAccount(request.getSalesAccount());
        item.setSalesDescription(request.getSalesDescription());

        // Purchase info
        item.setPurchasable(request.getPurchasable() != null ? request.getPurchasable() : true);
        item.setCostPrice(request.getCostPrice());
        item.setPurchaseAccount(request.getPurchaseAccount());
        item.setPurchaseDescription(request.getPurchaseDescription());
        item.setPreferredVendor(request.getPreferredVendor());

        // Stock info
        item.setStockQuantity(request.getStockQuantity());
        item.setReorderLevel(request.getReorderLevel());

        // SKU/Barcode
        item.setSku(request.getSku());
        item.setBarcode(request.getBarcode());

        // Tax info
        item.setTaxRate(request.getTaxRate());
        item.setHsnCode(request.getHsnCode());

        return item;
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
     * Record class for item statistics
     */
    public record ItemStatistics(
            long totalItems,
            long goodsCount,
            long servicesCount,
            long lowStockCount) {
    }
}
