# SmartMeal - Intelligent Indian Meal Planner

SmartMeal is a unified, single-repository web application containing a React 19 frontend and a Node.js/Express API server designed for intelligent Indian meal scheduling, macro tracking, food library management, and AI-assisted recipe suggestions.

---

## 🏗️ Phase 2A Architecture Overview

SmartMeal is structured as a **single-application repository** designed to be deployed together on an **AWS EC2** instance.

```
  +-------------------------------------------------------------+
  |                        React UI                             |
  |              (Vite Dev Port 5173 / Served from dist)         |
  +-------------------------------------------------------------+
                               |
                               |  /api requests (Vite Proxy in Dev / Same-Origin in Prod)
                               v
  +-------------------------------------------------------------+
  |                     Express API Server                      |
  |                        (Port 3000)                          |
  +-------------------------------------------------------------+
                               |
                               |  (Future Phase 2B Integrations)
                               v
  +-------------------------------------------------------------+
  |   AWS Cognito  |  DynamoDB  |  S3 Bucket  |  Google APIs    |
  +-------------------------------------------------------------+
```

---

## 🚀 Implemented Features (Phase 1 & Phase 2A)

### Phase 1 Frontend Features (Preserved & Functional)
- **Simulated Authentication**: Google login flow stored in LocalStorage.
- **Today's Schedule**: 5 meal sections (**Pre-Breakfast**, **Breakfast**, **Mid-morning Snacks**, **Lunch**, **Dinner**) with item completion toggles and calorie progress.
- **Planner**: Monthly calendar view with indicators and date-by-date daily view navigation.
- **Food Library**: Full CRUD management of Indian dishes with ingredients and macros.
- **AI Assistant**: Recipe chat assistant and mock food photo scanner with confirmation modal.
- **Responsive Layout**: Fixed mobile bottom navigation bar and desktop header.

### Phase 2A Backend Foundation Features
- **Express 5 Server Foundation**: Modular ES module structure in `server/`.
- **Health-Check Endpoint (`GET /api/health`)**: Returns system status, timestamp, and process uptime.
- **API Endpoint Placeholders**: Modular routes and controllers for foods, meal plans, auth, file upload presigns, and Google OAuth callbacks with explicit AWS TODO markers.
- **Standardized Middleware**: JSON body parsing, custom HTTP request logger, centralized error handling, and JSON 404 handler for unknown `/api/*` requests.
- **Vite Proxy & SPA Fallback**:
  - Development: Vite proxies `/api/*` to Express on `http://localhost:3000`.
  - Production: Express serves static assets from `dist/` and routes client non-API GET requests to `dist/index.html`.
- **Frontend API Client (`src/services/apiClient.js`)**: Centralized Fetch API wrapper supporting relative `/api` paths and standardized error handling.

---

## 📁 Complete Folder Structure

```
c:/Users/barat/Desktop/awspr/meal-planner/
├── index.html                  # HTML entry point
├── package.json                # Project scripts and dependencies
├── vite.config.js              # Vite config with Tailwind & /api proxy to port 3000
├── README.md                   # Project documentation & architecture
├── dist/                       # Vite production build output
├── server/                     # Express API Server Code
│   ├── index.js                # Express app entry point & static file server
│   ├── controllers/            # API request handlers & controllers
│   │   ├── authController.js
│   │   ├── foodController.js
│   │   ├── googleController.js
│   │   ├── healthController.js
│   │   ├── mealPlanController.js
│   │   └── uploadController.js
│   ├── middleware/             # Express middlewares
│   │   ├── errorHandler.js     # Centralized error handler
│   │   ├── loggerMiddleware.js # HTTP request logger
│   │   └── notFoundHandler.js  # JSON 404 handler for /api routes
│   └── routes/                 # Express route definitions
│       ├── authRoutes.js
│       ├── foodRoutes.js
│       ├── googleRoutes.js
│       ├── healthRoutes.js
│       ├── mealPlanRoutes.js
│       └── uploadRoutes.js
└── src/                        # React Frontend Code
    ├── App.jsx                 # Central Router & Providers
    ├── main.jsx                # React Entry Point
    ├── components/             # Reusable UI Components
    │   ├── AddMealModal.jsx
    │   ├── AiChatModal.jsx
    │   ├── CalendarView.jsx
    │   ├── ConfirmationModal.jsx
    │   ├── DailyPlanView.jsx
    │   ├── FoodFormModal.jsx
    │   ├── Header.jsx
    │   ├── MealCard.jsx
    │   ├── MealSection.jsx
    │   ├── Navigation.jsx
    │   └── ProtectedRoute.jsx
    ├── context/
    │   └── AuthContext.jsx
    ├── data/
    │   └── initialMockData.js
    ├── layouts/
    │   └── MainLayout.jsx
    ├── pages/
    │   ├── FoodListPage.jsx
    │   ├── LoginPage.jsx
    │   ├── PlanPage.jsx
    │   └── TodayPage.jsx
    ├── services/                # Service Layer & API abstraction
    │   ├── apiClient.js         # Fetch wrapper for /api HTTP endpoints
    │   ├── aiService.js         # AI Chef & photo scanner (Phase 2B TODOs)
    │   ├── authService.js       # Auth service (Phase 2B TODOs)
    │   ├── foodService.js       # Food service (Phase 2B TODOs)
    │   └── mealPlanService.js   # Meal plan service (Phase 2B TODOs)
    ├── styles/
    │   └── index.css            # Tailwind CSS & global styling
    └── utils/
        └── dateUtils.js         # Date calculation & matrix utilities
```

---

## 📡 API Endpoint Summary Table

| HTTP Method | Endpoint Path | Current Phase 2A State | Future AWS Integration |
|---|---|---|---|
| `GET` | `/api/health` | Active (Returns HTTP 200 JSON status) | **AWS ALB Target Group** health check |
| `GET` | `/api/foods` | Active Placeholder (Returns in-memory catalog) | **DynamoDB** `smartmeal-foods` table scan |
| `POST` | `/api/foods` | Active Placeholder (Adds food in-memory) | **DynamoDB** PutItem Command |
| `PUT` | `/api/foods/:id` | Active Placeholder (Updates food in-memory) | **DynamoDB** UpdateItem Command |
| `DELETE` | `/api/foods/:id` | Active Placeholder (Deletes food in-memory) | **DynamoDB** DeleteItem Command |
| `GET` | `/api/plans?date=YYYY-MM-DD` | Active Placeholder (Returns date plan) | **DynamoDB** `smartmeal-plans` query |
| `POST` | `/api/plans` | Active Placeholder (Adds plan item in-memory) | **DynamoDB** PutItem Command |
| `PATCH` | `/api/plans/:id/complete` | Active Placeholder (Toggles item in-memory) | **DynamoDB** UpdateItem Command |
| `DELETE` | `/api/plans/:id` | Active Placeholder (Deletes item in-memory) | **DynamoDB** DeleteItem Command |
| `GET` | `/api/auth/me` | Active Placeholder (Returns mock user) | **AWS Cognito User Pools** JWT validation |
| `POST` | `/api/uploads/presign` | Active Placeholder (Returns mock presigned URL) | **AWS S3** `s3-request-presigner` URL |
| `GET` | `/api/google/connect` | Active Placeholder (Returns mock auth URL) | **Google OAuth 2.0** Authorization URL |
| `GET` | `/api/google/callback` | Active Placeholder (Returns connected status) | **Google Calendar & Tasks API** token sync |

---

## 🏥 AWS Health Check Infrastructure Pipeline

In production deployment on AWS EC2:
```
  [User Traffic] 
        ↓
  AWS Application Load Balancer (ALB)
        ↓
  Target Group Health Checker ──(Pings every 30s)──> GET http://<EC2-Private-IP>:3000/api/health
        ↓
  EC2 Instance (SmartMeal Express App)
```
- The ALB Target Group routinely issues HTTP `GET /api/health` requests to port 3000.
- When the Express server responds with `HTTP 200 OK` and `"status": "healthy"`, the target is marked `InService` in the Auto Scaling Group.

---

## 💻 Development & Deployment Commands

```bash
# 1. Install dependencies
npm install

# 2. Run client (Vite on 5173) and server (Express on 3000) concurrently for local development
npm run dev

# 3. Run client dev server only
npm run dev:client

# 4. Run Express server only (with Node.js watch mode)
npm run dev:server

# 5. Build production bundle (Vite outputs to /dist)
npm run build

# 6. Run single Express server in production (Serves /dist + /api endpoints on port 3000)
npm run start

# 7. Lint check
npm run lint
```

---

## ⚙️ Vite Proxy & Production Serving Explanation

1. **Development Proxy**:
   - React components issue fetch requests to `/api/*`.
   - `vite.config.js` captures `/api` requests on `http://localhost:5173` and proxies them to the Express server running on `http://localhost:3000`.
   - Avoids CORS issues in development.

2. **Production Mode (`npm run start`)**:
   - Express runs on port 3000 and serves static production assets directly from `dist/`.
   - Direct requests to `/api/*` are handled by Express controllers.
   - Any client-side navigation route (e.g. `/today`, `/plan`, `/food-list`) returns `dist/index.html`, allowing React Router to render seamlessly.
   - Any unmatched `/api/*` endpoint returns a standardized JSON 404 response.

---

## 🛑 Intentionally Not Implemented in Phase 2A

- **No AWS SDK Dependencies**: AWS SDK for JavaScript v3 (Cognito, DynamoDB, S3) is not installed or executed yet.
- **No Active Cloud Connections**: Frontend components continue to use LocalStorage mock services for full offline usability.
- **No Real Secrets or `.env` Files**: Secret key management will be added when connecting real AWS credentials.
- **No External OAuth Workflows**: Google Sign-In remains simulated.

---

## 🔮 Next Planned Phase (Phase 2B: Cognito & DynamoDB Integration)

1. Connect `foodRoutes.js` and `mealPlanRoutes.js` to real **AWS DynamoDB** tables (`smartmeal-foods` & `smartmeal-plans`).
2. Migrate frontend mock services (`foodService.js`, `mealPlanService.js`) to `src/services/apiClient.js`.
3. Integrate **AWS Cognito User Pools** for user registration, authentication, and JWT authorization headers.
4. Implement S3 pre-signed URL generation for food photo uploads.
