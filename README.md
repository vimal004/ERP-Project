# 🏢 ERP Management System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.6-brightgreen.svg)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB.svg)
![Java](https://img.shields.io/badge/Java-21-orange.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**A modern, full-stack Enterprise Resource Planning (ERP) system built with Spring Boot and React.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation) • [Deployment](#-deployment)

</div>

---

## 📋 Overview

This ERP Management System is a comprehensive business solution designed to streamline and automate core business processes including inventory management, sales operations, customer relationship management, and invoicing. Built with a modern tech stack, it offers a premium user experience with a sleek, professional UI.

---

## ✨ Features

### 📦 Inventory Management

- **Items Catalog** - Complete product/service management with detailed information
- **Stock Tracking** - Real-time inventory levels and stock management
- **Item Categories** - Organize items by type (Goods/Services)
- **Search & Filter** - Advanced search capabilities with smart filtering

### 👥 Customer Management

- **Customer Database** - Comprehensive customer information storage
- **Customer Types** - Support for both Business and Individual customers
- **Contact Management** - Store multiple contact details per customer
- **Billing & Shipping** - Separate billing and shipping address management

### 💼 Sales Module

- **Quotes** - Create and manage sales quotations
- **Sales Orders** - Convert quotes to orders seamlessly
- **Invoices** - Generate professional invoices
- **Recurring Invoices** - Automate recurring billing cycles
- **Delivery Challans** - Track goods delivery documentation

### 💸 Payroll Management

- **Payroll Dashboard** - Visual overview of payroll costs and employee metrics
- **Employee Management** - Detailed tracking of employee personal and professional info
- **Pay Run Processing** - Streamlined workflow for monthly salary processing
- **Tax & Deductions** - Automated calculations for EPF, ESI, and TDS
- **Payroll Settings** - Configurable organisation profiles and tax details

### 🔐 Security & Authentication

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access** - Admin and Staff role permissions
- **Session Management** - Secure session handling

### 📊 Dashboard & Analytics

- **Business Overview** - Key metrics at a glance
- **Recent Activity** - Track recent transactions
- **Quick Actions** - Fast access to common operations

---

## 🛠 Tech Stack

### Backend

| Technology          | Version | Description                    |
| ------------------- | ------- | ------------------------------ |
| **Java**            | 21      | Programming Language           |
| **Spring Boot**     | 3.3.6   | Application Framework          |
| **Spring Security** | -       | Authentication & Authorization |
| **Spring Data JPA** | -       | Database ORM                   |
| **PostgreSQL**      | -       | Production Database            |
| **H2 Database**     | -       | Development Database           |
| **JWT (jjwt)**      | 0.12.3  | Token Authentication           |
| **Maven**           | -       | Build Tool                     |
| **Docker**          | -       | Containerization               |

### Frontend

| Technology       | Version | Description                 |
| ---------------- | ------- | --------------------------- |
| **React**        | 19.1.1  | UI Framework                |
| **Vite**         | 7.1.7   | Build Tool                  |
| **React Router** | 7.9.6   | Client-side Routing         |
| **Tailwind CSS** | 4.1.14  | Utility-first CSS Framework |
| **Heroicons**    | 2.2.0   | Icon Library                |
| **Three.js**     | 0.181.1 | 3D Graphics                 |

---

## 📁 Project Structure

```
ERP Project/
├── 📂 backend/                    # Spring Boot Backend
│   ├── 📂 src/main/java/com/erp/
│   │   ├── 📂 config/             # Configuration classes
│   │   ├── 📂 controller/         # REST API Controllers
│   │   │   ├── AuthController.java
│   │   │   ├── CustomerController.java
│   │   │   ├── ItemController.java
│   │   │   ├── QuoteController.java
│   │   │   ├── SalesOrderController.java
│   │   │   ├── InvoiceController.java
│   │   │   ├── RecurringInvoiceController.java
│   │   │   └── DeliveryChallanController.java
│   │   ├── 📂 dto/                # Data Transfer Objects
│   │   ├── 📂 entity/             # JPA Entities
│   │   ├── 📂 exception/          # Exception Handling
│   │   ├── 📂 repository/         # Data Repositories
│   │   ├── 📂 security/           # Security Configuration
│   │   └── 📂 service/            # Business Logic
│   ├── Dockerfile                 # Docker configuration
│   ├── pom.xml                    # Maven dependencies
│   └── render.yaml                # Render deployment config
│
├── 📂 frontend/                   # React Frontend
│   ├── 📂 src/
│   │   ├── 📂 Components/         # Reusable UI Components
│   │   │   └── 📂 ui/             # Base UI Components
│   │   ├── 📂 pages/              # Application Pages
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ItemsPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── 📂 sales/          # Sales Module Pages
│   │   ├── 📂 services/           # API Service Layer
│   │   ├── 📂 styles/             # CSS Stylesheets
│   │   ├── App.jsx                # Main App Component
│   │   └── utilities.css          # Utility Classes
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.cjs
│   ├── vite.config.js
│   └── vercel.json                # Vercel deployment config
│
└── render.yaml                    # Root deployment blueprint
```

---

## 🚀 Installation

### Prerequisites

- **Java 21** or higher
- **Node.js 18+** and npm
- **Maven** (or use included wrapper)
- **PostgreSQL** (for production) or H2 (for development)

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Configure environment variables** (optional for dev)

   ```properties
   # application.properties or environment variables
   JWT_SECRET=your-secret-key
   DATABASE_URL=jdbc:postgresql://localhost:5432/erp
   DATABASE_USER=your-username
   DATABASE_PASSWORD=your-password
   ```

3. **Build and run**

   ```bash
   # Using Maven
   mvn clean install
   mvn spring-boot:run

   # Or using the wrapper
   ./mvnw spring-boot:run
   ```

4. **Access the API**
   - Base URL: `http://localhost:8080`
   - Health Check: `http://localhost:8080/actuator/health`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   ```bash
   # Create .env file
   VITE_API_BASE_URL=http://localhost:8080
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Access the application**
   - URL: `http://localhost:5173`

---

## 📖 Usage

### Default Credentials

| Role  | Email         | Password |
| ----- | ------------- | -------- |
| Admin | admin@erp.com | admin123 |
| Staff | staff@erp.com | staff123 |

### Quick Start Guide

1. **Login** - Access the system with your credentials
2. **Dashboard** - View business overview and key metrics
3. **Items** - Manage your product/service catalog
4. **Customers** - Add and manage customer information
5. **Sales** - Create quotes, orders, and invoices

---

## 📡 API Documentation

### Authentication

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/login`    | User login        |
| POST   | `/api/auth/register` | User registration |

### Items

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| GET    | `/api/items`            | Get all items       |
| GET    | `/api/items/{id}`       | Get item by ID      |
| POST   | `/api/items`            | Create new item     |
| PUT    | `/api/items/{id}`       | Update item         |
| DELETE | `/api/items/{id}`       | Delete item         |
| GET    | `/api/items/search`     | Search items        |
| GET    | `/api/items/statistics` | Get item statistics |

### Customers

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| GET    | `/api/customers`        | Get all customers   |
| GET    | `/api/customers/{id}`   | Get customer by ID  |
| POST   | `/api/customers`        | Create new customer |
| PUT    | `/api/customers/{id}`   | Update customer     |
| DELETE | `/api/customers/{id}`   | Delete customer     |
| GET    | `/api/customers/search` | Search customers    |

### Sales Documents

| Method | Endpoint                  | Description              |
| ------ | ------------------------- | ------------------------ |
| GET    | `/api/quotes`             | Get all quotes           |
| POST   | `/api/quotes`             | Create new quote         |
| GET    | `/api/sales-orders`       | Get all sales orders     |
| POST   | `/api/sales-orders`       | Create new sales order   |
| GET    | `/api/invoices`           | Get all invoices         |
| POST   | `/api/invoices`           | Create new invoice       |
| GET    | `/api/recurring-invoices` | Get recurring invoices   |
| POST   | `/api/recurring-invoices` | Create recurring invoice |
| GET    | `/api/delivery-challans`  | Get delivery challans    |
| POST   | `/api/delivery-challans`  | Create delivery challan  |

---

## 🚢 Deployment

### Backend (Render)

The backend is configured for deployment on **Render** using Docker.

1. Push code to GitHub
2. Connect repository to Render
3. Render auto-detects `render.yaml` configuration
4. Set required environment variables in Render dashboard

### Frontend (Vercel)

The frontend is configured for deployment on **Vercel**.

1. Push code to GitHub
2. Import project in Vercel
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set environment variables in Vercel dashboard

### Docker Deployment

```bash
# Build backend Docker image
cd backend
docker build -t erp-backend .

# Run the container
docker run -p 8080:8080 \
  -e JWT_SECRET=your-secret \
  -e DATABASE_URL=your-db-url \
  erp-backend
```

---

## 🔧 Configuration

### Environment Variables

#### Backend

| Variable            | Description               | Default    |
| ------------------- | ------------------------- | ---------- |
| `PORT`              | Server port               | `8080`     |
| `JWT_SECRET`        | JWT signing secret        | -          |
| `JWT_EXPIRATION`    | Token expiration (ms)     | `86400000` |
| `DATABASE_URL`      | PostgreSQL connection URL | -          |
| `DATABASE_USER`     | Database username         | -          |
| `DATABASE_PASSWORD` | Database password         | -          |
| `CORS_ORIGINS`      | Allowed CORS origins      | -          |

#### Frontend

| Variable            | Description     | Default |
| ------------------- | --------------- | ------- |
| `VITE_API_BASE_URL` | Backend API URL | -       |

---

## 🧪 Development

### Running Tests

```bash
# Backend tests
cd backend
mvn test

# Frontend linting
cd frontend
npm run lint
```

### Building for Production

```bash
# Backend
cd backend
mvn clean package -DskipTests

# Frontend
cd frontend
npm run build
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Vimal Manoharan**

---

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful UI library
- Tailwind CSS for the utility-first CSS framework
- All open-source contributors

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ using Spring Boot & React

</div>
