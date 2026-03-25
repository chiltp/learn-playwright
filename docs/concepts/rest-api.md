# REST API

## What is a REST API?

An API is a counter between you (the client) and the kitchen (the server). You make a request, the kitchen processes it, and hands back a response. You never go into the kitchen — you just talk to the counter.

**REST** is a set of rules for how that conversation works over the internet, using URLs and HTTP methods.

## HTTP Methods

| Method | Action | Example |
|---|---|---|
| **GET** | Read / fetch data | Get list of users |
| **POST** | Create new data | Create a new user |
| **PUT** | Update existing data | Update user's email |
| **DELETE** | Remove data | Delete a user |

## Status Codes

| Code | Meaning |
|---|---|
| **200** | OK — here's your data |
| **201** | Created — new thing made |
| **400** | Bad Request — you asked wrong |
| **404** | Not Found — doesn't exist |
| **429** | Too Many Requests — rate limited |
| **500** | Server Error — their fault |

## Endpoints

An endpoint is a specific URL for a specific resource:

```
GET    /pastries         → list all pastries
GET    /pastries/42      → get pastry #42
POST   /pastries         → create a new pastry
PUT    /pastries/42      → update pastry #42
DELETE /pastries/42      → delete pastry #42
```

The **URL** identifies *what*, the **method** identifies *the action*.

## Request & Response Structure

A **request** has:
- **URL** — where to send it (`https://api.example.com/users`)
- **Method** — what to do (GET, POST, etc.)
- **Headers** — extra info (like "I accept JSON", or an auth token)
- **Body** — data you're sending (only for POST/PUT)

```json
// POST request body
{
  "name": "Almond Croissant",
  "quantity": 2
}
```

A **response** has:
- **Status code** — 200, 201, 404, etc.
- **Headers** — metadata about the response
- **Body** — the actual data (usually JSON)

```json
// Response body
{
  "id": 42,
  "name": "Almond Croissant",
  "quantity": 2,
  "status": "ready"
}
```

## JSON

JSON (JavaScript Object Notation) is how APIs send data back and forth:

```json
{
  "id": 1,
  "title": "Buy groceries",
  "completed": false,
  "tags": ["shopping", "food"]
}
```

Key rules:
- Keys must be in double quotes (`"name"`, not `name`)
- Strings use double quotes (`"hello"`, not `'hello'`)
- Can contain: strings, numbers, booleans, arrays, objects, null

## Authentication

| Method | How it works |
|---|---|
| **API Key** | Pass a secret key in the header |
| **Bearer Token** | Pass a token from login |
| **No auth** | Public API, anyone can use |

## Idempotency

Doing it twice has the same effect as doing it once:

| Method | Idempotent? | Why |
|---|---|---|
| GET | Yes | Reading twice doesn't change anything |
| PUT | Yes | Updating to "almond" twice still results in "almond" |
| DELETE | Yes | Deleting #42 twice — it's still gone |
| POST | No | Placing the same order twice creates two orders |

This matters for testing — if a test fails and retries, idempotent methods are safe. POST might create duplicate data.
