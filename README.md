# SmartMeal - Intelligent Indian Meal Planner

SmartMeal is a unified, single-repository web application containing a React 19 frontend and a Node.js/Express API server designed for intelligent Indian meal scheduling, macro tracking, food library management, and AI-assisted recipe suggestions.

---
## 🚀 Implemented Features

### Core Features
- **Today's Schedule**: 5 meal sections (**Pre-Breakfast**, **Breakfast**, **Mid-morning Snacks**, **Lunch**, **Dinner**) with item completion toggles and calorie progress.
- **Planner**: Monthly calendar view with indicators and date-by-date daily view navigation.
- **Food Library**: Full CRUD management of Indian dishes with ingredients and macros.
- **AI Assistant**: Recipe chat assistant and mock food photo scanner with confirmation modal.
- **Responsive Layout**: Fixed mobile bottom navigation bar and desktop header.

---

## Architecture & Cognito Authentication

SmartMeal uses **AWS Cognito User Pools** with **Cognito Managed Login** (OAuth 2.0 Authorization Code Grant + PKCE) for user authentication and session management.

For complete, step-by-step AWS Console creation instructions, see the [Cognito User Pool Setup Guide](docs/cognito-user-pool-setup.md).

```
+-----------------------------------------------------------------------------------+
|                                  React SPA (Vite)                                 |
|                                                                                   |
|  [Login Page] ──(Redirect)──> [Cognito Managed Login / Hosted UI]                 |
|                                         │                                         |
|                                         ▼ (OAuth Code + PKCE)                     |
|  [AuthCallbackPage /auth/callback] ◄────┘                                         |
|         │                                                                         |
|         ▼ (Exchanges Code for Tokens & Restores Session)                          |
|  [AuthContext] ──(Stores Tokens & User State)                                     |
|         │                                                                         |
|         ▼ (Attaches Bearer JWT Access Token)                                      |
|  apiClient.get('/auth/me') ──> [Express Server] ──> [requireAuth Middleware]     |
|                                                             │                     |
|                                                             ▼                     |
|                                                  [aws-jwt-verify Validation]      |
+-----------------------------------------------------------------------------------+

---



## 📡 API Endpoint Summary Table

| HTTP Method | Endpoint Path | Auth Protection | Current State | Future AWS Integration |
|---|---|---|---|---|
| `GET` | `/api/health` | **Public** | Active (HTTP 200 OK) | **AWS ALB Target Group** health check |
| `GET` | `/api/auth/me` | **Protected (Cognito JWT)** | Active (Verified User Payload) | **AWS Cognito User Pools** JWT Claims |
| `GET` | `/api/foods` | Public / Mock | Active Placeholder (In-memory) | **DynamoDB** `smartmeal-foods` table |
| `POST` | `/api/foods` | Public / Mock | Active Placeholder (In-memory) | **DynamoDB** PutItem Command |
| `PUT` | `/api/foods/:id` | Public / Mock | Active Placeholder (In-memory) | **DynamoDB** UpdateItem Command |
| `DELETE` | `/api/foods/:id` | Public / Mock | Active Placeholder (In-memory) | **DynamoDB** DeleteItem Command |
| `GET` | `/api/plans?date=YYYY-MM-DD` | Public / Mock | Active Placeholder (In-memory) | **DynamoDB** `smartmeal-plans` query |
| `POST` | `/api/plans` | Public / Mock | Active Placeholder (In-memory) | **DynamoDB** PutItem Command |
| `PATCH` | `/api/plans/:id/complete` | Public / Mock | Active Placeholder (In-memory) | **DynamoDB** UpdateItem Command |
| `DELETE` | `/api/plans/:id` | Public / Mock | Active Placeholder (In-memory) | **DynamoDB** DeleteItem Command |
| `POST` | `/api/uploads/presign` | Public / Mock | Active Placeholder | **AWS S3** Presigned URL |
| `GET` | `/api/google/connect` | Public / Mock | Active Placeholder | **Google OAuth 2.0** Authorization URL |

---

## 🧪 Testing Steps

### 1. Local Development Execution
```bash
# Run client (5173) and Express server (3000) concurrently
npm run dev
```

### 2. Testing Public Health Endpoint
```bash
curl http://localhost:3000/api/health
# Returns HTTP 200 OK with {"status": "healthy", "service": "smartmeal-api", ...}
```

### 3. Testing Protected `/api/auth/me` Endpoint
```bash
# Unauthenticated request (Fails with 401 Unauthorized)
curl http://localhost:3000/api/auth/me
# Returns HTTP 401 Unauthorized: {"success":false,"error":{"message":"Authorization header missing or invalid..."}, ...}

# Authenticated request (With Cognito Access Token)
curl -H "Authorization: Bearer <COGNITO_ACCESS_TOKEN>" http://localhost:3000/api/auth/me
# Returns HTTP 200 OK with verified Cognito user payload
```
