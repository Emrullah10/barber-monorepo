CREATE SCHEMA IF NOT EXISTS iam;

CREATE SEQUENCE IF NOT EXISTS iam.common_code_sequence START WITH 1 INCREMENT BY 1;

CREATE TABLE IF NOT EXISTS iam.user_types (
    user_types_id SERIAL PRIMARY KEY,
    user_types_code VARCHAR(50) UNIQUE NOT NULL,
    user_types_name VARCHAR(100) NOT NULL,
    user_types_desc TEXT,
    insert_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Tenants (işletmeler)
CREATE TABLE IF NOT EXISTS iam.tenants (
    tenant_id SERIAL PRIMARY KEY,
    tenant_code BIGINT DEFAULT nextval('iam.common_code_sequence') UNIQUE NOT NULL,
    tenant_name VARCHAR(255) NOT NULL,
    tenant_slug VARCHAR(255) UNIQUE,
    tenant_phone VARCHAR(50),
    tenant_email VARCHAR(100),
    tenant_address TEXT,
    tenant_city VARCHAR(100),
    tenant_photo_url VARCHAR(255),
    tenant_latitude DECIMAL(10, 8),
    tenant_longitude DECIMAL(11, 8),
    tenant_is_active BOOLEAN DEFAULT true,
    owner_user_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Branches (şubeler)
CREATE TABLE IF NOT EXISTS iam.branches (
    branch_id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES iam.tenants(tenant_id) ON DELETE CASCADE,
    branch_code BIGINT DEFAULT nextval('iam.common_code_sequence') UNIQUE NOT NULL,
    branch_name VARCHAR(255) NOT NULL,
    branch_address TEXT,
    branch_phone VARCHAR(50),
    branch_latitude DECIMAL(10, 8),
    branch_longitude DECIMAL(11, 8),
    branch_is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Users
CREATE TABLE IF NOT EXISTS iam.users (
    users_id SERIAL PRIMARY KEY,
    users_code BIGINT DEFAULT nextval('iam.common_code_sequence') UNIQUE NOT NULL,
    tenant_id INTEGER REFERENCES iam.tenants(tenant_id) ON DELETE SET NULL,
    branch_id INTEGER REFERENCES iam.branches(branch_id) ON DELETE SET NULL,
    users_name VARCHAR(100) NOT NULL,
    users_email VARCHAR(100) UNIQUE NOT NULL,
    users_password VARCHAR(255) NOT NULL,
    user_type_code VARCHAR(50) REFERENCES iam.user_types(user_types_code) ON DELETE SET NULL,
    users_role VARCHAR(20) DEFAULT 'customer',
    users_specialty VARCHAR(100),
    users_bio TEXT,
    users_photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_at TIMESTAMP,
    updated_by VARCHAR(50)
);

-- Tenant Users (bir kullanıcının bir tenant'a üyeliği / rolü — login'in tenant bilgisini çektiği tablo)
CREATE TABLE IF NOT EXISTS iam.tenant_users (
    tenant_users_id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES iam.tenants(tenant_id) ON DELETE CASCADE,
    users_id INTEGER NOT NULL REFERENCES iam.users(users_id) ON DELETE CASCADE,
    role_in_tenant VARCHAR(50) NOT NULL DEFAULT 'barber',
    is_active BOOLEAN DEFAULT true,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tenant_id, users_id)
);
-- Services (hizmetler — tenant bazında)
CREATE TABLE IF NOT EXISTS iam.services (
    services_id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES iam.tenants(tenant_id) ON DELETE CASCADE,
    services_name VARCHAR(100) NOT NULL,
    services_price DECIMAL(10,2) NOT NULL,
    services_duration_min INTEGER NOT NULL,
    services_is_active BOOLEAN DEFAULT true,
    insert_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_user_id BIGINT,
    update_datetime TIMESTAMP,
    update_user_id BIGINT
);

-- Barber Availability (çalışma saatleri)
CREATE TABLE IF NOT EXISTS iam.barber_availability (
    availability_id SERIAL PRIMARY KEY,
    barber_id INTEGER NOT NULL REFERENCES iam.users(users_id) ON DELETE CASCADE,
    branch_id INTEGER REFERENCES iam.branches(branch_id) ON DELETE CASCADE,
    tenant_id INTEGER REFERENCES iam.tenants(tenant_id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    insert_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_user_id BIGINT,
    update_datetime TIMESTAMP,
    update_user_id BIGINT,
    UNIQUE (barber_id, day_of_week)
);

-- Appointments (randevular)
CREATE TABLE IF NOT EXISTS iam.appointments (
    appointments_id SERIAL PRIMARY KEY,
    users_id BIGINT NOT NULL,
    barber_id INTEGER REFERENCES iam.users(users_id) ON DELETE RESTRICT,
    branch_id INTEGER REFERENCES iam.branches(branch_id) ON DELETE RESTRICT,
    tenant_id INTEGER REFERENCES iam.tenants(tenant_id) ON DELETE RESTRICT,
    services_id INTEGER NOT NULL REFERENCES iam.services(services_id) ON DELETE RESTRICT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    appointment_status VARCHAR(20) DEFAULT 'pending',
    insert_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_user_id BIGINT,
    update_datetime TIMESTAMP,
    update_user_id BIGINT
);
