CREATE TABLE role_modules (
    role_id BIGINT NOT NULL,
    module_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (role_id, module_name),
    CONSTRAINT fk_role_modules_role
        FOREIGN KEY (role_id) REFERENCES roles(id)
        ON DELETE CASCADE
);
