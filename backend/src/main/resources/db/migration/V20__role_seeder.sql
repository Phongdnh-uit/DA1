-- Chèn dữ liệu cũ, cập nhật giá trị mới nếu trùng id
INSERT INTO roles (id, name, description, is_default, can_manage)
VALUES
    (1, 'SUPER_ADMIN', 'Quản trị viên toàn quyền, quản lý hệ thống', FALSE, TRUE),
    (2, 'USER', 'Người dùng cuối, khách hàng mua/bán bất động sản', TRUE, FALSE),
    (3, 'STAFF', 'Nhân viên hệ thống, môi giới hoặc quản lý nội bộ', FALSE, TRUE)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description),
    is_default = VALUES(is_default),
    can_manage = VALUES(can_manage);
