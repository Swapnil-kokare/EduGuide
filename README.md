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

## Common Commands

Run these from the repository root:

```bash
npm install
npm run dev:all
npm run dev:frontend
npm run dev:backend
npm run build
npm run test
npm run seed
```

## Notes

- `npm install` at the repo root now installs dependencies for both `frontend` and `backend`.
- Backend environment variables stay in `backend/.env`.
- Official CET Cell snapshots live in `database/data`.
- Postman assets live in `docs/postman`.
