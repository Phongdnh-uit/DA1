CREATE TABLE IF NOT EXISTS price_reference (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ward_id BIGINT NOT NULL,
    property_type_id BIGINT NOT NULL,
    average_price DECIMAL(15,2) NOT NULL,
    max_price DECIMAL(15,2) NOT NULL,
    min_price DECIMAL(15,2) NOT NULL,
    count INT NOT NULL,
    version BIGINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT
);

INSERT INTO permissions (name, resource, url_pattern, method) VALUES ('Xem thống kê giá bất động sản', 'tham chiếu giá cả', '/price-references', 'GET');
