ALTER TABLE permissions ADD COLUMN code VARCHAR(100);

ALTER TABLE permissions ADD CONSTRAINT uq_permission_code UNIQUE (code);

-- --- 1. QUẢN LÝ NGƯỜI DÙNG (USER) ---
UPDATE permissions SET code = 'USER_CREATE' WHERE url_pattern = '/users' AND method = 'POST';
UPDATE permissions SET code = 'USER_VIEW_LIST' WHERE url_pattern = '/users/all' AND method = 'GET';
UPDATE permissions SET code = 'USER_VIEW_DETAIL' WHERE url_pattern = '/users/{id}' AND method = 'GET';
UPDATE permissions SET code = 'USER_UPDATE' WHERE url_pattern = '/users/{id}' AND method = 'PUT';
UPDATE permissions SET code = 'USER_DELETE' WHERE url_pattern = '/users/{id}' AND method = 'DELETE';
UPDATE permissions SET code = 'USER_DELETE_BULK' WHERE url_pattern = '/users/bulk' AND method = 'DELETE';

-- --- 2. QUẢN LÝ VAI TRÒ (ROLE) ---
UPDATE permissions SET code = 'ROLE_CREATE' WHERE url_pattern = '/roles' AND method = 'POST';
UPDATE permissions SET code = 'ROLE_VIEW_LIST' WHERE url_pattern = '/roles/all' AND method = 'GET';
UPDATE permissions SET code = 'ROLE_VIEW_DETAIL' WHERE url_pattern = '/roles/{id}' AND method = 'GET';
UPDATE permissions SET code = 'ROLE_UPDATE' WHERE url_pattern = '/roles/{id}' AND method = 'PUT';
UPDATE permissions SET code = 'ROLE_DELETE' WHERE url_pattern = '/roles/{id}' AND method = 'DELETE';
UPDATE permissions SET code = 'ROLE_DELETE_BULK' WHERE url_pattern = '/roles/bulk' AND method = 'DELETE';

-- --- 3. QUẢN LÝ QUYỀN HẠN (PERMISSION) ---
UPDATE permissions SET code = 'PERMISSION_CREATE' WHERE url_pattern = '/permissions' AND method = 'POST';
UPDATE permissions SET code = 'PERMISSION_VIEW_LIST' WHERE url_pattern = '/permissions/all' AND method = 'GET';
UPDATE permissions SET code = 'PERMISSION_VIEW_DETAIL' WHERE url_pattern = '/permissions/{id}' AND method = 'GET';
UPDATE permissions SET code = 'PERMISSION_UPDATE' WHERE url_pattern = '/permissions/{id}' AND method = 'PUT';
UPDATE permissions SET code = 'PERMISSION_DELETE' WHERE url_pattern = '/permissions/{id}' AND method = 'DELETE';
UPDATE permissions SET code = 'PERMISSION_DELETE_BULK' WHERE url_pattern = '/permissions/bulk' AND method = 'DELETE';

-- --- 4. QUẢN LÝ BẤT ĐỘNG SẢN (PROPERTY) ---
-- Lưu ý: Đây là quyền quản trị, cho phép admin sửa/xóa BĐS của người khác
UPDATE permissions SET code = 'PROPERTY_CREATE' WHERE url_pattern = '/properties' AND method = 'POST';
UPDATE permissions SET code = 'PROPERTY_UPDATE' WHERE url_pattern = '/properties/{id}' AND method = 'PUT';
UPDATE permissions SET code = 'PROPERTY_DELETE' WHERE url_pattern = '/properties/{id}' AND method = 'DELETE';
UPDATE permissions SET code = 'PROPERTY_DELETE_BULK' WHERE url_pattern = '/properties/bulk' AND method = 'DELETE';

-- --- 5. QUẢN LÝ LOẠI BẤT ĐỘNG SẢN (PROPERTY TYPE) ---
UPDATE permissions SET code = 'PROPERTY_TYPE_CREATE' WHERE url_pattern = '/property-types' AND method = 'POST';
UPDATE permissions SET code = 'PROPERTY_TYPE_VIEW_LIST' WHERE url_pattern = '/property-types/all' AND method = 'GET';
UPDATE permissions SET code = 'PROPERTY_TYPE_VIEW_DETAIL' WHERE url_pattern = '/property-types/{id}' AND method = 'GET';
UPDATE permissions SET code = 'PROPERTY_TYPE_UPDATE' WHERE url_pattern = '/property-types/{id}' AND method = 'PUT';
UPDATE permissions SET code = 'PROPERTY_TYPE_DELETE' WHERE url_pattern = '/property-types/{id}' AND method = 'DELETE';
UPDATE permissions SET code = 'PROPERTY_TYPE_DELETE_BULK' WHERE url_pattern = '/property-types/bulk' AND method = 'DELETE';

-- --- 6. QUẢN LÝ ĐỊA CHÍNH (PROVINCE / WARD) ---
UPDATE permissions SET code = 'PROVINCE_VIEW_DETAIL' WHERE url_pattern = '/provinces/{id}' AND method = 'GET';
UPDATE permissions SET code = 'PROVINCE_CREATE' WHERE url_pattern = '/provinces' AND method = 'POST';
UPDATE permissions SET code = 'PROVINCE_UPDATE' WHERE url_pattern = '/provinces/{id}' AND method = 'PUT';
UPDATE permissions SET code = 'PROVINCE_DELETE' WHERE url_pattern = '/provinces/{id}' AND method = 'DELETE';
UPDATE permissions SET code = 'PROVINCE_DELETE_BULK' WHERE url_pattern = '/provinces/bulk' AND method = 'DELETE';


UPDATE permissions SET code = 'WARD_VIEW_DETAIL' WHERE url_pattern = '/wards/{id}' AND method = 'GET';
UPDATE permissions SET code = 'WARD_CREATE' WHERE url_pattern = '/wards' AND method = 'POST';
UPDATE permissions SET code = 'WARD_UPDATE' WHERE url_pattern = '/wards/{id}' AND method = 'PUT';
UPDATE permissions SET code = 'WARD_DELETE' WHERE url_pattern = '/wards/{id}' AND method = 'DELETE';
UPDATE permissions SET code = 'WARD_DELETE_BULK' WHERE url_pattern = '/wards/bulk' AND method = 'DELETE';

-- --- 7. QUẢN LÝ TRÒ CHUYỆN (CHAT MANAGER) ---
-- Chỉ dành cho quyền quản lý xem/xóa tin nhắn hệ thống
UPDATE permissions SET code = 'CHAT_MANAGER_VIEW' WHERE url_pattern = '/chat/conversations/{conversationId}/messages/manager' AND method = 'GET';
UPDATE permissions SET code = 'CHAT_MANAGER_DELETE_MSG' WHERE url_pattern = '/chat/messages/{messageId}' AND method = 'DELETE';
UPDATE permissions SET code = 'CHAT_MANAGER_CLOSE' WHERE url_pattern = '/chat/conversations/{conversationId}/close' AND method = 'POST';
UPDATE permissions SET code = 'CHAT_PARTICIPATE' WHERE url_pattern = '/chat/conversations/{conversationId}/participate' AND method = 'POST';
-- Xem danh sách tất cả cuộc hội thoại (Khác với /me)
UPDATE permissions SET code = 'CHAT_VIEW_LIST' WHERE url_pattern = '/chat/conversations' AND method = 'GET';
-- Xem tin nhắn cụ thể của một hội thoại bất kỳ (Quyền admin soi nội dung chat)
UPDATE permissions SET code = 'CHAT_VIEW_DETAIL' WHERE url_pattern = '/chat/conversations/{conversationId}/messages' AND method = 'GET';

-- --- 8. BÁO CÁO (STATISTICS) ---
UPDATE permissions SET code = 'STATISTICS_VIEW' WHERE url_pattern = '/statistics' AND method = 'GET';

-- --- 9. QUẢN LÝ FILE UPLOAD ---
UPDATE permissions SET code = 'FILE_DELETE' WHERE url_pattern = '/uploads/{id}' AND method = 'DELETE';


DELETE FROM permissions WHERE code IS NULL;
