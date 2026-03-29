# Career Guidance Backend

A Node.js backend for the Career Guidance and College Predictor System.

## Features

- College prediction based on score, category, branch, and city
- Feedback collection
- College data management
- Official CET Cell college catalog import for A.Y. 2025-26
- CORS enabled
- Input validation
- Error handling

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- Express Validator for validation
- CORS for cross-origin requests

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MongoDB (local or cloud)

4. Update .env file with your MongoDB URI if needed

5. Start the server:
   ```bash
   npm run dev  # for development
   npm start    # for production
   ```

## Data Imports

Database models, snapshots, and import scripts now live in the top-level `database/` folder. The backend package still exposes helper scripts to run those imports.

```bash
npm run import:official-colleges -- --skip-db
```

Use `--skip-db` to only generate the JSON snapshot in `database/data/official-colleges-2025-26.json`.
If your MongoDB server is running, omit `--skip-db` and the importer will replace the `officialcolleges` collection with the latest fetched data.

## API Endpoints

### POST /api/predict
Predict colleges based on user criteria.

**Request Body:**
```json
{
  "score": 85.5,
  "category": "OPEN",
  "branch": "Computer Science",
  "city": "Mumbai"
}
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

### POST /api/feedback
Submit user feedback.

**Request Body:**
```json
{
  "rating": 5,
  "message": "Great service!"
}
```

### GET /api/colleges
Get all colleges.

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 100
}
```

### GET /api/official-colleges
Get the official CET Cell college catalog.

**Optional Query Params:**
- `search`
- `district`
- `region`
- `courseName`
- `instituteCode`
- `page`
- `limit`

## Project Structure

```
backend/
├── controllers/
│   ├── collegeController.js
│   ├── feedbackController.js
│   ├── officialCollegeController.js
│   └── predictController.js
├── routes/
│   ├── colleges.js
│   ├── feedback.js
│   ├── index.js
│   ├── officialColleges.js
│   └── predict.js
├── services/
│   ├── predictionLogic.js
│   └── predictionService.js
├── .env
├── package.json
├── README.md
└── server.js
```
