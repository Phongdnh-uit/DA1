CREATE TABLE IF NOT EXISTS wishes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type VARCHAR(255) NOT NULL,
    identifier VARCHAR(255) NOT NULL,
    version BIGINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,

    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_entity (type, identifier),
    INDEX idx_user (user_id)
);
