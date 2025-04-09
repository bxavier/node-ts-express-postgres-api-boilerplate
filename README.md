# Node.js Express TypeScript Boilerplate

A clean, well-structured boilerplate for building RESTful APIs with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- **TypeScript Support**
- **Express 5**
- **PostgreSQL with TypeORM**: Type-safe entity definitions and querying
- **Architecture Pattern**: Controller-Service-Repository pattern
- **Validation**: Zod Request validation
- **Error Handling**: Enhanced exception hierarchy with consistent responses
- **Logging**: Winston and Morgan
- **Security**: Helmet
- **API Documentation**: Swagger integration
- **Health Monitoring**: System health checks

## Project Structure

```
src/
├── database/            # Database connection and configuration
├── middlewares/         # Express middlewares
├── resources/           # API resources (controllers, services, entities)
│   └── user/            # User resource example
│       ├── user.controller.ts   # HTTP request handling
│       ├── user.service.ts      # Business logic
│       ├── user.entity.ts       # TypeORM entity definition
│       ├── user.interface.ts    # TypeScript interfaces
│       └── user.validation.ts   # Request validation schemas
├── utils/               # Utility functions, interfaces, and helpers
│   └── exceptions/      # Exception hierarchy for error handling
├── app.ts               # Express app configuration
└── index.ts             # Application entry point
```

## Architecture

This boilerplate follows a modular architecture:

1. **Controller**: HTTP requests and responses
2. **Service**: Business logic
3. **Entity**: Database schema and TypeORM mapping
4. **Interface**: TypeScript interfaces for data structures
5. **Validation**: Request validation with Zod

Each resource follows this pattern, providing clear separation of concerns.

## Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file:

   ```
   NODE_ENV=development
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=my_database
   ```

4. Create the required database schema:

   ```sql
   -- Run this in your PostgreSQL database
   CREATE SCHEMA auth;

   CREATE TABLE auth.users (
     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
     name character varying,
     email character varying UNIQUE NOT NULL,
     password character varying NOT NULL,
     role character varying DEFAULT 'user',
     "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
     "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
   );

   -- Enable UUID generation
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

### Running the Application

Development mode:

```
npm run dev
```

Production build:

```
npm run build
npm start
```

## Example Resource

Complete User resource:

- `user.controller.ts`: Route definitions and request handling
- `user.service.ts`: Business logic
- `user.entity.ts`: TypeORM entity definition
- `user.interface.ts`: TypeScript interfaces
- `user.validation.ts`: Zod validation schemas

This provides a comprehensive template for creating additional resources.

## Validation

Request validation is powered by Zod, ensuring data integrity:

```typescript
// Example validation
export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});
```

## API Documentation

The API is documented using Swagger annotations in controllers:

```typescript
/**
 * @openapi
 * /resource:
 *   get:
 *     summary: Get resources
 *     tags: [Resources]
 *     responses:
 *       200:
 *         description: Success
 */
```

Access the documentation at `http://localhost:3000/docs`

## Health Monitoring

The application includes a comprehensive health endpoint that provides system information:

- `/health` - Complete system health including:
  - Database connection status
  - CPU usage and cores
  - Memory utilization
  - Disk space
  - Application uptime
  - Node.js and Express versions

## Error Handling

The application uses a comprehensive exception hierarchy for consistent error handling:

```
ApiException                 // Base class for all API errors
├── HttpException            // Base for HTTP errors
    ├── ValidationException  // 400 - Validation errors
    ├── UnauthorizedException // 401 - Authentication required
    ├── ForbiddenException   // 403 - Permissions issues
    ├── NotFoundException    // 404 - Resource not found
    ├── ConflictException    // 409 - Resource conflicts
    └── ServerException      // 500 - Server errors
```

All errors return a consistent JSON response:

```json
{
  "status": 404,
  "message": "User not found",
  "code": "RESOURCE_NOT_FOUND",
  "errors": [...] // Optional details
}
```

## License

MIT
