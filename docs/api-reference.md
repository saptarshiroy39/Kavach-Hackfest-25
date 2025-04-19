# API Reference

This document provides detailed information about the Project Hackfest-25 API endpoints.

## Base URL

For local development: `http://localhost:5000/api`
For production: `https://your-production-domain.com/api`

## Authentication

Most API endpoints require authentication. Include a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

To obtain a token, use the authentication endpoints described below.

## Error Handling

The API uses standard HTTP response codes:
- 200: Success
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Server error

Error responses have the following format:
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## API Endpoints

### Authentication

#### Register New User

```
POST /auth/register
```

Request body:
```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "60a12b56c98f2a3e4c5d6e7f",
    "username": "user123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Login

```
POST /auth/login
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60a12b56c98f2a3e4c5d6e7f",
    "username": "user123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Verify Two-Factor Authentication

```
POST /auth/verify-2fa
```

Request body:
```json
{
  "userId": "60a12b56c98f2a3e4c5d6e7f",
  "token": "123456"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "verified": true
}
```

### Users

#### Get Current User

```
GET /users/me
```

Response:
```json
{
  "user": {
    "id": "60a12b56c98f2a3e4c5d6e7f",
    "username": "user123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin",
    "lastLogin": "2025-04-19T10:30:00Z"
  }
}
```

#### Update User

```
PUT /users/:id
```

Request body:
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com"
}
```

Response:
```json
{
  "message": "User updated successfully",
  "user": {
    "id": "60a12b56c98f2a3e4c5d6e7f",
    "username": "user123",
    "email": "john.smith@example.com",
    "firstName": "John",
    "lastName": "Smith"
  }
}
```

### Security Events

#### Log Security Event

```
POST /security/events
```

Request body:
```json
{
  "eventType": "LOGIN_ATTEMPT",
  "severity": "medium",
  "source": "192.168.1.100",
  "details": {
    "username": "user123",
    "success": false,
    "reason": "invalid_password"
  }
}
```

Response:
```json
{
  "message": "Security event logged successfully",
  "event": {
    "id": "60e45d78f92a1b3c4d5e6f7g",
    "eventType": "LOGIN_ATTEMPT",
    "severity": "medium",
    "source": "192.168.1.100",
    "timestamp": "2025-04-19T14:30:00Z",
    "userId": "60a12b56c98f2a3e4c5d6e7f",
    "details": {
      "username": "user123",
      "success": false,
      "reason": "invalid_password"
    }
  },
  "blockchainReceipt": {
    "eventId": "0x1234...",
    "transactionHash": "0xabcd..."
  }
}
```

#### Get Security Events

```
GET /security/events
```

Query parameters:
- `startDate`: ISO date string for filtering events after this date
- `endDate`: ISO date string for filtering events before this date
- `eventType`: Filter by event type
- `severity`: Filter by severity level
- `page`: Page number (default: 1)
- `limit`: Number of results per page (default: 20)

Response:
```json
{
  "events": [
    {
      "id": "60e45d78f92a1b3c4d5e6f7g",
      "eventType": "LOGIN_ATTEMPT",
      "severity": "medium",
      "source": "192.168.1.100",
      "timestamp": "2025-04-19T14:30:00Z",
      "userId": "60a12b56c98f2a3e4c5d6e7f",
      "details": {
        "username": "user123",
        "success": false,
        "reason": "invalid_password"
      }
    },
    {
      "id": "60e45d78f92a1b3c4d5e6f7h",
      "eventType": "DATA_ACCESS",
      "severity": "high",
      "source": "192.168.1.101",
      "timestamp": "2025-04-19T14:35:00Z",
      "userId": "60a12b56c98f2a3e4c5d6e7f",
      "details": {
        "resourceId": "sensitive-file-123",
        "accessType": "read"
      }
    }
  ],
  "pagination": {
    "total": 156,
    "page": 1,
    "pages": 8,
    "limit": 20
  }
}
```

### AI Threat Detection

#### Analyze Potential Threat

```
POST /security/analyze-threat
```

Request body:
```json
{
  "events": [
    {
      "eventType": "LOGIN_ATTEMPT",
      "source": "192.168.1.100",
      "timestamp": "2025-04-19T14:30:00Z",
      "details": {
        "username": "user123",
        "success": false
      }
    },
    {
      "eventType": "LOGIN_ATTEMPT",
      "source": "192.168.1.100",
      "timestamp": "2025-04-19T14:31:00Z",
      "details": {
        "username": "user123",
        "success": false
      }
    }
  ]
}
```

Response:
```json
{
  "threatAnalysis": {
    "isThreat": true,
    "confidence": 0.89,
    "riskLevel": "medium",
    "category": "brute_force_attempt",
    "recommendedActions": [
      "temporary_ip_block",
      "notify_admin"
    ]
  }
}
```

#### Detect Anomalies

```
POST /security/detect-anomalies
```

Request body:
```json
{
  "userId": "60a12b56c98f2a3e4c5d6e7f",
  "timeframe": "24h"
}
```

Response:
```json
{
  "anomalyDetection": {
    "anomaliesDetected": true,
    "anomalies": [
      {
        "type": "unusual_access_time",
        "score": 0.94,
        "details": "Login at 3:42 AM, user typically active between 9 AM and 6 PM"
      },
      {
        "type": "unusual_resource_access",
        "score": 0.82,
        "details": "Accessed financial reports, not typically accessed by this user"
      }
    ],
    "recommendedActions": [
      "verify_user_identity",
      "enable_enhanced_monitoring"
    ]
  }
}
```

### Blockchain Integration

#### Verify Event Integrity

```
GET /blockchain/verify/:eventId
```

Response:
```json
{
  "verified": true,
  "blockchainInfo": {
    "eventId": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "blockNumber": 12345678,
    "timestamp": "2025-04-19T14:30:00Z",
    "transactionHash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
  },
  "eventData": {
    "id": "60e45d78f92a1b3c4d5e6f7g",
    "eventType": "LOGIN_ATTEMPT",
    "severity": "medium",
    "source": "192.168.1.100",
    "timestamp": "2025-04-19T14:30:00Z",
    "userId": "60a12b56c98f2a3e4c5d6e7f"
  }
}
```

#### Get Blockchain Audit Trail

```
GET /blockchain/audit-trail
```

Query parameters:
- `startDate`: ISO date string for filtering events after this date
- `endDate`: ISO date string for filtering events before this date
- `page`: Page number (default: 1)
- `limit`: Number of results per page (default: 20)

Response:
```json
{
  "auditTrail": [
    {
      "eventId": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "eventType": "LOGIN_ATTEMPT",
      "reporter": "0x9876543210fedcba9876543210fedcba9876543210",
      "timestamp": "2025-04-19T14:30:00Z",
      "blockNumber": 12345678,
      "transactionHash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
    },
    {
      "eventId": "0x2345678901abcdef2345678901abcdef2345678901abcdef2345678901abcdef",
      "eventType": "DATA_ACCESS",
      "reporter": "0x9876543210fedcba9876543210fedcba9876543210",
      "timestamp": "2025-04-19T14:35:00Z",
      "blockNumber": 12345679,
      "transactionHash": "0xbcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678901"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "pages": 3,
    "limit": 20
  }
}
```

## Webhooks

Project Hackfest-25 supports webhooks for real-time notifications of security events.

#### Register Webhook

```
POST /webhooks
```

Request body:
```json
{
  "url": "https://your-app.com/webhooks/security",
  "events": ["login_failure", "data_breach", "anomaly_detected"],
  "secret": "your_webhook_secret"
}
```

Response:
```json
{
  "id": "wh_123456789",
  "url": "https://your-app.com/webhooks/security",
  "events": ["login_failure", "data_breach", "anomaly_detected"],
  "status": "active",
  "created": "2025-04-19T14:30:00Z"
}
```

## Rate Limiting

API requests are rate-limited to prevent abuse. Current limits:
- 60 requests per minute for authenticated users
- 10 requests per minute for unauthenticated users

When rate limits are exceeded, the API will return a 429 Too Many Requests response with a Retry-After header.
