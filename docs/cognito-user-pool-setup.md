# Amazon Cognito User Pool Setup Guide for SmartMeal

This guide provides step-by-step, beginner-friendly instructions for creating and configuring an Amazon Cognito User Pool for the SmartMeal application.

---

## 1. Purpose

SmartMeal uses Amazon Cognito User Pools (referred to in the modern AWS Console as a **"user directory"**) for identity and access management.

- **Authentication Management**: Cognito manages user signup, login, password hashing/security, email verification, and token issuance.
- **Security Best Practices**: Passwords are saved securely within Amazon Cognito. **DynamoDB must never store raw or hashed user passwords.**
- **Token-Based Access Control**: Upon successful login, Cognito issues JSON Web Tokens (JWTs) that the React SPA uses to authenticate API requests to the Express backend.

---

## 2. Architecture Flow

```text
React Login Screen
  ↓
Cognito Managed Login
  ↓
Cognito returns access and ID tokens
  ↓
React sends access token in Authorization header
  ↓
Express verifies JWT
  ↓
Future DynamoDB records use Cognito user sub as userId
```

---

## 3. Prerequisites

Before beginning setup in the AWS Console, ensure you have:

- An active **AWS Account**.
- **AWS Management Console Access** with sufficient IAM permissions to create and manage Cognito User Pools (`AmazonCognitoPowerUser` or `AdministratorAccess`).
- Target AWS Region: **`ap-south-1` (Asia Pacific - Mumbai)**.
- Local Node.js application running at `http://localhost:5173`.

---

## 4. Step-by-Step AWS Console Setup

In the AWS Console, navigate to **Cognito** (or search for "User directories").

Follow these exact configuration settings when creating your Cognito User Pool / User Directory:

```text
Application type: Single-page application (SPA)
Application name: smartmeal-web
Sign-in identifier: Email only
Self-registration: Enabled
Required attribute: email
Client type: Public client
Client secret: None
OAuth flow: Authorization code grant
PKCE: Enabled
Scopes: openid, email, profile
MFA: Off for the portfolio development phase
```

---

## 5. Managed Login Configuration

During the App Client / Managed Login configuration step, specify the exact callback and sign-out URLs:

```text
Allowed callback URL:
http://localhost:5173/auth/callback

Default redirect URL:
http://localhost:5173/auth/callback

Allowed sign-out URL:
http://localhost:5173/login
```

### Why Port 5173 is Used Locally
Vite's default development web server listens on port `5173`. Because OAuth 2.0 PKCE strict security policies check exact string matches, the redirect URIs in Cognito must match `http://localhost:5173/auth/callback` and `http://localhost:5173/login` character-for-character.

---

## 6. Cognito Domain Setup

Cognito Managed Login (Hosted UI) requires a custom domain prefix or Cognito domain.

In the User Pool settings under **App integration -> Domain**, choose a domain prefix (e.g., `smartmeal-app-auth`) or copy the system-generated domain name.

Expected domain format:
```text
https://your-domain.auth.ap-south-1.amazoncognito.com
```

---

## 7. Values to Record

After completing creation of the User Pool, record the following four key values:

```text
AWS Region
Cognito User Pool ID
Cognito App Client ID
Cognito Managed Login Domain
```

---

## 8. Local Code Configuration (`.env.local`)

In the root of your SmartMeal repository, populate or create `.env.local` using this template:

```env
VITE_COGNITO_REGION=ap-south-1
VITE_COGNITO_USER_POOL_ID=your_user_pool_id
VITE_COGNITO_CLIENT_ID=your_app_client_id
VITE_COGNITO_DOMAIN=https://your-cognito-domain.auth.ap-south-1.amazoncognito.com
VITE_COGNITO_REDIRECT_SIGN_IN=http://localhost:5173/auth/callback
VITE_COGNITO_REDIRECT_SIGN_OUT=http://localhost:5173/login
```

> [!IMPORTANT]
> - `.env.local` is listed in `.gitignore` to prevent secret/configuration leakage into version control.
> - `VITE_COGNITO_USER_POOL_ID` and `VITE_COGNITO_CLIENT_ID` are public client identifiers.
> - **Never expose AWS IAM access keys, secret keys, client secrets, Google secrets, or production credentials.**

---

## 9. Planned Code Integration

The following core files handle authentication within the application:

- **`src/config/cognito.js`**: Initializes and configures AWS Amplify (`Amplify.configure`) with Cognito User Pool and OAuth PKCE settings.
- **`src/services/cognitoAuthService.js`**: Service wrapper encapsulating sign-in, session retrieval, and token fetch calls.
- **`src/pages/AuthCallbackPage.jsx`**: Handles `/auth/callback` route to process OAuth code exchange and session restoration.
- **`src/context/AuthContext.jsx`**: Global React Context managing user authentication state, loading status, `signIn`, `signOut`, and `getAccessToken`.
- **`src/App.jsx`**: Configures React Router routes including `/login`, `/auth/callback`, and protected layout routes (`/today`, `/plan`, `/food-list`).
- **`server/middleware/requireAuth.js`**: Express middleware verifying `Authorization: Bearer <access_token>` headers using `aws-jwt-verify`.
- **`server/controllers/authController.js`**: Handles `/api/auth/me` requests and returns verified user payload claims.

---

## 10. API Protection

The backend handles request authentication as follows:

```text
GET /api/health → public for ALB Target Group checks
GET /api/auth/me → requires Cognito access token
/api/foods and /api/plans → will require Cognito access token
```

Frontend HTTP requests sent to protected API routes must include the Bearer token header:

```text
Authorization: Bearer <Cognito access token>
```

---

## 11. Troubleshooting

- **`CredentialsError` when creating user pool**: Sign out and sign back in to the AWS Management Console, try using an incognito/private browser window, or verify that your IAM user/role has sufficient Cognito administration permissions.
- **Callback URL Mismatch**: Ensure `http://localhost:5173/auth/callback` in `.env.local` matches the Allowed Callback URL in Cognito exactly (including protocol and port number).
- **Wrong AWS Region**: Confirm that `VITE_COGNITO_REGION` matches the region where the User Pool was created (`ap-south-1`).
- **Client Secret Error**: Ensure the App Client was created as a **Public Client** (without a client secret), as SPAs running in browser engines cannot securely store client secrets.
- **Missing Cognito Domain**: Verify that a domain prefix or custom domain has been assigned under the Cognito User Pool **App integration** tab.
- **User Not Verified**: Check if email verification is enabled or manually mark the user email as verified in the AWS Cognito Console under the **Users** tab.

---

## 12. Future Production Update

After deploying the SmartMeal application to production behind an AWS Application Load Balancer (ALB) or custom domain, update the Cognito Allowed Callback and Allowed Sign-out URLs:

```text
https://YOUR-ALB-DNS/auth/callback
https://YOUR-ALB-DNS/login
```

---

## 13. Summary

This documentation details the complete Cognito setup pipeline. For general project setup and application architecture, refer to `README.md`.
