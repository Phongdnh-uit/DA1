-- 1. QUẢN LÝ HỖ TRỢ (SUPPORT TICKET) - Dành cho Staff/Admin xử lý
INSERT INTO permissions (name, resource, url_pattern, method) VALUES
('Xem danh sách hỗ trợ (Admin)', 'hỗ trợ', '/supports/admin', 'GET'),
('Xem chi tiết hỗ trợ (Admin)', 'hỗ trợ', '/supports/admin/{id}', 'GET'),
('Xử lý yêu cầu hỗ trợ', 'hỗ trợ', '/supports/process/{id}', 'PUT'),
('Đóng yêu cầu hỗ trợ', 'hỗ trợ', '/supports/close/{id}', 'PATCH');

-- 3. QUẢN LÝ FILE & NỘI DUNG (HÀNH ĐỘNG XÓA)
-- Vì upload đã được exclude, ta chỉ cần quyền cho hành động xóa hoặc quản trị
INSERT INTO permissions (name, resource, url_pattern, method) VALUES
('Xóa tệp tin hệ thống', 'tệp tin', '/files/{objectKey}', 'DELETE'),
('Tải lên ảnh carousel', 'nội dung', '/content-blocks/upload-carousel', 'POST');
