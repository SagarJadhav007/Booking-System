# 🎟️ Booking System

A full-stack, cloud-native event ticket booking platform — built end-to-end with a Spring Boot backend, a React frontend, and production-grade AWS infrastructure provisioned entirely through Terraform.

---

## 📖 Overview

Booking System lets users browse events, hold and reserve seats in real time, pay for bookings, and receive confirmation emails — while admins manage events and view dashboard analytics. The project is designed to mirror a real production deployment: containerized services, a private VPC network, managed Postgres and Redis, async event processing via SQS, and a CI/CD pipeline that ships straight to ECS Fargate.

---

## 🏗️ Tech Stack

### Backend
- **Java 21** + **Spring Boot 3.5**
- **Spring Security** with **JWT** authentication (`jjwt`)
- **Spring Data JPA** — PostgreSQL persistence
- **Spring Data Redis** — distributed seat-hold locking (prevents double-booking)
- **AWS SDK v2** — SQS (async booking events) & SES (transactional emails)
- **Spring Boot Actuator** — health checks
- Maven build (`pom.xml`)

### Frontend
- **React 19** + **TypeScript**
- **Vite 8** — build tool & dev server
- **Tailwind CSS 4** with **shadcn/ui** + **Radix UI** primitives
- **React Router v7** — client-side routing
- **Axios** — API client
- **Lucide React** — icons

### Infrastructure (Terraform / IaC)
Full production stack defined in `/infra`, deployed to **`ap-south-1`**:
- **VPC** with public & private subnet tiers
- **ECS Fargate** — containerized backend service
- **RDS (PostgreSQL)** — managed relational database
- **ElastiCache (Redis)** — seat-hold cache
- **Application Load Balancer (ALB)**
- **CloudFront** — CDN/edge distribution
- **S3** — static asset storage
- **ECR** — container image registry
- **SQS** — booking event queue
- **Secrets Manager** — credential management
- **CloudWatch Logs** — observability
- **IAM** — least-privilege roles/policies

### DevOps
- **Docker** & **Docker Compose** for local development (Postgres + Redis + app)
- **GitHub Actions** CI/CD — builds the Spring Boot jar, builds & pushes a Docker image to ECR, and forces a new ECS deployment on every push to `master`

---

## ✨ Features

- 🔐 JWT-based authentication with role-based access (User / Admin)
- 📅 Event browsing and creation (admin)
- 💺 Real-time seat selection with Redis-backed temporary holds to prevent race conditions
- 💳 Payment flow with a pluggable payment gateway interface (mock gateway included)
- 📧 Booking confirmation emails via AWS SES (with a local/dev email service fallback)
- 📊 Admin dashboard with booking/event statistics
- 🔄 Asynchronous booking event processing via SQS (publisher/consumer pattern, with a local in-process fallback)
- ✅ Concurrency tests for seat reservation correctness

---

## 📂 Project Structure

```
Booking-System/
├── src/main/java/com/sagar/bookingsystem/
│   ├── config/          # Security, Redis, SQS, SES, seat seeding
│   ├── controller/      # REST controllers (Auth, Event, Seat, Booking, Payment, Admin)
│   ├── dto/              # Request/response DTOs
│   ├── exception/        # Global exception handling
│   ├── model/            # JPA entities
│   ├── repository/       # Spring Data repositories
│   ├── security/         # JWT filter
│   └── service/          # Business logic (auth, booking, payment, email, event pub/sub)
├── src/test/              # Unit & concurrency tests
├── frontend/               # React + Vite + TypeScript SPA
│   └── src/
│       ├── api/           # Axios API clients
│       ├── components/    # UI components (events, seats, layout, shadcn ui)
│       ├── context/       # Auth context
│       └── pages/         # Auth, events, booking, dashboard, admin pages
├── infra/                  # Terraform: VPC, ECS, RDS, Redis, ALB, CloudFront, S3, SQS, IAM...
├── Dockerfile
├── docker-compose.yml
└── .github/workflows/deploy.yml   # CI/CD pipeline (ECR + ECS)
```

---

## 🚀 Getting Started

### Prerequisites
- Java 21
- Node.js 18+
- Docker & Docker Compose
- (Optional) AWS account for SQS/SES/Terraform deployment

### Run locally with Docker Compose

```bash
docker-compose up --build
```

This spins up Postgres, Redis, and the Spring Boot app (`localhost:8080`).

### Run the backend manually

```bash
./mvnw clean install
export DB_URL=jdbc:postgresql://localhost:5432/bookingdb
export DB_USERNAME=bookinguser
export DB_PASSWORD=bookingpass
export REDIS_HOST=localhost
export REDIS_PORT=6379
./mvnw spring-boot:run
```

### Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server runs on Vite's default port and talks to the backend API (configured via `frontend/src/config/env.ts`).

---

## ☁️ Infrastructure Deployment (Terraform)

```bash
cd infra
terraform init
terraform plan
terraform apply
```

Provisions the full AWS stack (VPC, ECS Fargate service, RDS, ElastiCache, ALB, CloudFront, S3, ECR, SQS, Secrets Manager, CloudWatch) in `ap-south-1`.

CI/CD then builds and pushes the Docker image to ECR and triggers an ECS rolling deployment automatically on every push to `master`.

---

## 🧪 Testing

```bash
./mvnw test
```

Includes a dedicated `SeatConcurrencyTest` to validate that concurrent seat-reservation requests don't result in double-booking.

---

## 📝 License

No license specified yet — add one (e.g. MIT) if you intend this to be open source.
