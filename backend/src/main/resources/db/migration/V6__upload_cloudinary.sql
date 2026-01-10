CREATE TABLE IF NOT EXISTS medias (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    public_id VARCHAR(255) NOT NULL,
    bytes BIGINT NOT NULL,
    secure_url VARCHAR(255) NOT NULL,
    format VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    width INT NOT NULL,
    height INT NOT NULL,
    purpose VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id BIGINT,
    version BIGINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,

    INDEX idx_entity (entity_type, entity_id)
);
