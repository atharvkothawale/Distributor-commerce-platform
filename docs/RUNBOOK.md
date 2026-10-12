# ShopNova Operations Runbook & Final Viva Defense Guide
**Academic Deliverables S8, S9, S10 | Final Year B.Tech Project**
**Author:** Avadhut K. Patil (DevOps / SRE Engineer)

---

## 1. Quickstart Guide (Running the Application Locally)

### Prerequisites
- **Java 21 LTS** & **Maven 3.9+**
- **Node.js 20+** & **npm**
- **PostgreSQL 16** (or runs automatically in memory if Postgres is offline)

### Step 1: Launch Backend (Port 8080)
Open a terminal in the project root:
```bash
cd backend
mvn spring-boot:run
```
*The application starts on `http://localhost:8080`. Automatic database seeding activates on first boot.*

### Step 2: Launch Frontend (Port 5173)
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open your browser at: **[http://localhost:5173](http://localhost:5173)**

---

## 2. Pre-Seeded Academic Demo Accounts

The database automatically initializes with two ready-to-use accounts on first launch:

| Account Type | Email Address | Password | Permissions & Role |
|---|---|---|---|
| **Platform Administrator** | `admin@shopnova.com` | `Password@123` | `ROLE_ADMIN` (Access to Admin Console, KPI Analytics, Product CRUD, Order Status Management) |
| **Demo Customer** | `customer@shopnova.com` | `Password@123` | `ROLE_CUSTOMER` (Product discovery, Cart management, Checkout, Order Tracking) |

*Tip: On the Sign In page (`/login`), click the **"👤 Demo Customer"** or **"🛡️ Demo Admin"** fast-fill buttons for instant 1-click viva logins.*

---

## 3. End-to-End Demonstration Script for Viva Evaluators

1. **Homepage & Catalog Browsing**:
   - Navigate to `http://localhost:5173`.
   - Point out the 6 categories (Electronics, Laptops, Audio, Smartphones, Fashion, Home).
   - Click a category (e.g., *Smartphones*) or type *"MacBook"* in the search bar. Note the instant database-backed search results.
2. **Product Details & Stock Check**:
   - Click any product to open the **Quick View Modal**.
   - Show available stock, specifications, brand, price, and warranty badges.
3. **Cart Management**:
   - Click **"Add to Cart"**. Notice the cart counter badge increments in the header.
   - Click the **Cart** icon. Increase quantity, observe dynamic tax and shipping calculations ($0 shipping when subtotal >= $50).
4. **Checkout & Mock Payment**:
   - Click **"Proceed to Checkout"**.
   - Review pre-filled delivery address and select payment method (Credit Card / UPI / COD).
   - Click **"Confirm & Pay"**.
   - Emphasize the **Order Confirmation Screen** displaying the unique `ORD-` number and transaction ID.
5. **Customer Order History**:
   - Navigate to **"My Orders"**. Show the newly confirmed order.
6. **Administrator Operations Console**:
   - Sign in as `admin@shopnova.com`.
   - Click **"Admin Console"** in the navigation bar.
   - Showcase real-time KPI metrics: Total Revenue, Order Volume, Active Products, Low Stock alerts.
   - Change order status from `CONFIRMED` to `SHIPPED` and `DELIVERED`.
   - Open the **Product Inventory** tab, add a new product or adjust stock, and verify it appears immediately in the customer storefront.

---

## 4. Container & Kubernetes Execution

### Launch with Docker Compose (Rajvardhan Jagtap - S8)
```bash
cd docker
docker-compose up -d
```
Access frontend at `http://localhost:80` and backend at `http://localhost:8080`.

### Deploy to Minikube Kubernetes (Omkar Patil - S9)
```bash
minikube start
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl get pods
minikube service shopnova-frontend-service
```

---

## 5. Comprehensive Final-Year Viva Questions & Answers

### Architecture & Design
**Q1: Why did your team select a Modular Monolith instead of Microservices?**
> *Answer:* For an e-commerce platform of our team size, a modular monolith provides clean domain segregation (packages for auth, catalog, cart, order, and admin) without the operational overhead of microservices (network latency, distributed transaction rollbacks, discovery servers, and multi-JVM memory consumption). It runs in a single process while strictly keeping bounded contexts clean.

**Q2: How does ShopNova prevent overselling when multiple users buy the last item simultaneously?**
> *Answer:* We enforce atomic inventory deductions directly in the database using Spring Data JPA `@Modifying` queries:
> `UPDATE products SET stock_quantity = stock_quantity - :qty WHERE id = :id AND stock_quantity >= :qty`
> If the available stock is less than requested, the updated row count returns `0`, causing the service to throw `InsufficientStockException` and rollback the checkout transaction.

**Q3: How is user authentication implemented?**
> *Answer:* We use stateless JWT (JSON Web Tokens) with JJWT 0.12.6. When a user logs in, BCrypt verifies their hashed password. The backend issues a signed HMAC-SHA256 token containing user claims (`userId`, `email`, `role`). The React frontend attaches this in the `Authorization: Bearer <token>` header for subsequent requests, verified by our `JwtAuthenticationFilter`.

**Q4: How do you protect administrative endpoints?**
> *Answer:* Spring Security method security is enabled via `@EnableMethodSecurity`. Administrative controllers and methods are guarded with `@PreAuthorize("hasRole('ADMIN')")`. Any non-admin request attempting to access `/api/admin/**` receives an HTTP 403 Forbidden response.

### DevOps & Testing
**Q5: What tests were conducted and how did you verify them?**
> *Answer:* We wrote JUnit 5 and Spring Boot integration tests verifying context startup, customer registration/login, duplicate email prevention, cart additions, inventory deduction, and checkout order placement. Tests execute via `mvn test` in our Jenkins CI/CD pipeline.

**Q6: What is the role of Spring Boot Actuator in your platform?**
> *Answer:* Actuator provides production observability endpoints at `/actuator/health` and `/actuator/metrics`. Kubernetes uses `/actuator/health` for automated Liveness and Readiness probes to ensure zero downtime.
