# React & Spring Boot Todo Application

A full-stack todo application built with React (TypeScript) frontend and Spring Boot Java backend, with MySQL database.

## Prerequisites

- **Docker** (v20.10 or higher)
- **Docker Compose** (v2.0 or higher)

No additional tools required. Docker handles all build processes.

## Project Structure

```
.
├── backend/                 # Spring Boot Java API
│   ├── Dockerfile          # Backend Docker image
│   ├── pom.xml             # Maven configuration
│   └── src/
├── frontend/               # React TypeScript UI
│   ├── Dockerfile          # Frontend Docker image
│   ├── package.json        # Node.js dependencies
│   └── src/
├── docker-compose.yml      # Orchestration file
└── README.md
```

## Quick Start

### 1. Build and Run the Application

```bash
# Clone/navigate to project directory
cd /path/to/MBTech

# Build and start all services (frontend, backend, database)
docker-compose up --build
```

This command will:
- Build the backend Java application (Spring Boot with Maven)
- Build the frontend React application (TypeScript with Vite)
- Start MySQL database
- Start all services in Docker containers

**Expected output:** All services should be running without errors.

### 2. Access the Application

Once all services are running:

- **Frontend UI:** http://localhost:5173
- **Backend API:** http://localhost:8097
- **Database:** localhost:3307 (MySQL)

### 3. Stop the Application

```bash
# Stop all services
docker-compose down

# Stop and remove all data (including database)
docker-compose down -v
```

## Building Without Running

If you only want to build the Docker images:

```bash
docker-compose build
```

## Running Specific Services

```bash
# Run only backend and database
docker-compose up db backend

# Run only frontend
docker-compose up frontend
```

## Service Configuration

### Backend (Spring Boot)
- **Port:** 8097
- **Database Host (internal):** db:3306
- **Database Name:** task
- **Credentials:** root/root

### Frontend (React + Vite)
- **Port:** 5173
- **API Base URL:** http://localhost:8097

### Database (MySQL)
- **Port:** 3307 (external), 3306 (internal)
- **Database Name:** task
- **Root User:** root
- **Root Password:** root

## API Endpoints

- `GET /api/todos` - Fetch all incomplete todos (latest 5)
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/{id}` - Update a todo
- `PUT /api/todos/{id}/done` - Mark a todo as complete
- `DELETE /api/todos/{id}` - Delete a todo

## Frontend Testing

### Test Setup

The frontend uses the following testing stack:

- **Test Runner:** Vitest (Vite-native, Jest-compatible)
- **Testing Library:** React Testing Library
- **DOM Environment:** JSDOM
- **Test Files Location:** `frontend/src/__tests__/`
- **Setup File:** `frontend/src/test/setup.ts`

### Test Files

```
frontend/src/__tests__/
├── components/
│   ├── TaskCard.test.tsx        # Todo task card component tests
│   ├── TaskForm.test.tsx        # Todo creation form tests
│   └── EditTaskModal.test.tsx   # Todo edit modal tests
```

### Running Frontend Tests

#### Run Tests Locally

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Run tests in watch mode (interactive, re-runs on file changes)
npm run test

# Run tests with UI dashboard
npm run test:ui

# Run tests once (CI mode)
npm run test:run
```

#### Run Tests in Docker

```bash
# From project root directory
cd /path/to/MBTech

# Run tests in a temporary Docker container
docker-compose exec frontend npm run test:run

# Or build a container and run tests
docker build -f frontend/Dockerfile -t frontend-tests --target builder ./frontend && \
  docker run --rm frontend-tests npm run test:run
```

### Test Output

Tests will display:
- Number of passed/failed tests
- Code coverage (if enabled)
- Detailed error messages for failed assertions

### Test Coverage

To view test coverage, you can extend the test scripts in `package.json`:

```bash
npm run test -- --coverage
```

### Component Tests Included

- **TaskCard.test.tsx** - Tests display and completion of todos
- **TaskForm.test.tsx** - Tests todo creation form submission and validation
- **EditTaskModal.test.tsx** - Tests todo editing functionality

## Troubleshooting

### Frontend can't connect to backend
Ensure `docker-compose.yml` has the correct VITE_API_BASE_URL:
```yaml
VITE_API_BASE_URL: http://localhost:8097
```

### Database connection errors
Check if the database service is healthy:
```bash
docker-compose logs db
```

### Port already in use
Change the port mapping in `docker-compose.yml`:
```yaml
ports:
  - "5174:5173"  # Change 5174 to any available port
```

### Rebuild everything from scratch
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

## Development Notes

- **Backend:** Spring Boot 3.x, Maven-based build
- **Frontend:** React 18+, TypeScript, Vite build tool
- **Database:** MySQL 8.0
- All builds happen in Docker containers automatically
