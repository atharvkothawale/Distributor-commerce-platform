package com.commerce.shopnova.config;

import com.commerce.shopnova.auth.model.User;
import com.commerce.shopnova.auth.repository.UserRepository;
import com.commerce.shopnova.catalog.model.Category;
import com.commerce.shopnova.catalog.model.Product;
import com.commerce.shopnova.catalog.repository.CategoryRepository;
import com.commerce.shopnova.catalog.repository.ProductRepository;
import com.commerce.shopnova.common.SecurityConstants;
import com.commerce.shopnova.order.model.Order;
import com.commerce.shopnova.order.model.OrderItem;
import com.commerce.shopnova.order.model.OrderStatus;
import com.commerce.shopnova.order.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      CategoryRepository categoryRepository,
                      ProductRepository productRepository,
                      OrderRepository orderRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedCatalog();
        seedSampleOrder();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            log.info("Seeding initial users for ShopNova...");

            User admin = new User();
            admin.setFullName("Platform Administrator");
            admin.setEmail("admin@shopnova.com");
            admin.setPassword(passwordEncoder.encode("Password@123"));
            admin.setRole(SecurityConstants.ROLE_ADMIN);
            userRepository.save(admin);

            User customer = new User();
            customer.setFullName("Demo Customer");
            customer.setEmail("customer@shopnova.com");
            customer.setPassword(passwordEncoder.encode("Password@123"));
            customer.setRole(SecurityConstants.ROLE_CUSTOMER);
            userRepository.save(customer);

            log.info("Seeded users: admin@shopnova.com, customer@shopnova.com (Password: Password@123)");
        }
    }

    private void seedCatalog() {
        if (categoryRepository.count() == 0) {
            log.info("Seeding categories and products...");

            Category electronics = createCat("Electronics", "electronics", "Latest consumer gadgets, tech accessories, and smart devices", 1);
            Category laptops = createCat("Laptops & PCs", "laptops", "High performance ultrabooks, gaming rigs, and workstations", 2);
            Category audio = createCat("Audio & Headphones", "audio", "Noise cancelling wireless headphones, earbuds, and studio monitors", 3);
            Category smartphones = createCat("Smartphones", "smartphones", "Flagship 5G phones and premium mobile accessories", 4);
            Category fashion = createCat("Fashion & Apparel", "fashion", "Designer apparel, activewear, watches, and accessories", 5);
            Category home = createCat("Home & Kitchen", "home", "Smart appliances, barista espresso machines, and home decor", 6);

            categoryRepository.saveAll(List.of(electronics, laptops, audio, smartphones, fashion, home));

            List<Product> products = List.of(
                    createProd(
                            "MacBook Pro 16\" M3 Max", "LPT-MBP16-M3", "macbook-pro-16-m3-max",
                            "Apple M3 Max 16-core CPU, 40-core GPU, 36GB Unified Memory, 1TB SSD Storage. Liquid Retina XDR display with ProMotion.",
                            new BigDecimal("3499.00"), new BigDecimal("3299.00"), 45, laptops, "Apple",
                            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
                            4.9, 128, true
                    ),
                    createProd(
                            "Dell XPS 15 InfinityEdge", "LPT-DELL-XPS15", "dell-xps-15-infinityedge",
                            "13th Gen Intel Core i9, NVIDIA GeForce RTX 4070, 32GB DDR5, 1TB NVMe SSD, 3.5K OLED Touchscreen.",
                            new BigDecimal("2399.00"), new BigDecimal("2199.00"), 30, laptops, "Dell",
                            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80",
                            4.7, 85, true
                    ),
                    createProd(
                            "Sony WH-1000XM5 Wireless Headphones", "AUD-SNY-WH1000XM5", "sony-wh-1000xm5-wireless-headphones",
                            "Industry-leading noise canceling with two processors and 8 microphones. Ultra-comfortable lightweight design with 30-hour battery life.",
                            new BigDecimal("399.99"), new BigDecimal("348.00"), 120, audio, "Sony",
                            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
                            4.8, 412, true
                    ),
                    createProd(
                            "Apple AirPods Pro (2nd Gen, USB-C)", "AUD-APL-APP2", "apple-airpods-pro-2nd-gen",
                            "Active Noise Cancellation with Adaptive Audio, Transparency mode, and Personalized Spatial Audio with dynamic head tracking.",
                            new BigDecimal("249.00"), new BigDecimal("199.99"), 200, audio, "Apple",
                            "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80",
                            4.8, 950, true
                    ),
                    createProd(
                            "iPhone 15 Pro Max 256GB Titanium", "PHN-APL-IP15PM", "iphone-15-pro-max-256gb",
                            "Forged in titanium with industry-leading A17 Pro chip, customizable Action button, and versatile 48MP camera system.",
                            new BigDecimal("1199.00"), new BigDecimal("1149.00"), 80, smartphones, "Apple",
                            "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
                            4.9, 620, true
                    ),
                    createProd(
                            "Samsung Galaxy S24 Ultra", "PHN-SAM-S24U", "samsung-galaxy-s24-ultra",
                            "Galaxy AI features, built-in S Pen, Snapdragon 8 Gen 3 for Galaxy, 200MP camera with Quad Telephoto system.",
                            new BigDecimal("1299.99"), new BigDecimal("1199.99"), 65, smartphones, "Samsung",
                            "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
                            4.7, 340, true
                    ),
                    createProd(
                            "Breville Barista Touch Espresso Machine", "HOM-BRV-TOUCH", "breville-barista-touch-espresso-machine",
                            "Automated touchscreen menu with pre-programmed cafe drinks. ThermoJet heating system achieves optimum extraction temperature in 3 seconds.",
                            new BigDecimal("999.95"), new BigDecimal("899.95"), 25, home, "Breville",
                            "https://images.unsplash.com/photo-1517668808822-9ebd02f2a888?auto=format&fit=crop&w=800&q=80",
                            4.9, 145, true
                    ),
                    createProd(
                            "Minimalist Ceramic Matte Table Lamp", "HOM-LMP-MATTE", "minimalist-ceramic-matte-table-lamp",
                            "Architectural ceramic table lamp with warm dimmable LED ambiance. Handcrafted texture and brushed brass fittings.",
                            new BigDecimal("149.00"), new BigDecimal("119.00"), 90, home, "NordicLiving",
                            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
                            4.6, 68, false
                    ),
                    createProd(
                            "Logitech MX Master 3S Wireless Mouse", "ELE-LOG-MX3S", "logitech-mx-master-3s",
                            "Quiet clicks, 8K DPI any-surface tracking, MagSpeed electromagnetic scrolling, and ergonomic thumb rest.",
                            new BigDecimal("99.99"), new BigDecimal("89.99"), 150, electronics, "Logitech",
                            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
                            4.9, 780, true
                    ),
                    createProd(
                            "Keychron Q1 Pro Wireless Mechanical Keyboard", "ELE-KEY-Q1PRO", "keychron-q1-pro-wireless-keyboard",
                            "Custom CNC aluminum body, double-gasket design, QMK/VIA programmable, hot-swappable mechanical switches.",
                            new BigDecimal("199.00"), new BigDecimal("179.00"), 55, electronics, "Keychron",
                            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
                            4.8, 210, false
                    ),
                    createProd(
                            "Classic Merino Wool Overcoat", "FAS-COAT-WOOL", "classic-merino-wool-overcoat",
                            "100% fine Italian Merino wool tailored single-breasted coat. Fully lined with horn buttons and interior passport pocket.",
                            new BigDecimal("450.00"), new BigDecimal("380.00"), 40, fashion, "Heritage",
                            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
                            4.7, 54, false
                    ),
                    createProd(
                            "Chronograph Automatic Aviator Watch", "FAS-WTC-AVIATOR", "chronograph-automatic-aviator-watch",
                            "Swiss automatic chronograph movement, anti-reflective sapphire crystal, 100m water resistance, genuine leather strap.",
                            new BigDecimal("695.00"), new BigDecimal("595.00"), 35, fashion, "Chronos",
                            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
                            4.9, 92, true
                    )
            );

            productRepository.saveAll(products);
            log.info("Seeded {} products across 6 categories", products.size());
        }
    }

    private void seedSampleOrder() {
        if (orderRepository.count() == 0 && userRepository.count() > 0 && productRepository.count() > 0) {
            User customer = userRepository.findByEmail("customer@shopnova.com").orElse(null);
            Product mouse = productRepository.findBySku("ELE-LOG-MX3S").orElse(null);
            Product headphones = productRepository.findBySku("AUD-SNY-WH1000XM5").orElse(null);

            if (customer != null && mouse != null && headphones != null) {
                Order order = new Order();
                order.setOrderNumber("ORD-20261012-DEMO01");
                order.setUser(customer);
                order.setRecipientName("Demo Customer");
                order.setRecipientPhone("+91 98765 43210");
                order.setShippingAddress("Flat 402, Green Valley Towers, Pune, Maharashtra 411001");
                order.setPaymentMethod("CARD");
                order.setPaymentTransactionId("TXN-INIT-DEMO99");
                order.setPaymentStatus("COMPLETED");
                order.setStatus(OrderStatus.DELIVERED);

                BigDecimal subtotal = mouse.getDiscountPrice().add(headphones.getDiscountPrice());
                BigDecimal tax = subtotal.multiply(new BigDecimal("0.08"));
                order.setSubtotal(subtotal);
                order.setShippingCost(BigDecimal.ZERO);
                order.setTaxAmount(tax);
                order.setTotalAmount(subtotal.add(tax));

                OrderItem item1 = new OrderItem(order, mouse, mouse.getName(), mouse.getSku(), mouse.getImageUrl(), mouse.getDiscountPrice(), 1, mouse.getDiscountPrice());
                OrderItem item2 = new OrderItem(order, headphones, headphones.getName(), headphones.getSku(), headphones.getImageUrl(), headphones.getDiscountPrice(), 1, headphones.getDiscountPrice());

                order.addItem(item1);
                order.addItem(item2);

                orderRepository.save(order);
                log.info("Seeded initial completed order for demo customer");
            }
        }
    }

    private Category createCat(String name, String slug, String desc, int order) {
        Category c = new Category();
        c.setName(name);
        c.setSlug(slug);
        c.setDescription(desc);
        c.setDisplayOrder(order);
        return c;
    }

    private Product createProd(String name, String sku, String slug, String desc, BigDecimal price,
                               BigDecimal discountPrice, int stock, Category cat, String brand,
                               String img, double rating, int reviews, boolean featured) {
        Product p = new Product();
        p.setName(name);
        p.setSku(sku);
        p.setSlug(slug);
        p.setDescription(desc);
        p.setPrice(price);
        p.setDiscountPrice(discountPrice);
        p.setStockQuantity(stock);
        p.setCategory(cat);
        p.setBrand(brand);
        p.setImageUrl(img);
        p.setRating(rating);
        p.setReviewCount(reviews);
        p.setIsFeatured(featured);
        p.setIsActive(true);
        return p;
    }
}
