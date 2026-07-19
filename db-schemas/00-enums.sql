CREATE SCHEMA IF NOT EXISTS iam;

CREATE SEQUENCE IF NOT EXISTS iam.common_code_sequence START WITH 1 INCREMENT BY 1;

CREATE TABLE IF NOT EXISTS iam.user_types (
    user_types_id SERIAL PRIMARY KEY,
    user_types_code VARCHAR(50) UNIQUE NOT NULL,
    user_types_name VARCHAR(100) NOT NULL,
    user_types_desc TEXT,
    insert_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
