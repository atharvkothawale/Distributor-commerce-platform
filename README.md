# Distributed Commerce Platform (ShopNova)

[![Java](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2023.0.3-green.svg)](https://spring.io/projects/spring-cloud)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Kafka](https://img.shields.io/badge/Apache%20Kafka-7.5-red.svg)](https://kafka.apache.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-29.6-blue.svg)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Minikube-326CE5.svg)](https://kubernetes.io/)

A production-style, resilient, distributed e-commerce application inspired by Amazon and Flipkart, built for an **11-member Final-Year B.Tech Computer Engineering** capstone project.

---

## 1. System Architecture

```
                                  +------------------------------------+
                                  |     React + Vite Single Page App   |
                                  |    (Customer Portal & Admin UI)    |
                                  +-----------------+------------------+
                                                    | HTTP (:5173 -> :8080)
                                                    v
                                  +------------------------------------+
                                  |      Spring Cloud API Gateway      |
                                  |   (Port 8080 - Routing & Auth)     |
                                  +---+------------+--------------+----+
                                      |            |              |
                +---------------------+            |              +---------------------+
                v                                  v                                    v
     +--------------------+              +--------------------+              +--------------------+
     |  Identity Service  |              |  Catalog Service   |              |   Order Service    |
     |    (Port 8081)     |              |    (Port 8082)     |              |    (Port 8083)     |
     | PostgreSQL: users  |              | PostgreSQL: catalog|              | PostgreSQL: orders |
     +--------------------+              | Redis: hot cache   |              +----------+---------+
                                         +--------------------+                         |
                                                    |                                   |
                                                    | Kafka                             | Kafka
                                                    | Events                            | Events
                                                    v                                   v
                                       +----------------------------+                   |
                                       |     Apache Kafka Broker    |<------------------+
                                       |  (Topics: order-events,    |
                                       |   notification-events)     |
                                       +-------------+--------------+
                                                     |
                                                     | Events
                                                     v
                                       +----------------------------+
                                       |    Notification Service    |
                                       |        (Port 8084)         |
                                       |  Simulated Email & Alerts  |
                                       +----------------------------+
```

---

## 2. Microservice Directory & Port Mapping

| Service | Port | Technology | Primary Responsibility |
|---|---|---|---|
| **`api-gateway`** | `8080` | Spring Cloud Gateway, WebFlux | Central ingress routing, CORS, JWT claims propagation |
| **`auth-service`** | `8081` | Spring Boot 3, Spring Security, JJWT | User registration, login, BCrypt password hashing, profile |
| **`catalog-service`**| `8082` | Spring Boot 3, Spring Data JPA, Redis | Product catalog, multi-category search, inventory levels |
| **`order-service`** | `8083` | Spring Boot 3, Spring Data JPA, Kafka | Shopping cart, checkout, mock payments, order state machine |
| **`notification-service`** | `8084` | Spring Boot 3, Kafka Consumer | Asynchronous order alerts and audit logging |
| **`frontend`** | `5173` | React 18, Vite, React Router, Lucide | Responsive customer catalog & admin operations console |

---

## 3. 11-Member Team Ownership

| Team Member | Official Role | Primary Ownership Area |
|---|---|---|
| **Ayush S. Mule** | Team Lead | Architecture Coordination, Master Tracking & Final Viva Demonstration |
| **Prathamesh D. Handifode** | Developer 1 | Spring Cloud API Gateway & Identity / Auth Service |
| **Shravan C. Shinde** | Developer 2 | React Frontend Architecture, Customer Pages & Responsive Layout |
| **Atharv A. Jadhav** | Developer 3 | Catalog & Inventory Microservice, Search & Stock Deductions |
| **Shubham S. Jadhav** | Developer 4 | Order Service, Checkout Flow, Mock Payment & Notifications |
| **Akash S. Kamble** | QA Automation Engineer | Test Automation, JUnit/MockMvc suites, Postman APIs, Defect Log |
| **Atharv A. Kothawale** | Git/GitHub Engineer | GitHub Repository, Branch Policies, PR Governance, CODEOWNERS |
| **Yash A. Khankar** | Jenkins Engineer | Multi-stage CI/CD Jenkinsfile (Build, Test, Containerize, Deploy) |
| **Omkar R. Patil** | Kubernetes Engineer | Kubernetes Manifests, Deployments, Services, ConfigMaps, Minikube |
| **Rajvardhan A. Jagtap** | Docker Engineer | Multi-stage Dockerfiles, Docker Compose, Image Optimization |
| **Avadhut K. Patil** | DevOps/SRE Engineer | Observability, Spring Actuator, Runbooks & System Reliability |

---

## 4. Local Quickstart

### Prerequisites
- Java 21 LTS & Maven 3.9+
- Node.js 20+ & npm
- Docker Desktop

### 1. Launch Infrastructure (PostgreSQL, Kafka, Redis)
```bash
cd docker
docker-compose up -d
```

### 2. Build & Run Backend Microservices
```bash
cd backend
mvn clean compile -DskipTests
```

### 3. Launch Frontend Web App
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
