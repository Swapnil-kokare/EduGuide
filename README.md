# Career Guide Pro

Career Guide Pro is organized into separate application areas so the frontend, backend, database assets, and documentation are easier to work with.

## Project Layout

```text
career-guide-pro-main/
├── frontend/   # Vite + React client
├── backend/    # Express API
├── database/   # MongoDB models, connection helpers, seed/import scripts, data snapshots
├── docs/       # API testing docs and Postman files
└── package.json
```

## Getting Started

### 1. Prerequisites
- Node.js (v16 or higher)
- MongoDB (Local or Atlas)

### 2. Installation
Run the following command in the root directory to install dependencies for both frontend and backend:
```bash
npm install
```

### 3. Environment Configuration
The backend requires a `.env` file to connect to the database.
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Open the new `.env` file and replace the `MONGO_URI` placeholder with your actual MongoDB connection string.

### 4. Running the Application
Return to the root directory and run:
```bash
npm run dev
```
This will start both the frontend and backend servers concurrently.

## Project Layout

```text
career-guide-pro-main/
├── frontend/   # Vite + React client
├── backend/    # Express API
├── database/   # MongoDB models and seed scripts
├── docs/       # Documentation and API testing
└── package.json
```

## Common Commands

| Command | Description |
| --- | --- |
| `npm install` | Install all dependencies |
| `npm run dev` | Run full application (Frontend + Backend) |
| `npm run dev:frontend` | Run only the frontend |
| `npm run dev:backend` | Run only the backend |
| `npm run seed` | Import initial college data to MongoDB |
| `npm test` | Run backend tests |
