# GameLog API Documentation

## Overview

GameLog is a RESTful API for managing video games and user gaming experiences. Users can track games they've played, rate them, log hours played, and write reviews.

**Base URL:** `http://localhost:5000`

**Version:** 1.0.0

---

## Table of Contents

- [Authentication](#authentication)
- [Data Models](#data-models)
- [Endpoints](#endpoints)
  - [Authentication](#authentication-endpoints)
  - [Games](#games-endpoints)
  - [Experiences](#experiences-endpoints)
- [Error Handling](#error-handling)
- [Examples](#examples)

---

## Authentication

The API uses JWT (JSON Web Token) for authentication. After successful login or registration, you'll receive a token that must be included in subsequent requests.

### Headers

```
Authorization: Bearer <your-jwt-token>
```

### Token Structure

The JWT token contains:
- `id`: User ID
- `role`: User role (admin or user)

---

## Data Models

### User

```javascript
{
  "_id": "ObjectId",
  "username": "string (required, unique)",
  "email": "string (required, unique, lowercase)",
  "password": "string (required, hashed)",
  "role": "string (enum: ['admin', 'user'], default: 'user')",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Game

```javascript
{
  "_id": "ObjectId",
  "title": "string (required)",
  "description": "string (required, min length: 10)",
  "genre": "string",
  "platform": ["string"],
  "releaseDate": "Date",
  "coverImage": "string (URL, required)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Experience

```javascript
{
  "_id": "ObjectId",
  "user": "ObjectId (ref: User, required)",
  "game": "ObjectId (ref: Game, required)",
  "hoursPlayed": "number (default: 0)",
  "rating": "number (min: 0, max: 10)",
  "review": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## Endpoints

## Authentication Endpoints

### Register User

Creates a new user account.

**Endpoint:** `POST /api/auth/register`

**Authentication:** Not required

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (201):**

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400):**

```json
{
  "message": "Email already exists"
}
```

---

### Login

Authenticates a user and returns a JWT token.

**Endpoint:** `POST /api/auth/login`

**Authentication:** Not required

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**

```json
{
  "message": "Invalid credentials"
}
```

---

## Games Endpoints

### Create Game

Creates a new game entry.

**Endpoint:** `POST /api/game`

**Authentication:** Required (Admin only)

**Request Body:**

```json
{
  "title": "The Legend of Zelda: Breath of the Wild",
  "description": "An open-world action-adventure game set in a fantasy version of Hyrule",
  "genre": "Action-Adventure",
  "platform": ["Nintendo Switch", "Wii U"],
  "releaseDate": "2017-03-03",
  "coverImage": "https://example.com/zelda-cover.jpg"
}
```

**Success Response (201):**

```json
{
  "message": "Game created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "The Legend of Zelda: Breath of the Wild",
    "description": "An open-world action-adventure game set in a fantasy version of Hyrule",
    "genre": "Action-Adventure",
    "platform": ["Nintendo Switch", "Wii U"],
    "releaseDate": "2017-03-03T00:00:00.000Z",
    "coverImage": "https://example.com/zelda-cover.jpg",
    "createdAt": "2024-02-10T10:30:00.000Z",
    "updatedAt": "2024-02-10T10:30:00.000Z"
  }
}
```

**Error Response (403):**

```json
{
  "message": "Forbidden"
}
```

---

### Get All Games

Retrieves all games.

**Endpoint:** `GET /api/game`

**Authentication:** Required

**Success Response (200):**

```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "The Legend of Zelda: Breath of the Wild",
      "description": "An open-world action-adventure game set in a fantasy version of Hyrule",
      "genre": "Action-Adventure",
      "platform": ["Nintendo Switch", "Wii U"],
      "releaseDate": "2017-03-03T00:00:00.000Z",
      "coverImage": "https://example.com/zelda-cover.jpg",
      "createdAt": "2024-02-10T10:30:00.000Z",
      "updatedAt": "2024-02-10T10:30:00.000Z"
    }
  ]
}
```

**Error Response (500):**

```json
{
  "message": "Error fetching games"
}
```

---

### Get Game by ID

Retrieves a specific game by ID.

**Endpoint:** `GET /api/game/:id`

**Authentication:** Required

**URL Parameters:**
- `id`: Game ObjectId

**Success Response (200):**

```json
{
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "The Legend of Zelda: Breath of the Wild",
    "description": "An open-world action-adventure game set in a fantasy version of Hyrule",
    "genre": "Action-Adventure",
    "platform": ["Nintendo Switch", "Wii U"],
    "releaseDate": "2017-03-03T00:00:00.000Z",
    "coverImage": "https://example.com/zelda-cover.jpg",
    "createdAt": "2024-02-10T10:30:00.000Z",
    "updatedAt": "2024-02-10T10:30:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "message": "Game not found"
}
```

---

### Update Game

Updates an existing game.

**Endpoint:** `PUT /api/game/:id`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `id`: Game ObjectId

**Request Body:**

```json
{
  "title": "The Legend of Zelda: Breath of the Wild (Updated)",
  "description": "Updated description",
  "genre": "Action-Adventure",
  "platform": ["Nintendo Switch"],
  "releaseDate": "2017-03-03",
  "coverImage": "https://example.com/zelda-new-cover.jpg"
}
```

**Success Response (200):**

```json
{
  "message": "Game updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "The Legend of Zelda: Breath of the Wild (Updated)",
    "description": "Updated description",
    "genre": "Action-Adventure",
    "platform": ["Nintendo Switch"],
    "releaseDate": "2017-03-03T00:00:00.000Z",
    "coverImage": "https://example.com/zelda-new-cover.jpg",
    "createdAt": "2024-02-10T10:30:00.000Z",
    "updatedAt": "2024-02-10T11:00:00.000Z"
  }
}
```

---

### Delete Game

Deletes a game.

**Endpoint:** `DELETE /api/game/:id`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `id`: Game ObjectId

**Success Response (200):**

```json
{
  "message": "Game deleted successfully"
}
```

**Error Response (404):**

```json
{
  "message": "Game not found"
}
```

---

## Experiences Endpoints

### Create Experience

Creates a new gaming experience for the authenticated user.

**Endpoint:** `POST /api/experience`

**Authentication:** Required

**Request Body:**

```json
{
  "game": "507f1f77bcf86cd799439011",
  "hoursPlayed": 45,
  "rating": 9.5,
  "review": "An absolutely incredible game with stunning visuals and engaging gameplay."
}
```

**Success Response (201):**

```json
{
  "_id": "507f191e810c19729de860ea",
  "user": "507f1f77bcf86cd799439012",
  "game": "507f1f77bcf86cd799439011",
  "hoursPlayed": 45,
  "rating": 9.5,
  "review": "An absolutely incredible game with stunning visuals and engaging gameplay.",
  "createdAt": "2024-02-10T12:00:00.000Z",
  "updatedAt": "2024-02-10T12:00:00.000Z"
}
```

**Error Response (400):**

```json
{
  "message": "Invalid game ID"
}
```

---

### Get All Experiences

Retrieves all gaming experiences.

**Endpoint:** `GET /api/experience`

**Authentication:** Required

**Success Response (200):**

```json
[
  {
    "_id": "507f191e810c19729de860ea",
    "user": {
      "_id": "507f1f77bcf86cd799439012",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "game": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "The Legend of Zelda: Breath of the Wild",
      "coverImage": "https://example.com/zelda-cover.jpg"
    },
    "hoursPlayed": 45,
    "rating": 9.5,
    "review": "An absolutely incredible game with stunning visuals and engaging gameplay.",
    "createdAt": "2024-02-10T12:00:00.000Z",
    "updatedAt": "2024-02-10T12:00:00.000Z"
  }
]
```

---

### Get Experiences by User

Retrieves all experiences for a specific user.

**Endpoint:** `GET /api/experience/user/:userId`

**Authentication:** Required

**URL Parameters:**
- `userId`: User ObjectId

**Success Response (200):**

```json
[
  {
    "_id": "507f191e810c19729de860ea",
    "user": "507f1f77bcf86cd799439012",
    "game": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "The Legend of Zelda: Breath of the Wild"
    },
    "hoursPlayed": 45,
    "rating": 9.5,
    "review": "An absolutely incredible game with stunning visuals and engaging gameplay.",
    "createdAt": "2024-02-10T12:00:00.000Z",
    "updatedAt": "2024-02-10T12:00:00.000Z"
  }
]
```

---

### Get Experiences by Game

Retrieves all experiences for a specific game.

**Endpoint:** `GET /api/experience/game/:gameId`

**Authentication:** Required

**URL Parameters:**
- `gameId`: Game ObjectId

**Success Response (200):**

```json
[
  {
    "_id": "507f191e810c19729de860ea",
    "user": {
      "_id": "507f1f77bcf86cd799439012",
      "username": "johndoe"
    },
    "game": "507f1f77bcf86cd799439011",
    "hoursPlayed": 45,
    "rating": 9.5,
    "review": "An absolutely incredible game with stunning visuals and engaging gameplay.",
    "createdAt": "2024-02-10T12:00:00.000Z",
    "updatedAt": "2024-02-10T12:00:00.000Z"
  }
]
```

---

### Update Experience

Updates an existing experience.

**Endpoint:** `PUT /api/experience/:id`

**Authentication:** Required

**URL Parameters:**
- `id`: Experience ObjectId

**Request Body:**

```json
{
  "hoursPlayed": 60,
  "rating": 10,
  "review": "After spending more time, this is now my favorite game of all time!"
}
```

**Success Response (200):**

```json
{
  "_id": "507f191e810c19729de860ea",
  "user": "507f1f77bcf86cd799439012",
  "game": "507f1f77bcf86cd799439011",
  "hoursPlayed": 60,
  "rating": 10,
  "review": "After spending more time, this is now my favorite game of all time!",
  "createdAt": "2024-02-10T12:00:00.000Z",
  "updatedAt": "2024-02-10T13:00:00.000Z"
}
```

**Error Response (404):**

```json
{
  "message": "Experience not found"
}
```

---

### Delete Experience

Deletes an experience.

**Endpoint:** `DELETE /api/experience/:id`

**Authentication:** Required

**URL Parameters:**
- `id`: Experience ObjectId

**Success Response (200):**

```json
{
  "message": "Experience deleted successfully"
}
```

**Error Response (404):**

```json
{
  "message": "Experience not found"
}
```

---

## Error Handling

### Common HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Error Response Format

```json
{
  "message": "Error description"
}
```

### Authentication Errors

**Missing Authorization Header:**
```json
{
  "message": "Authorization header missing"
}
```

**Missing Token:**
```json
{
  "message": "Token missing"
}
```

**Invalid/Expired Token:**
```json
{
  "message": "Invalid or expired token"
}
```

**Insufficient Permissions:**
```json
{
  "message": "Forbidden"
}
```

---

## Examples

### Complete Workflow Example

#### 1. Register a new user

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "gamer123",
    "email": "gamer@example.com",
    "password": "mySecurePass123"
  }'
```

#### 2. Login to get token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gamer@example.com",
    "password": "mySecurePass123"
  }'
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 3. Get all games (using token)

```bash
curl -X GET http://localhost:5000/api/game \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 4. Create a gaming experience

```bash
curl -X POST http://localhost:5000/api/experience \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "game": "507f1f77bcf86cd799439011",
    "hoursPlayed": 25,
    "rating": 8.5,
    "review": "Great game, really enjoying the story!"
  }'
```

#### 5. Get your experiences

```bash
curl -X GET http://localhost:5000/api/experience/user/YOUR_USER_ID \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Environment Variables

Required environment variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gamelog
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

---

## CORS Configuration

The API is configured to accept requests from:
- Origin: `http://localhost:3000`
- Methods: `GET`, `POST`, `PUT`, `DELETE`
- Credentials: Enabled

---

## Notes

- All timestamps are in ISO 8601 format
- All dates are stored as JavaScript Date objects
- Passwords are hashed before storage (never stored in plain text)
- Admin operations (create, update, delete games) require admin role
- User role is assigned by default on registration
- Rating values must be between 0 and 10
- Game descriptions must be at least 10 characters long
