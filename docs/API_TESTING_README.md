# API Testing Endpoints

The backend API server typically runs on `http://localhost:5000`. Below are all the available REST API endpoints for testing the application.

## 1. Health Check
Check if the API server is running correctly.
- **Endpoint**: `GET /api`
- **Response**:
  ```json
  {
      "success": true,
      "message": "Career Guidance API is running"
  }
  ```

## 2. Predict Colleges
Predict eligible colleges based on applicant's score, category, and preferred branch.
- **Endpoint**: `POST /api/predict`
- **Request Body**:
  ```json
  {
      "score": 85.5,
      "category": "OPEN",
      "branch": "Computer Engineering",
      "city": "Pune",
      "examType": "MHT-CET",
      "collegeType": "Any"
  }
  ```

Supported categories:
`OPEN`, `EWS`, `OBC`, `DT_VJ`, `NT1`, `NT2`, `NT3`, `SBC`, `SEBC`, `SC`, `ST`

## 3. Get All Colleges
Retrieve a list of all available colleges in the system.
- **Endpoint**: `GET /api/colleges`
- **Response**: Returns a JSON array of college objects.

## 4. Add a College
Add a new college with branch details and category-specific cutoffs to the database.
- **Endpoint**: `POST /api/colleges`
- **Request Body**:
  ```json
  {
      "collegeName": "Example Institute of Technology",
      "city": "Pune",
      "branch": "Information Technology",
      "categoryCutoff": {
          "OPEN": 88.5,
          "OBC": 82.0,
          "SC": 75.0,
          "ST": 70.0
      },
      "fees": 120000
  }
  ```

## 5. Submit Feedback
Submit user feedback or application ratings.
- **Endpoint**: `POST /api/feedback`
- **Request Body**:
  ```json
  {
      "rating": 5, // Integer between 1 and 5
      "message": "This predictor tool is very helpful!"
  }
  ```

---
**Note**: If you are testing via Postman or cURL, ensure your `Content-Type` header is set to `application/json` for `POST` requests.

## Postman Files

Import these two files into Postman for local testing:

- [Collection](C:\Users\swapn\Downloads\career-guide-pro-main (2)\career-guide-pro-main\docs\postman\CareerGuide.local.postman_collection.json)
- [Environment](C:\Users\swapn\Downloads\career-guide-pro-main (2)\career-guide-pro-main\docs\postman\CareerGuide.local.postman_environment.json)
