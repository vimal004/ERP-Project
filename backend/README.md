# ERP Backend - Spring Boot Server

A Spring Boot backend server for the ERP system with JWT-based authentication.

## Prerequisites

- **Java 17** or higher
- **Maven 3.8+** (or use the included wrapper)

### Installing Java 17

#### Windows (using winget)

```powershell
winget install Microsoft.OpenJDK.17
```

#### Windows (manual)

1. Download from [Adoptium](https://adoptium.net/temurin/releases/?version=17)
2. Run the installer
3. Verify: `java --version`

### Installing Maven

#### Windows (using winget)

```powershell
winget install Apache.Maven
```

#### Windows (manual)

1. Download from [Apache Maven](https://maven.apache.org/download.cgi)
2. Extract to `C:\Program Files\Apache\maven`
3. Add to PATH: `C:\Program Files\Apache\maven\bin`
4. Verify: `mvn --version`

## Running the Application

### Using Maven

```bash
cd Backend
mvn spring-boot:run
```

### Using Java directly (after building)

```bash
mvn clean package
java -jar target/erp-backend-1.0.0.jar
```

## API Endpoints

### Authentication

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "admin123",
  "role": "Admin"
}
```

#### Response (Success)

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "admin@company.com",
  "name": "System Administrator",
  "role": "ADMIN"
}
```

#### Response (Failure)

```json
{
  "success": false,
  "error": "Invalid email or password. Please try again."
}
```

#### Validate Token

```http
GET /api/auth/validate
Authorization: Bearer <token>
```

#### Health Check

```http
GET /api/auth/health
```

## Default Users

The application initializes with two default users:

| Role  | Email             | Password |
| ----- | ----------------- | -------- |
| Admin | admin@company.com | admin123 |
| User  | user@company.com  | user123  |

## Configuration

Configuration is in `src/main/resources/application.properties`:

| Property                   | Description           | Default             |
| -------------------------- | --------------------- | ------------------- |
| `server.port`              | Server port           | 8080                |
| `jwt.secret`               | JWT signing key       | (Base64 encoded)    |
| `jwt.expiration`           | Token expiration (ms) | 86400000 (24h)      |
| `app.cors.allowed-origins` | Allowed CORS origins  | localhost:5173,3000 |

## H2 Console (Development)

Access the H2 database console at: http://localhost:8080/h2-console

- **JDBC URL**: `jdbc:h2:mem:erpdb`
- **Username**: `sa`
- **Password**: (empty)

## Project Structure

```
Backend/
├── src/main/java/com/erp/
│   ├── ErpApplication.java       # Main application
│   ├── config/
│   │   ├── DataInitializer.java  # Default user creation
│   │   └── SecurityConfig.java   # Security configuration
│   ├── controller/
│   │   └── AuthController.java   # Auth REST endpoints
│   ├── dto/
│   │   ├── LoginRequest.java     # Login request DTO
│   │   └── LoginResponse.java    # Login response DTO
│   ├── entity/
│   │   ├── Role.java             # Role enum
│   │   └── User.java             # User entity
│   ├── exception/
│   │   └── GlobalExceptionHandler.java  # Error handling
│   ├── repository/
│   │   └── UserRepository.java   # Data access
│   ├── security/
│   │   ├── JwtAuthenticationFilter.java  # JWT filter
│   │   └── JwtService.java       # JWT utilities
│   └── service/
│       └── AuthService.java      # Auth business logic
├── src/main/resources/
│   └── application.properties    # Configuration
└── pom.xml                       # Maven dependencies
```

## Technology Stack

- **Spring Boot 3.2.1** - Application framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Data persistence
- **H2 Database** - In-memory database (development)
- **JWT (jjwt 0.12.3)** - Token-based authentication
- **Lombok** - Reduce boilerplate code

## Connecting Frontend

The frontend at `localhost:5173` is pre-configured in CORS settings.

Update the frontend environment variable if using a different backend URL:

```env
VITE_API_URL=http://localhost:8080
```

## 🐳 Docker Deployment

### Build Docker Image

```bash
cd Backend
docker build -t erp-backend .
```

### Run Locally with Docker

```bash
docker run -p 8080:8080 \
  -e JWT_SECRET=your-secret-key \
  -e CORS_ORIGINS=http://localhost:5173 \
  erp-backend
```

## 🚀 Cloud Deployment

### Deploy to Render

1. **Push your code** to GitHub/GitLab

2. **Option A: Manual Setup**

   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your repository
   - Configure:
     - **Root Directory**: `Backend`
     - **Runtime**: Docker
     - **Health Check Path**: `/actuator/health`
   - Add Environment Variables:
     | Variable | Value |
     |----------|-------|
     | `JWT_SECRET` | (generate a secure key) |
     | `CORS_ORIGINS` | Your frontend URL |
     | `DATABASE_URL` | (from Render PostgreSQL) |

3. **Option B: Blueprint (Recommended)**
   - The `render.yaml` file is pre-configured
   - Go to Render Dashboard → "New" → "Blueprint"
   - Connect your repo - Render auto-detects the config

### Deploy to Railway

1. **Push your code** to GitHub

2. **Setup on Railway**

   - Go to [Railway](https://railway.app)
   - Click "New Project" → "Deploy from GitHub Repo"
   - Select your repository
   - Railway auto-detects `railway.json`

3. **Add Environment Variables** in Railway Dashboard:
   | Variable | Value |
   |----------|-------|
   | `JWT_SECRET` | (generate a secure key) |
   | `CORS_ORIGINS` | Your frontend URL |
   | `DATABASE_URL` | (from Railway PostgreSQL) |
   | `DATABASE_USER` | (from Railway PostgreSQL) |
   | `DATABASE_PASSWORD` | (from Railway PostgreSQL) |
   | `DATABASE_DRIVER` | `org.postgresql.Driver` |
   | `JPA_DIALECT` | `org.hibernate.dialect.PostgreSQLDialect` |

4. **Add PostgreSQL Database**
   - In Railway, click "New" → "Database" → "PostgreSQL"
   - Link it to your service

## 🔐 Environment Variables Reference

| Variable            | Description                       | Required | Default      |
| ------------------- | --------------------------------- | -------- | ------------ |
| `PORT`              | Server port                       | No       | 8080         |
| `JWT_SECRET`        | JWT signing key                   | **Yes**  | -            |
| `JWT_EXPIRATION`    | Token expiry (ms)                 | No       | 86400000     |
| `CORS_ORIGINS`      | Allowed origins (comma-separated) | **Yes**  | -            |
| `DATABASE_URL`      | Database connection URL           | **Yes**  | H2 in-memory |
| `DATABASE_USER`     | Database username                 | No       | sa           |
| `DATABASE_PASSWORD` | Database password                 | No       | (empty)      |
| `DATABASE_DRIVER`   | JDBC driver class                 | No       | H2           |
| `JPA_DIALECT`       | Hibernate dialect                 | No       | H2Dialect    |
| `JPA_DDL_AUTO`      | Schema management                 | No       | update       |
| `DB_POOL_SIZE`      | Connection pool size              | No       | 10           |
