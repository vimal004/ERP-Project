package com.erp.config;

import com.erp.entity.Item;
import com.erp.entity.ItemType;
import com.erp.entity.Role;
import com.erp.entity.User;
import com.erp.repository.ItemRepository;
import com.erp.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

/**
 * Data initialization configuration for development/demo purposes
 * Creates default admin and user accounts on application startup
 */
@Configuration
@SuppressWarnings("null")
public class DataInitializer {

        private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

        private final PasswordEncoder passwordEncoder;

        public DataInitializer(PasswordEncoder passwordEncoder) {
                this.passwordEncoder = passwordEncoder;
        }

        /**
         * Initialize default users on application startup
         * Matches the mock users from the frontend:
         * - admin@company.com / admin123 (Admin)
         * - user@company.com / user123 (User)
         */
        @Bean
        public CommandLineRunner initializeData(UserRepository userRepository, ItemRepository itemRepository) {
                return args -> {
                        // Create Admin user if not exists
                        if (!userRepository.existsByEmail("admin@company.com")) {
                                User admin = User.builder()
                                                .name("System Administrator")
                                                .email("admin@company.com")
                                                .password(passwordEncoder.encode("admin123"))
                                                .role(Role.ADMIN)
                                                .isActive(true)
                                                .build();
                                userRepository.save(admin);
                                log.info("Created default admin user: admin@company.com");
                        }

                        // Create Staff/User if not exists
                        if (!userRepository.existsByEmail("user@company.com")) {
                                User user = User.builder()
                                                .name("Staff User")
                                                .email("user@company.com")
                                                .password(passwordEncoder.encode("user123"))
                                                .role(Role.USER)
                                                .isActive(true)
                                                .build();
                                userRepository.save(user);
                                log.info("Created default staff user: user@company.com");
                        }

                        log.info("User initialization complete. Total users: {}", userRepository.count());

                        // Initialize sample items if none exist
                        if (itemRepository.count() == 0) {
                                initializeSampleItems(itemRepository);
                        }

                        log.info("Data initialization complete. Total items: {}", itemRepository.count());
                };
        }

        /**
         * Initialize sample items for demo purposes
         */
        private void initializeSampleItems(ItemRepository itemRepository) {
                // Sample Goods
                Item laptop = Item.builder()
                                .name("Dell Laptop")
                                .type(ItemType.GOODS)
                                .unit("PCS")
                                .sellable(true)
                                .sellingPrice(new BigDecimal("75000.00"))
                                .salesAccount("Sales")
                                .salesDescription("Dell Inspiron 15 Laptop - High-performance laptop for business use")
                                .purchasable(true)
                                .costPrice(new BigDecimal("60000.00"))
                                .purchaseAccount("Cost of Goods Sold")
                                .purchaseDescription("Dell Inspiron 15 - Bulk purchase")
                                .preferredVendor("Dell Technologies")
                                .stockQuantity(new BigDecimal("50"))
                                .reorderLevel(new BigDecimal("10"))
                                .sku("DELL-LAP-001")
                                .barcode("8901234567890")
                                .taxRate(new BigDecimal("18.00"))
                                .hsnCode("84713010")
                                .active(true)
                                .createdBy("system")
                                .updatedBy("system")
                                .build();
                itemRepository.save(laptop);

                Item mouse = Item.builder()
                                .name("Wireless Mouse")
                                .type(ItemType.GOODS)
                                .unit("PCS")
                                .sellable(true)
                                .sellingPrice(new BigDecimal("1500.00"))
                                .salesAccount("Sales")
                                .salesDescription("Ergonomic wireless mouse with USB receiver")
                                .purchasable(true)
                                .costPrice(new BigDecimal("800.00"))
                                .purchaseAccount("Cost of Goods Sold")
                                .purchaseDescription("Logitech Wireless Mouse M170")
                                .preferredVendor("Logitech")
                                .stockQuantity(new BigDecimal("200"))
                                .reorderLevel(new BigDecimal("25"))
                                .sku("LOG-MOU-001")
                                .taxRate(new BigDecimal("18.00"))
                                .hsnCode("84716060")
                                .active(true)
                                .createdBy("system")
                                .updatedBy("system")
                                .build();
                itemRepository.save(mouse);

                Item keyboard = Item.builder()
                                .name("Mechanical Keyboard")
                                .type(ItemType.GOODS)
                                .unit("PCS")
                                .sellable(true)
                                .sellingPrice(new BigDecimal("3500.00"))
                                .salesAccount("Sales")
                                .salesDescription("RGB Mechanical Gaming Keyboard with Blue Switches")
                                .purchasable(true)
                                .costPrice(new BigDecimal("2200.00"))
                                .purchaseAccount("Cost of Goods Sold")
                                .purchaseDescription("Mechanical Keyboard - Cherry MX Blue")
                                .stockQuantity(new BigDecimal("75"))
                                .reorderLevel(new BigDecimal("15"))
                                .sku("KEY-MEC-001")
                                .taxRate(new BigDecimal("18.00"))
                                .hsnCode("84716060")
                                .active(true)
                                .createdBy("system")
                                .updatedBy("system")
                                .build();
                itemRepository.save(keyboard);

                Item monitor = Item.builder()
                                .name("27-inch LED Monitor")
                                .type(ItemType.GOODS)
                                .unit("PCS")
                                .sellable(true)
                                .sellingPrice(new BigDecimal("25000.00"))
                                .salesAccount("Sales")
                                .salesDescription("27-inch Full HD LED Monitor with HDMI and VGA ports")
                                .purchasable(true)
                                .costPrice(new BigDecimal("18000.00"))
                                .purchaseAccount("Cost of Goods Sold")
                                .purchaseDescription("Samsung 27-inch LED Monitor")
                                .preferredVendor("Samsung")
                                .stockQuantity(new BigDecimal("30"))
                                .reorderLevel(new BigDecimal("5"))
                                .sku("SAM-MON-027")
                                .taxRate(new BigDecimal("18.00"))
                                .hsnCode("85285100")
                                .active(true)
                                .createdBy("system")
                                .updatedBy("system")
                                .build();
                itemRepository.save(monitor);

                // Sample Services
                Item maintenance = Item.builder()
                                .name("IT Maintenance Service")
                                .type(ItemType.SERVICE)
                                .unit("HRS")
                                .sellable(true)
                                .sellingPrice(new BigDecimal("2000.00"))
                                .salesAccount("Service Revenue")
                                .salesDescription("On-site IT maintenance and support service per hour")
                                .purchasable(false)
                                .active(true)
                                .createdBy("system")
                                .updatedBy("system")
                                .build();
                itemRepository.save(maintenance);

                Item installation = Item.builder()
                                .name("Software Installation")
                                .type(ItemType.SERVICE)
                                .unit("HRS")
                                .sellable(true)
                                .sellingPrice(new BigDecimal("1500.00"))
                                .salesAccount("Service Revenue")
                                .salesDescription("Professional software installation and configuration")
                                .purchasable(false)
                                .active(true)
                                .createdBy("system")
                                .updatedBy("system")
                                .build();
                itemRepository.save(installation);

                Item consulting = Item.builder()
                                .name("IT Consulting")
                                .type(ItemType.SERVICE)
                                .unit("HRS")
                                .sellable(true)
                                .sellingPrice(new BigDecimal("5000.00"))
                                .salesAccount("Consulting Revenue")
                                .salesDescription("Expert IT consulting and advisory services")
                                .purchasable(true)
                                .costPrice(new BigDecimal("3000.00"))
                                .purchaseAccount("Subcontractor Expenses")
                                .purchaseDescription("Outsourced IT consulting services")
                                .preferredVendor("TechConsult India")
                                .active(true)
                                .createdBy("system")
                                .updatedBy("system")
                                .build();
                itemRepository.save(consulting);

                Item training = Item.builder()
                                .name("Software Training")
                                .type(ItemType.SERVICE)
                                .unit("SESSION")
                                .sellable(true)
                                .sellingPrice(new BigDecimal("10000.00"))
                                .salesAccount("Training Revenue")
                                .salesDescription("Corporate software training session (4 hours)")
                                .purchasable(false)
                                .active(true)
                                .createdBy("system")
                                .updatedBy("system")
                                .build();
                itemRepository.save(training);

                log.info("Created {} sample items", itemRepository.count());
        }
}
