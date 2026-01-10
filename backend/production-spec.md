# Production Specification: se121

## 1. Overview

- **Project Name:** se121
- **Description:** Project for se121 project
- **Java Version:** 24
- **Spring Boot Version:** 3.5.6

This document outlines the technical specifications of the `se121` backend application. It is a Spring Boot application designed to serve as a comprehensive real estate platform.

The application follows a modular, feature-based architecture, with a clear separation of concerns into controllers, services, repositories, and entities.

## 2. Core Technologies & Dependencies

The project is built upon the Spring ecosystem and leverages several key technologies:

- **Core Framework:** Spring Boot 3.5.6 (Actuator, Data JPA, Security, Web, WebSocket)
- **Database:** MySQL with Flyway for schema migrations.
- **Data Access:** Spring Data JPA with Hibernate. RSQL is used for advanced filtering capabilities.
- **Authentication & Authorization:** Spring Security, OAuth2 (Client and Authorization Server), JWT.
- **API Documentation:** SpringDoc OpenAPI
- **Caching & Messaging:**
  - Redis for caching and chat memory.
  - Apache Kafka for asynchronous messaging.
- **AI & Search:**
  - Spring AI with Ollama for chat models and embeddings.
  - Milvus as the vector store for Retrieval-Augmented Generation (RAG).
  - Hibernate Spatial for geospatial queries.
- **File Handling:**
  - MinIO for object storage.
  - ClamAV for virus scanning.
  - Cloudinary (legacy, as seen in migration `V6__upload_cloudinary.sql`).
- **Mailing:** Spring Boot Starter Mail.
- **Utilities:**
  - Lombok for reducing boilerplate code.
  - MapStruct for DTO-entity mapping.
  - Google Libphonenumber for phone number validation.
  - Apache Tika for file type detection.

## 3. Application Configuration (`application-dev.yaml`)

The application is configured to run in a `dev` profile with connections to various services:

- **Database:** Connects to a local MySQL instance at `jdbc:mysql://localhost:3306/uitland`.
- **Flyway:** Enabled for automatic database schema migration.
- **Docker Compose:** Enabled, using the `docker/dev/compose.yaml` file for local development orchestration.
- **Redis:** Connects to a local Redis instance at `localhost:6379`.
- **AI Services:**
  - **Milvus:** `localhost:19530`
  - **Ollama:** `http://localhost:11434`
- **Kafka:** Connects to a local Kafka broker at `localhost:9092`.
- **MinIO:** Connects to a local MinIO instance at `http://localhost:9000`.
- **ClamAV:** Connects to a local ClamAV daemon at `localhost:3310`.
- **JWT:** Configured with specific secrets and token expiration times for access and refresh tokens.

## 4. Key Features & Modules

The application is divided into the following primary modules, identified by their controller packages:

- **Authentication:** Manages user registration, login (standard and OAuth2), token generation, and password changes.
- **Authorization:** Handles roles and permissions, controlling access to different resources.
- **Property:** Core module for managing real estate properties, property types, and geographical data (provinces, wards). Includes features for finding similar properties (using AI) and properties within a certain radius (using geospatial queries).
- **Booking:** Manages booking appointments.
- **Chat:** Real-time chat functionality, likely using WebSockets, with support for conversations, messages, and attachments.
- **Wishlist:** Allows users to save properties or other items to a wishlist.
- **File Management:** Handles file uploads (`general/UploadController`) and management, integrated with MinIO and ClamAV.
- **AI (RAG):** Provides Retrieval-Augmented Generation services, including ingesting data and orchestrating responses based on vector similarity search.
- **Statistics:** Provides endpoints for application statistics.

## 5. Database Schema

The database schema is managed by Flyway. Key tables include:

- **`users`:** Stores user information, including credentials and profile data.
- **`roles`, `permissions`, `role_permissions`:** Manages the Role-Based Access Control (RBAC) system. Permissions are fine-grained and linked to specific API endpoints.
- **`properties`, `property_types`, `provinces`, `wards`:** The core tables for the real estate listings. The `properties` table includes a `location` column of type `POINT` for geospatial queries.
- **`bookings`:** Stores information about appointment bookings.
- **`conversations`, `messages`, `conversation_participants`, `chat_attachments`:** Power the real-time chat feature.
- **`files`, `property_files`:** Manage file metadata and their association with other entities like properties.
- **`wishes`:** Stores user wishlist items.
- **`price_reference`:** Aggregates pricing data for statistical analysis.
- **`refresh_tokens`, `verifications`, `linked_accounts`:** Support the authentication and account management system.

## 6. Architecture & Code Patterns

### a. Entry Point (`Se121Application.java`)

The application is a standard Spring Boot application with the following key annotations:
- `@SpringBootApplication`: Standard entry point.
- `@EnableJpaAuditing`: Enables automatic population of `created_at`, `updated_at` fields.
- `@EnableAsync`: Enables asynchronous method execution.
- `@EnableScheduling`: Enables scheduled task execution.

### b. Security (`SecurityConfig.java`)

- **Dual Security Chains:** The configuration uses two `SecurityFilterChain` beans with different orders.
  - `Order(1)`: Handles the OAuth2 login flow.
  - `Order(2)`: Manages the main application security for the REST API, using JWT for authentication.
- **Public URLs:** A defined set of URLs are publicly accessible, while all others require authentication.
- **Permission Interceptor:** A custom `PermissionInterceptor` is used to enforce fine-grained access control based on the permissions defined in the database, going beyond simple role checks.
- **CORS & CSRF:** CORS is enabled, and CSRF is disabled, which is common for stateless REST APIs.

### c. API Documentation (`ApiDocConfig.java`)

- **OpenAPI 3:** The project uses `springdoc-openapi` to automatically generate API documentation.
- **JWT Authentication:** The OpenAPI UI is configured to support JWT bearer token authentication, allowing developers to test secured endpoints directly from the documentation.

### d. MVC Pattern Example: `Property` Feature

- **Controller (`PropertyController.java`):**
  - Extends a `GenericController` for basic CRUD operations.
  - Defines feature-specific endpoints like `/similar/{id}` and `/within-radius`.
  - Injects and uses the `PropertyService` to delegate business logic.
- **Service (`PropertyServiceImpl.java`):**
  - Implements the business logic for finding properties.
  - `findSimilarProperties`: Demonstrates the use of the `RAGOrchestratorService` to find similar properties based on a generated query string.
  - `findPropertiesWithinRadius`: Uses the `PropertyRepository` and a `GeometryFactory` to perform geospatial searches.
  - Interacts with `PropertyMapper` (MapStruct) to convert between entities and DTOs.
- **Repository (`PropertyRepository.java`):**
  - Extends a custom `SimpleRepository` and `JpaRepository`.
  - Uses `@EntityGraph` to prevent N+1 query problems by fetching related entities eagerly.
  - Contains custom queries using `@Query` for complex operations, including native SQL for aggregations (`aggregatePriceReferences`) and JPQL with spatial functions (`findWithinDistance`).

This structure demonstrates a clean, layered architecture that promotes separation of concerns and maintainability.
