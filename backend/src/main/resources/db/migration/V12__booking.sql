CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    type VARCHAR(100) NOT NULL,
    note TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status VARCHAR(100) NOT NULL,
    version BIGINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT
);


INSERT INTO permissions (name, code, resource, url_pattern, method) VALUES
('Xem danh sách đặt lịch', 'BOOKING_VIEW_ALL', 'đặt lịch', '/api/bookings/all', 'GET'),
('Xem chi tiết đặt lịch', 'BOOKING_VIEW_DETAIL', 'đặt lịch', '/api/bookings/{id}', 'GET'),
('Cập nhật đặt lịch', 'BOOKING_UPDATE', 'đặt lịch', '/api/bookings/{id}', 'PUT'),
('Xóa đặt lịch', 'BOOKING_DELETE', 'đặt lịch', '/api/bookings/{id}', 'DELETE'),
('Xóa nhiều đặt lịch', 'BOOKING_DELETE_BULK', 'đặt lịch', '/api/bookings/bulk', 'DELETE');
