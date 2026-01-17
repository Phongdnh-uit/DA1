# UIT Land - Nền tảng Bất động sản

## Mục lục

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Kiến trúc tổng thể](#2-kiến-trúc-tổng-thể)
3. [Công nghệ sử dụng](#3-công-nghệ-sử-dụng)
4. [Cấu trúc thư mục chính](#4-cấu-trúc-thư-mục-chính)
5. [Các tính năng chính của hệ thống](#5-các-tính-năng-chính-của-hệ-thống)
6. [Hướng dẫn cài đặt và chạy dự án](#6-hướng-dẫn-cài-đặt-và-chạy-dự-án)
7. [Cấu hình môi trường](#7-cấu-hình-môi-trường-environment-variables)
8. [Ghi chú kỹ thuật và lưu ý](#8-ghi-chú-kỹ-thuật-và-lưu-ý)
9. [Định hướng mở rộng](#9-định-hướng-mở-rộng)

---

## 1. Tổng quan hệ thống

### Mục tiêu

UIT Land (se121) là một nền tảng bất động sản toàn diện được xây dựng nhằm cung cấp giải pháp quản lý và tìm kiếm bất động sản. Hệ thống hỗ trợ người dùng trong việc tìm kiếm, đăng tin, đặt lịch xem nhà, và tương tác trực tiếp với bộ phận hỗ trợ.

### Bài toán hệ thống giải quyết

- Quản lý danh sách bất động sản (nhà đất, căn hộ, ...) với đầy đủ thông tin chi tiết
- Tìm kiếm bất động sản theo vị trí địa lý, bán kính, và các tiêu chí khác
- Tìm kiếm bất động sản tương tự thông qua AI (RAG - Retrieval-Augmented Generation)
- Đặt lịch xem nhà trực tuyến
- Chat thời gian thực giữa người dùng và quản trị viên
- Hệ thống hỗ trợ khách hàng (support ticket)
- Quản lý danh sách yêu thích (wishlist)
- So sánh bất động sản

### Đối tượng sử dụng chính

- **Người dùng cuối (Client):** Tìm kiếm, xem chi tiết bất động sản, đặt lịch, chat, gửi yêu cầu hỗ trợ
- **Quản trị viên (Admin):** Quản lý bất động sản, người dùng, quyền hạn, xử lý booking, xử lý ticket hỗ trợ

### Kiến trúc tổng thể mức cao

Hệ thống được thiết kế theo mô hình Client-Server với:
- **Frontend:** Single Page Application (SPA) xây dựng bằng React
- **Backend:** RESTful API xây dựng bằng Spring Boot
- **Cơ sở dữ liệu:** MySQL với hỗ trợ Spatial Queries
- **Hệ thống AI:** Ollama (LLM) + Milvus (Vector Database) cho tính năng RAG
- **Message Broker:** Apache Kafka cho xử lý bất đồng bộ
- **Cache:** Redis
- **Object Storage:** MinIO
- **Real-time Communication:** WebSocket (STOMP)

---

## 2. Kiến trúc tổng thể

### Giao tiếp Frontend - Backend

- **REST API:** Giao tiếp chính giữa frontend và backend thông qua HTTP/HTTPS với JSON payload
- **WebSocket (STOMP):** Sử dụng cho tính năng chat thời gian thực
- **Server-Sent Events (SSE):** Sử dụng cho thông báo file upload/download

### Authentication & Authorization

- **JWT (JSON Web Token):** Access token và Refresh token cho xác thực stateless
- **OAuth2:** Hỗ trợ đăng nhập qua Google
- **RBAC (Role-Based Access Control):** Hệ thống phân quyền dựa trên vai trò với bảng `roles`, `permissions`, `role_permissions`
- **Permission Interceptor:** Kiểm soát quyền truy cập chi tiết theo từng endpoint

### Các module chính

| Module | Mô tả |
|--------|-------|
| **Authentication** | Đăng ký, đăng nhập, OAuth2, quản lý token, xác thực email/OTP, đổi mật khẩu |
| **Authorization** | Quản lý vai trò (roles) và quyền hạn (permissions) |
| **Property** | Quản lý bất động sản, loại bất động sản, tìm kiếm theo vị trí và bán kính |
| **Booking** | Quản lý đặt lịch xem nhà |
| **Chat** | Nhắn tin thời gian thực giữa người dùng và quản trị viên |
| **Wish** | Quản lý danh sách yêu thích |
| **Support** | Hệ thống ticket hỗ trợ khách hàng |
| **File** | Upload/download file qua MinIO với presigned URL |
| **AI/RAG** | Tìm kiếm bất động sản tương tự sử dụng vector embeddings |
| **Statistic** | Thống kê dữ liệu hệ thống |

---

## 3. Công nghệ sử dụng

### 3.1 Backend

| Thành phần | Công nghệ |
|------------|-----------|
| **Ngôn ngữ** | Java 24 |
| **Framework** | Spring Boot 3.5.6 |
| **Database** | MySQL |
| **ORM** | Spring Data JPA + Hibernate (bao gồm Hibernate Spatial) |
| **Schema Migration** | Flyway |
| **Authentication** | Spring Security, OAuth2, JWT |
| **API Documentation** | SpringDoc OpenAPI (Swagger UI) |
| **Cache** | Redis |
| **Message Broker** | Apache Kafka |
| **Object Storage** | MinIO |
| **AI/LLM** | Spring AI + Ollama (qwen3) |
| **Vector Database** | Milvus |
| **WebSocket** | Spring WebSocket (STOMP) |
| **Email** | Spring Boot Starter Mail |
| **Virus Scanning** | ClamAV |
| **Image Processing** | Imgproxy |
| **Mapping** | MapStruct |
| **Utilities** | Lombok, Google Libphonenumber, Apache Tika |
| **Notification** | Telegram Bot, Twilio SMS |
| **Build Tool** | Gradle |

### 3.2 Frontend

| Thành phần | Công nghệ |
|------------|-----------|
| **Framework** | React 19 |
| **Language** | TypeScript |
| **Build Tool** | Vite 7 |
| **State Management** | Zustand |
| **Data Fetching** | TanStack React Query |
| **Routing** | TanStack Router |
| **UI Framework** | Radix UI + Tailwind CSS 4 |
| **Form Handling** | React Hook Form + Zod |
| **Rich Text Editor** | TipTap |
| **Maps** | Mapbox GL |
| **Charts** | Recharts |
| **Animation** | Motion (Framer Motion) |
| **HTTP Client** | Axios |
| **WebSocket** | STOMP.js |
| **AI Chat UI** | @assistant-ui/react |
| **Image Upload** | Cloudinary SDK, react-dropzone |
| **API Client Generation** | Orval (từ OpenAPI spec) |

---

## 4. Cấu trúc thư mục chính

### Backend (`/backend`)

```
backend/
├── build.gradle              # Cấu hình Gradle và dependencies
├── docker/
│   ├── dev/                  # Docker Compose cho môi trường development
│   │   └── compose.yaml
│   └── pro/                  # Docker Compose và Dockerfile cho production
│       ├── compose.yaml
│       ├── Dockerfile
│       └── example.env
├── src/
│   ├── main/
│   │   ├── java/com/phongdnh/se121/
│   │   │   ├── Se121Application.java    # Entry point
│   │   │   ├── ai/                       # AI/RAG services
│   │   │   ├── configurations/           # Spring configurations
│   │   │   ├── controllers/              # REST controllers
│   │   │   ├── dtos/                     # Data Transfer Objects
│   │   │   ├── entities/                 # JPA entities
│   │   │   ├── repositories/             # Spring Data repositories
│   │   │   ├── services/                 # Business logic
│   │   │   ├── securities/               # Security filters, JWT, OAuth2
│   │   │   ├── kafka/                    # Kafka producers/consumers
│   │   │   └── mappers/                  # MapStruct mappers
│   │   └── resources/
│   │       ├── application.yaml          # Cấu hình chung
│   │       ├── application-dev.yaml      # Cấu hình development
│   │       ├── application-pro.yaml      # Cấu hình production
│   │       └── db/migration/             # Flyway migrations
│   └── test/                             # Unit tests
```

### Frontend (`/frontend`)

```
frontend/
├── package.json              # Dependencies và scripts
├── vite.config.ts            # Cấu hình Vite
├── orval.config.ts           # Cấu hình sinh API client từ OpenAPI
├── openapi.json              # OpenAPI specification
├── src/
│   ├── main.tsx              # Entry point
│   ├── routes/               # TanStack Router routes
│   │   ├── __client/         # Routes cho người dùng
│   │   ├── admin/            # Routes cho quản trị viên
│   │   └── auth/             # Routes xác thực
│   ├── pages/                # Page components
│   │   ├── admin/            # Trang quản trị
│   │   ├── client/           # Trang người dùng
│   │   └── auth/             # Trang xác thực
│   ├── components/           # React components
│   │   ├── admin/            # Components cho admin
│   │   ├── client/           # Components cho client
│   │   ├── ui/               # UI primitives (Radix + Tailwind)
│   │   ├── chat/             # Chat components
│   │   └── tiptap/           # Rich text editor
│   ├── services/             # API services (generated by Orval)
│   ├── stores/               # Zustand stores
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities và configurations
│   └── types/                # TypeScript type definitions
```

---

## 5. Các tính năng chính của hệ thống

### Quản lý bất động sản

- CRUD bất động sản với đầy đủ thông tin: loại hình, giá, diện tích, số phòng, hướng, nội thất, v.v.
- Tìm kiếm bất động sản trong bán kính cho trước (geospatial query sử dụng Hibernate Spatial)
- Tìm kiếm bất động sản tương tự thông qua AI (RAG với Milvus vector database)
- Quản lý hình ảnh bất động sản (upload lên MinIO, xử lý qua Imgproxy)
- Phân loại theo tỉnh/thành, quận/huyện, phường/xã

### Xác thực & Phân quyền

- Đăng ký tài khoản với xác thực email/OTP
- Đăng nhập thông thường và OAuth2 (Google)
- Hệ thống JWT với access token và refresh token
- Phân quyền RBAC chi tiết theo từng API endpoint
- Quản lý vai trò và quyền hạn động

### Đặt lịch xem nhà

- Đặt lịch hẹn xem bất động sản
- Quản lý trạng thái booking (pending, confirmed, cancelled, ...)
- Admin quản lý và xử lý các booking

### Chat thời gian thực

- Nhắn tin real-time giữa người dùng và quản trị viên qua WebSocket
- Lưu trữ lịch sử hội thoại
- Hỗ trợ đính kèm file trong tin nhắn

### Hệ thống hỗ trợ

- Tạo ticket hỗ trợ với phân loại và mức độ nghiêm trọng
- Upload file đính kèm
- Admin xử lý và phản hồi ticket

### Danh sách yêu thích & So sánh

- Thêm bất động sản vào wishlist
- So sánh các bất động sản với nhau

### Thống kê

- Dashboard thống kê cho admin
- Thống kê theo khoảng thời gian và độ chi tiết (granularity)
- Bảng tham chiếu giá (price reference)

### AI & Tìm kiếm thông minh

- RAG (Retrieval-Augmented Generation) sử dụng Ollama LLM
- Vector embeddings lưu trữ trong Milvus
- Tìm kiếm bất động sản tương tự dựa trên semantic similarity
- Chat memory lưu trữ trong Redis

---

## 6. Hướng dẫn cài đặt và chạy dự án

### 6.1 Yêu cầu môi trường

| Yêu cầu | Phiên bản |
|---------|-----------|
| **Java** | 24 |
| **Node.js** | 18+ (khuyến nghị 20+) |
| **Docker** | 20+ |
| **Docker Compose** | 2.0+ |
| **GPU (tùy chọn)** | NVIDIA GPU với driver cho Ollama |

### 6.2 Chạy bằng Docker (Development)

#### Bước 1: Clone project

```bash
git clone <repository-url>
cd DA1
```

#### Bước 2: Khởi động các services phụ thuộc

```bash
cd backend/docker/dev
docker compose up -d
```

Các services được khởi chạy:
- **MySQL** (port 3306): Cơ sở dữ liệu chính
- **Redis** (port 6379): Cache và chat memory
- **Ollama** (port 11434): LLM server
- **MinIO** (port 9000, 9001): Object storage
- **Kafka** (port 9092): Message broker
- **Kafka UI** (port 8762): Giao diện quản lý Kafka
- **ClamAV** (port 3310): Virus scanning
- **Imgproxy** (port 8081): Image processing

#### Bước 3: Chạy Backend

```bash
cd backend
./gradlew bootRun
```

Backend sẽ chạy tại `http://localhost:8080`

#### Bước 4: Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại `http://localhost:5173`

### 6.3 Chạy bằng Docker (Production)

#### Bước 1: Cấu hình environment

```bash
cd backend/docker/pro
cp example.env .env
# Chỉnh sửa file .env với các giá trị thực tế
```

#### Bước 2: Build và chạy toàn bộ stack

```bash
docker compose up -d --build
```

Các services production bao gồm tất cả services development cộng thêm:
- **Milvus** (port 19530): Vector database
- **etcd**: Milvus metadata storage
- **app**: Backend application container

### 6.4 Chạy thủ công (Local)

#### Backend

```bash
cd backend

# Build project
./gradlew build

# Chạy với profile dev
./gradlew bootRun

# Hoặc chạy JAR file
java -jar build/libs/se121-0.0.1-SNAPSHOT.jar
```

#### Frontend

```bash
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

---

## 7. Cấu hình môi trường (Environment Variables)

### Backend

| Biến | Mô tả |
|------|-------|
| `DB_HOST` | Địa chỉ MySQL server |
| `DB_PORT` | Port MySQL (mặc định: 3306) |
| `DB_NAME` | Tên database |
| `DB_USERNAME` | Username database |
| `DB_PASSWORD` | Password database |
| `REDIS_HOST` | Địa chỉ Redis server |
| `REDIS_PORT` | Port Redis (mặc định: 6379) |
| `MINIO_ENDPOINT` | URL MinIO endpoint |
| `MINIO_ACCESS_KEY` | MinIO access key |
| `MINIO_SECRET_KEY` | MinIO secret key |
| `MINIO_WEBHOOK_TOKEN` | Token cho MinIO webhook |
| `MILVUS_HOST` | Địa chỉ Milvus server |
| `MILVUS_PORT` | Port Milvus (mặc định: 19530) |
| `MILVUS_COLLECTION_NAME` | Tên collection trong Milvus |
| `MILVUS_EMBEDDING_DIMENSION` | Số chiều embedding (mặc định: 4096) |
| `OLLAMA_BASE_URL` | URL Ollama API |
| `OLLAMA_EMBEDDING_MODEL` | Model embedding (vd: qwen3-embedding:8b-q4_K_M) |
| `OLLAMA_CHAT_MODEL` | Model chat (vd: qwen3:4b-instruct-2507-q4_K_M) |
| `KAFKA_BOOTSTRAP_SERVERS` | Địa chỉ Kafka broker |
| `JWT_SECRET` | Secret key cho JWT |
| `JWT_ACCESS_TOKEN_EXPIRATION` | Thời gian hết hạn access token (giây) |
| `JWT_REFRESH_TOKEN_EXPIRATION` | Thời gian hết hạn refresh token (giây) |
| `CLAMAV_HOST` | Địa chỉ ClamAV daemon |
| `CLAMAV_PORT` | Port ClamAV (mặc định: 3310) |
| `IMGPROXY_BASE_URL` | URL Imgproxy server |
| `IMGPROXY_KEY` | Key cho Imgproxy signing |
| `IMGPROXY_SALT` | Salt cho Imgproxy signing |
| `MAIL_HOST` | SMTP server |
| `MAIL_PORT` | SMTP port |
| `MAIL_USERNAME` | SMTP username |
| `MAIL_PASSWORD` | SMTP password |
| `MAIL_FROM_ADDRESS` | Địa chỉ email gửi đi |
| `GOOGLE_CLIENT_ID` | Google OAuth2 client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth2 client secret |
| `BOOTSTRAP_ADMIN_PHONE` | Số điện thoại admin mặc định |
| `BOOTSTRAP_ADMIN_PASSWORD` | Mật khẩu admin mặc định |
| `BOOTSTRAP_ADMIN_EMAIL` | Email admin mặc định |
| `TELEGRAM_BOT_USERNAME` | Username Telegram bot |
| `TELEGRAM_BOT_TOKEN` | Token Telegram bot |

---

## 8. Ghi chú kỹ thuật và lưu ý

### Yêu cầu phần cứng

- **GPU (NVIDIA):** Cần thiết cho Ollama chạy hiệu quả với các model AI. Có thể chạy trên CPU nhưng sẽ chậm hơn đáng kể.
- **RAM:** Tối thiểu 8GB, khuyến nghị 16GB+ khi chạy đầy đủ stack.
- **Disk:** Tối thiểu 20GB cho Docker volumes.

### Database Migrations

- Flyway được sử dụng để quản lý schema migrations.
- Các migration files nằm trong `backend/src/main/resources/db/migration/`.
- Không sửa đổi các migration đã được apply. Tạo migration mới thay vì sửa file cũ.

### Security

- CSRF được tắt do API stateless sử dụng JWT.
- CORS được cấu hình riêng trong `CORSConfig.java`.
- Các endpoint public được định nghĩa trong `SecurityConstant`.
- Permission Interceptor kiểm tra quyền truy cập dựa trên database.

### Virtual Threads

- Spring Boot được cấu hình sử dụng Virtual Threads (Java 21+) để tối ưu hiệu năng.

### API Documentation

- Swagger UI available tại `http://localhost:8080/swagger-ui.html` khi chạy backend.
- OpenAPI spec được export và sử dụng bởi Orval để sinh API client cho frontend.

### Ràng buộc kỹ thuật

- Vector embedding dimension cố định là 4096 (phụ thuộc vào model Ollama).
- File upload được scan virus qua ClamAV trước khi lưu.
- Image processing qua Imgproxy yêu cầu cấu hình signing key và salt.

### Hạn chế hiện tại

- Milvus standalone mode không hỗ trợ horizontal scaling.
- Ollama yêu cầu GPU để chạy hiệu quả.
- Một số tính năng như Google Gemini AI bị comment do giới hạn free tier.

---

## 9. Định hướng mở rộng
### Tính năng mới
- Tích hợp thêm các model LLM khác (OpenAI, Hugging Face, ...)
- Hỗ trợ đa ngôn ngữ cho giao diện người dùng
- Thêm chức năng đấu giá bất động sản
- Tích hợp thanh toán trực tuyến
- Hệ thống đánh giá và nhận xét bất động sản
### Mở rộng hệ thống thông báo (push notifications, email marketing)
- Thông báo đẩy (push notifications) cho các sự kiện quan trọng
- Tích hợp email marketing cho các chiến dịch quảng cáo
- Hệ thống SMS marketing nâng cao
- Tích hợp với các dịch vụ thông báo bên thứ ba (OneSignal, Firebase Cloud Messaging)
- Lập lịch gửi thông báo định kỳ