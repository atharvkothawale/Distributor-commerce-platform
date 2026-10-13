# ShopNova: Distributed Commerce Platform

[![Java](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Minikube-326CE5.svg)](https://kubernetes.io/)
[![Build Status](https://img.shields.io/badge/Build-Passing-success.svg)](https://github.com/atharvkothawale/Distributor-commerce-platform)

A reliable, full-featured e-commerce web platform inspired by Amazon and Flipkart, engineered as an academic capstone project for an **11-Member Final-Year B.Tech Computer Engineering** team.

## Project Objectives

The main objective of **ShopNova: Distributed Commerce Platform** is to develop a web-based e-commerce application that demonstrates the core functionality of an online shopping system using modern frontend, backend, and database technologies. This project is developed as an academic capstone by an 11-member final-year Computer Engineering team.

The specific objectives of ShopNova are:

1. **Secure User Authentication:** Provide customer registration and login, role-based access control, and secure authentication using Spring Security and JWT.
2. **Product Catalog Management:** Allow users to browse products, view product details, search the catalog, and explore available categories.
3. **Shopping Cart:** Enable customers to add products to their cart, update quantities, and review their selections before checkout.
4. **Order Processing:** Implement the checkout process, order creation, order history, and order-status tracking.
5. **Payment Simulation:** Demonstrate the payment step in the checkout workflow without processing real financial transactions.
6. **Administrative Management:** Provide authorized administrators with tools to manage products and orders and view relevant dashboard metrics.
7. **Database Integration:** Store and manage application data using a relational database, with support for an in-memory database where configured for demonstrations or testing.
8. **Software Testing:** Use automated tests to check important authentication, cart, order, and application functionality.
9. **DevOps and Deployment:** Demonstrate collaborative development with Git and GitHub, continuous integration with Jenkins, containerization with Docker, and deployment with Kubernetes.
10. **Team Collaboration and Documentation:** Organize the work of the 11-member team into defined responsibilities and document the architecture, setup instructions, testing, deployment, and operational procedures.

### Project Scope

ShopNova demonstrates the principal workflows of an academic e-commerce application, including product discovery, authentication, cart management, order processing, and administrative operations. It also provides an opportunity to apply software engineering practices such as modular application design, automated testing, version control, and deployment automation.

**Limitations:** Payments are simulated and do not process real financial transactions. The platform is intended for academic demonstration and learning, not as a production-ready commercial service without further security, performance, and operational review.
---

## 1. System Architecture

ShopNova utilizes a **Modular Monolith architecture** running on Spring Boot 3, providing domain segregation with low overhead, instant startup, and zero cross-network failure points.

```
                              +------------------------------------+
                              |    React 18 + Vite (Port 5173)     |
                              |   Customer Storefront & Admin UI   |
                              +-----------------+------------------+
                                                | HTTP REST (JSON / JWT)
                                                v
                              +------------------------------------+
                              |  Spring Boot 3 Backend (Port 8080) |
                              |      com.commerce.shopnova.*       |
                              +-----------------+------------------+
                                                |
         +-----------------+--------------------+-----------------+-----------------+
         |                 |                    |                 |                 |
         v                 v                    v                 v                 v
   [auth package]   [catalog package]     [cart package]    [order package]   [admin package]
   - Users & Roles  - Categories & Prods  - CartItem Store  - Checkout Flow   - KPI Analytics
   - BCrypt / JWT   - Search & Inventory  - Real-time Subtot- Mock Payments   - Manage Products
         |                 |                    |                 |                 |
         +-----------------+--------------------+-----------------+-----------------+
                                                |
                                                v
                              +------------------------------------+
                              | Relational Database (PostgreSQL 16 |
                              | / In-Memory H2 for offline demos)  |
                              +------------------------------------+
```

---

## 2. 11-Member Team & Academic Matrix (S1–S10)

| Step | Focus Area | Member | Role | Academic Deliverables |
|---|---|---|---|---|
| **S1** | **Architecture** | **Ayush S. Mule** | Team Lead | System charter, scope, ER diagram, viva coordination ([`ARCHITECTURE.md`](docs/ARCHITECTURE.md)) |
| **S2** | **Core Backend** | **Prathamesh D. Handifode** | Developer 1 | Spring Security, JJWT v0.12, BCrypt, User Entity, AuthService, AuthController |
| **S3** | **Customer UI** | **Shravan C. Shinde** | Developer 2 | React 18, Vite, Storefront catalog, search filter, cart drawer, checkout modal |
| **S2** | **Catalog Engine** | **Atharv A. Jadhav** | Developer 3 | Category & Product models, faceted search, concurrency-safe stock updates, seed data |
| **S2** | **Orders & Pay** | **Shubham S. Jadhav** | Developer 4 | Shopping cart, checkout state machine, payment simulation, customer order history |
| **S4** | **Admin Console** | **Shravan & Prathamesh**| Dev 1 & Dev 2| Admin Dashboard: KPI metrics, product CRUD table, order fulfillment status updater |
| **S5** | **Testing Suite** | **Akash S. Kamble** | QA Engineer | JUnit 5 test suite, Cart & Order flow integration tests (`mvn test` verified) |
| **S6** | **Git Governance**| **Atharv A. Kothawale** | Git Engineer | GitHub repo governance, branch policies (`main`/`feature/*`), [`.github/CODEOWNERS`](.github/CODEOWNERS) |
| **S7** | **CI/CD Pipeline**| **Yash A. Khankar** | Jenkins Engineer | Multi-stage declarative pipeline ([`jenkins/Jenkinsfile`](jenkins/Jenkinsfile)) |
| **S8** | **Docker** | **Rajvardhan A. Jagtap** | Docker Engineer | Multi-stage Dockerfiles & Docker Compose ([`docker/docker-compose.yml`](docker/docker-compose.yml)) |
| **S9** | **Kubernetes** | **Omkar R. Patil** | K8s Engineer | Minikube manifests: Postgres, Backend, and Frontend ([`k8s/`](k8s/)) |
| **S10**| **Operations** | **Avadhut K. Patil** | DevOps / SRE | Actuator observability, local runbook, viva defense manual ([`RUNBOOK.md`](docs/RUNBOOK.md)) |

---

## 3. Local Quickstart (Zero-Friction Launch)

### Prerequisites
- Java 21 LTS & Maven 3.9+
- Node.js 20+ & npm

### 1. Launch Backend (Port 8080)
```bash
cd backend
mvn spring-boot:run
```
*Backend initializes on `http://localhost:8080`. Seeder automatically creates demo accounts and 12 products on first startup.*

### 2. Launch Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 4. Pre-Seeded Academic Demo Accounts

| Account Type | Email | Password | Role & Permissions |
|---|---|---|---|
| **Platform Administrator** | `admin@shopnova.com` | `Password@123` | `ROLE_ADMIN` (Full Admin Console, KPI Analytics, Product CRUD, Order Status) |
| **Demo Customer** | `customer@shopnova.com` | `Password@123` | `ROLE_CUSTOMER` (Product discovery, Cart, Checkout, Order tracking) |

*Fast demo: On the login page, use the **"👤 Demo Customer"** or **"🛡️ Demo Admin"** 1-click buttons.*

---

## 5. Automated Verification Results (S5)

The automated test suite executes via:
```bash
cd backend
mvn test
```

### Verified Test Run Summary:
```text
[INFO] Running com.commerce.shopnova.AuthServiceTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0 (Passed in 0.42s)
[INFO] Running com.commerce.shopnova.CartAndOrderFlowTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0 (Passed in 0.58s)
[INFO] Running com.commerce.shopnova.ShopNovaApplicationTests
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0 (Passed in 0.21s)
[INFO] Results: Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

---

## 6. Docker & Kubernetes Execution

### One-Click Docker Compose
```bash
cd docker
docker-compose up -d
```
Access frontend at `http://localhost:80` and backend at `http://localhost:8080`.

### Minikube Deployment
```bash
minikube start
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
minikube service shopnova-frontend-service
```

---

## 7. Documentation Directory

- **System Architecture & ER Diagram (S1)**: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- **Operations Runbook & 20 Viva Q&As (S10)**: [`docs/RUNBOOK.md`](docs/RUNBOOK.md)
- **11-Member Contribution Matrix**: [`docs/TEAM_CONTRIBUTIONS.md`](docs/TEAM_CONTRIBUTIONS.md)
- **CI/CD Pipeline Definition (S7)**: [`jenkins/Jenkinsfile`](jenkins/Jenkinsfile)
- **Kubernetes Manifests (S9)**: [`k8s/`](k8s/)
