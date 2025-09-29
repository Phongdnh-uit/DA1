-- Seed permissions
INSERT IGNORE INTO permissions (id, name, resource, action)
VALUES 
    (1, 'Xem quyền hạn', 'PERMISSION', 'READ'),
    (2, 'Tạo quyền hạn', 'PERMISSION', 'CREATE'),
    (3, 'Cập nhật quyền hạn', 'PERMISSION', 'UPDATE'),
    (4, 'Xóa quyền hạn', 'PERMISSION', 'DELETE'),
    (5, 'Xem vai trò', 'ROLE', 'READ'),
    (6, 'Tạo vai trò', 'ROLE', 'CREATE'),
    (7, 'Cập nhật vai trò', 'ROLE', 'UPDATE'),
    (8, 'Xóa vai trò', 'ROLE', 'DELETE');

-- Seed roles
INSERT IGNORE INTO roles (id, name, description)
VALUES
    (1, 'ADMIN', 'Quản trị viên hệ thống'),
    (2, 'USER', 'Người dùng thông thường');

-- Assign all permissions to ADMIN
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT 1, p.id FROM permissions p;

-- Assign only READ permissions to USER
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT 2, p.id FROM permissions p WHERE p.action = 'READ';
