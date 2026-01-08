# API Endpoints Documentation

This document lists all available API endpoints in the application.

---

## Table of Contents

- [Authentication](#authentication)
- [Authorization](#authorization)
- [User Management](#user-management)
- [Property](#property)
- [Property Type](#property-type)
- [Province](#province)
- [Ward](#ward)
- [Price Reference](#price-reference)
- [Booking](#booking)
- [Wish](#wish)
- [Support](#support)
- [Chat](#chat)
- [Content Block](#content-block)
- [File](#file)
- [SSE (Server-Sent Events)](#sse-server-sent-events)
- [Statistic](#statistic)
- [OAuth2](#oauth2)

---

## Authentication

Base path: `/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login user |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout user |
| POST | `/auth/send-otp` | Send OTP |
| POST | `/auth/verify-otp` | Verify OTP |
| POST | `/auth/verify-email` | Verify email |
| POST | `/auth/register` | Register new user |
| POST | `/auth/change-password` | Change password |
| POST | `/auth/reset-password` | Reset password |
| GET | `/auth/me` | Get current user |
| POST | `/auth/me` | Update current user |
| GET | `/auth/me/permissions` | Get current user permission codes |

---

## OAuth2

Base path: `/oauth2`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/oauth2/authorize/{provider}` | Redirect to OAuth2 provider (e.g., Google) |

---

## Authorization

### Permission

Base path: `/permissions`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/permissions/all` | Get all permissions (paginated) |
| GET | `/permissions/{id}` | Get permission by ID |
| POST | `/permissions` | Create permission |
| PUT | `/permissions/{id}` | Update permission |
| DELETE | `/permissions/{id}` | Delete permission by ID |
| DELETE | `/permissions/bulk` | Delete multiple permissions |

### Role

Base path: `/roles`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/roles/all` | Get all roles (paginated) |
| GET | `/roles/{id}` | Get role by ID |
| POST | `/roles` | Create role |
| PUT | `/roles/{id}` | Update role |
| DELETE | `/roles/{id}` | Delete role by ID |
| DELETE | `/roles/bulk` | Delete multiple roles |

---

## User Management

Base path: `/users`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/all` | Get all users (paginated) |
| GET | `/users/{id}` | Get user by ID |
| POST | `/users` | Create user |
| PUT | `/users/{id}` | Update user |
| DELETE | `/users/{id}` | Delete user by ID |
| DELETE | `/users/bulk` | Delete multiple users |

---

## Property

Base path: `/properties`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/properties/all` | Get all properties (paginated) |
| GET | `/properties/{id}` | Get property by ID |
| POST | `/properties` | Create property |
| PUT | `/properties/{id}` | Update property |
| DELETE | `/properties/{id}` | Delete property by ID |
| DELETE | `/properties/bulk` | Delete multiple properties |
| GET | `/properties/similar/{id}` | Find similar properties |
| GET | `/properties/within-radius` | Find properties within radius |

---

## Property Type

Base path: `/property-types`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/property-types/all` | Get all property types (paginated) |
| GET | `/property-types/{id}` | Get property type by ID |
| POST | `/property-types` | Create property type |
| PUT | `/property-types/{id}` | Update property type |
| DELETE | `/property-types/{id}` | Delete property type by ID |
| DELETE | `/property-types/bulk` | Delete multiple property types |

---

## Province

Base path: `/provinces`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/provinces/all` | Get all provinces (paginated) |
| GET | `/provinces/{id}` | Get province by ID |
| POST | `/provinces` | Create province |
| PUT | `/provinces/{id}` | Update province |
| DELETE | `/provinces/{id}` | Delete province by ID |
| DELETE | `/provinces/bulk` | Delete multiple provinces |

---

## Ward

Base path: `/wards`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/wards/all` | Get all wards (paginated) |
| GET | `/wards/{id}` | Get ward by ID |
| POST | `/wards` | Create ward |
| PUT | `/wards/{id}` | Update ward |
| DELETE | `/wards/{id}` | Delete ward by ID |
| DELETE | `/wards/bulk` | Delete multiple wards |

---

## Price Reference

Base path: `/price-references`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/price-references` | Get all price references (paginated) |

---

## Booking

Base path: `/bookings`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bookings/all` | Get all bookings (paginated) |
| GET | `/bookings/{id}` | Get booking by ID |
| POST | `/bookings` | Create booking |
| PUT | `/bookings/{id}` | Update booking |
| DELETE | `/bookings/{id}` | Delete booking by ID |
| DELETE | `/bookings/bulk` | Delete multiple bookings |

---

## Wish

Base path: `/wishes`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/wishes/all` | Get all wishes for current user (paginated) |
| GET | `/wishes/{id}` | Get wish by ID |
| POST | `/wishes` | Create wish |
| PUT | `/wishes/{id}` | Update wish |
| DELETE | `/wishes/{id}` | Delete wish by ID |
| DELETE | `/wishes/bulk` | Delete multiple wishes |

---

## Support

Base path: `/supports`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/supports/client` | Get client support tickets (paginated) |
| GET | `/supports/client/{id}` | Get client support ticket by ID |
| GET | `/supports/admin` | Get admin support tickets (paginated) |
| GET | `/supports/admin/{id}` | Get admin support ticket by ID |
| POST | `/supports` | Create support ticket |
| PUT | `/supports/process/{id}` | Process support ticket |
| PATCH | `/supports/close/{id}` | Close support ticket |

---

## Chat

### Messages

Base path: `/chat`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/chat/conversations/{conversationId}/messages/manager` | Get messages by conversation ID for manager |
| GET | `/chat/conversations/{conversationId}/messages` | Get messages by conversation ID |
| DELETE | `/chat/messages/{messageId}` | Delete message by ID |

### WebSocket

| Destination | Description |
|-------------|-------------|
| `/conversations/{conversationId}/send-message` | Send message via WebSocket |

---

## Content Block

Base path: `/content-blocks`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/content-blocks/carousels` | Get carousels |
| POST | `/content-blocks/upload-carousel` | Upload carousel image |

---

## File

Base path: `/files`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/files/upload/signed-url` | Get presigned upload URL |
| POST | `/files/download/signed-url` | Get presigned download URL |
| DELETE | `/files/{objectKey}` | Delete file |

---

## SSE (Server-Sent Events)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sse/files/notifications/{key}/subscribe` | Subscribe to file notifications |

---

## Statistic

Base path: `/statistics`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/statistics` | Get statistics |

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| startDate | Instant | No | - | Start date for statistics |
| endDate | Instant | No | - | End date for statistics |
| granularity | Granularity | No | DAILY | Granularity (DAILY, etc.) |

---

## Common Query Parameters

Many endpoints that extend `GenericController` or return paginated results support the following query parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | int | No | 0 | Page number (0-indexed) |
| size | int | No | 20 | Page size |
| sort | String | No | - | Sort field and direction (e.g., `name,asc`) |
| filter | String | No | - | RSQL filter expression |
| all | boolean | No | false | Return all results (unpaged) |

---

## Notes

- All responses are wrapped in `ApiResponse<T>` format
- Paginated endpoints return `PageResponse<T>`
- Controllers extending `GenericController` inherit standard CRUD endpoints:
  - `GET /all` - Find all (paginated)
  - `GET /{id}` - Find by ID
  - `POST /` - Create
  - `PUT /{id}` - Update
  - `DELETE /{id}` - Delete by ID
  - `DELETE /bulk` - Delete multiple by IDs

