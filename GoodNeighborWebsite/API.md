# API Documentation

This app only uses the login and clients flows. The old template `users`, `posts`, and `health` endpoints are not part of the current app.

## Environment Variables

Create a `.env.local` file in the project root:

```env
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
DB_PORT=3306
DB_SSL=true
AUTH_SECRET=replace-with-a-long-random-secret
NEXTAUTH_URL=https://your-app-url
NEXT_PUBLIC_API_URL=/api
```

## Authentication

The app uses an HTTP-only `authToken` cookie for login sessions.

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

Request body:

```json
{
  "username": "staffuser",
  "password": "password",
  "role": "Director"
}
```

### Current User

```http
GET /api/auth/me
```

Returns the logged-in user from the `authToken` cookie.

### Logout

```http
POST /api/auth/logout
```

Clears the `authToken` cookie.

## Clients

These routes power the clients directory and client profile pages.

### Client List

```http
GET /api/clients?limit=100&offset=0&q=smith
```

Returns a paginated list of clients.

### Client Profile

```http
GET /api/clients/1
```

Returns the full dashboard payload for a single client.

## Notes

- Keep `NEXT_PUBLIC_API_URL=/api` unless you are intentionally routing to a different API host.
- Add secrets in Azure App Service settings for production deployments instead of committing them to the repo.
