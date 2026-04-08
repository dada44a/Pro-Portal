# Pro Portal Real Estate Auth + Favourites

## Overview

This project is a modern real-estate portal that provides a platform for buyers to browse properties and manage their favourites. It features a secure, session-based authentication system with automatic token refreshing.

The application includes:
- User registration and login.
- Secure session management (HttpOnly cookies + JWT).
- Automatic access token refresh without user interruption.
- Real-time dashboard with dynamic property listings.
- Functional "Favourites" system to save and remove properties.

---

## Tech Stack

### Frontend
- **Framework**: React (Vite-powered)
- **Routing**: TanStack Router
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS & DaisyUI
- **Notifications**: React Toastify

### Backend
- **Runtime**: Node.js
- **Framework**: Hono.js
- **ORM**: Drizzle ORM
- **Database**: SQLite
- **Validation**: Zod
- **Authentication**: JWT + Session Based with HttpOnly Cookie storage

---

## Features

### 1. Robust Authentication
- **Secure Login/Signup**: Passwords are hashed using `bcryptjs`.
- **Session Protection**: Uses `accessToken` (15m) and `refreshToken` (7d) stored in secure cookies.
- **Auto-Refresh**: Frontend automatically renews the session if the access token expires.
- **Protected Routes**: Redirection to login if unauthorized.

### 2. Buyer Dashboard
A personalized area showing:
- Welcome message with user details (username, email).
- Current user role.
- Real-time "Total Favourites" counter.

### 3. Property Management
- **Available Properties**: View all listed properties with location and price.
- **Favourites**: 
  - Add properties to your personal list.
  - Remove properties from your list with a single click.
  - Persistent storage in the backend database.

---

## Database Design (SQLite)

### Users Table
| Field | Type | Description |
| :--- | :--- | :--- |
| id | integer | Primary Key (Auto-increment) |
| firstName | text | User's first name |
| lastName | text | User's last name |
| username | text | Unique username |
| email | text | Unique email address |
| passwordHash | text | Hashed password |
| role | text | USER or ADMIN |

### Favourites Table
| Field | Type | Description |
| :--- | :--- | :--- |
| id | integer | Primary Key |
| userId | integer | Link to User id |
| propertyId | integer | ID of the property |

### Sessions Table
| Field | Type | Description |
| :--- | :--- | :--- |
| id | integer | Primary Key |
| userId | integer | Link to User id |
| refreshToken | text | Long-lived token |
| accessToken | text | Short-lived token |

---

##  Setup & Installation

### 1. Prerequisites
- Node.js installed.
- Git installed.

```bash
git clone <url-below>
http: https://github.com/dada44a/Pro-Portal.git
ssh: git@github.com:dada44a/Pro-Portal.git

```


### 2. Environment Variables
Create a `.env`file in the `client` directory:
```env
VITE_API_URL=http://localhost:4000/api
```

Create a `.env` file in the `server` directory:
```env
PORT=4000
JWT_SECRET=your_jwt_secret_key
ORIGIN=http://localhost:3000
```

### 3. Run Backend
```bash
cd server
npm install
npx drizzle-kit push
npm run dev
```

### 4. Run Frontend
```bash
cd client
npm install
npm run dev
```
The app will be available at `http://localhost:3000`.

---

##  API Endpoints

### Auth
- `POST /api/auth/register` - Create a new account
- `POST /api/auth/login` - Authenticate and get cookies
- `GET /api/auth/refresh` - Renew access token
- `DELETE /api/auth/logout` - End session

### User
- `GET /api/user/me` - Get current user

### Properties & Favourites
- `GET /api/property` - List all properties
- `GET /api/favourites` - Get user's favourites
- `POST /api/favourites` - Add to favourites
- `DELETE /api/favourites/:id` - Remove from favourites

---

##  Author
- **Anish Ghimire**
