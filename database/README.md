# Database Layer

This folder contains the MongoDB-related files for Career Guide Pro.

## Contents

- `config/` database connection helpers
- `models/` Mongoose schemas
- `scripts/` seed and import scripts
- `services/` official CET Cell parsing/import services
- `data/` generated JSON snapshots from official imports

## Environment

Database scripts read environment variables from `backend/.env` so the application and import scripts use the same MongoDB connection.
