-- backend/init.sql
-- PostgreSQL Şema (Schema) Kullanımı: IAM üzerinden
CREATE SCHEMA IF NOT EXISTS iam;

-- 1. Tüm tablolar için ortak Sayaç (Sequence) oluşturulması
CREATE SEQUENCE IF NOT EXISTS iam.common_code_sequence START WITH 1 INCREMENT BY 1;

-- 2. USER TYPES (Kullanıcı Rolleri)
CREATE TABLE IF NOT EXISTS iam.user_types (
    user_types_id SERIAL PRIMARY KEY,
    user_types_code VARCHAR(50) UNIQUE NOT NULL, -- 'owner', 'manager', 'barber', 'customer' vb.
    user_types_name VARCHAR(100) NOT NULL,
    user_types_desc TEXT,
    insert_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TENANTS (Şirketler/İşletmeler)
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
    tenant_is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- 4. BRANCHES (Şubeler)
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

-- 5. USERS (Kullanıcılar)
CREATE TABLE IF NOT EXISTS iam.users (
    users_id SERIAL PRIMARY KEY,
    users_code BIGINT DEFAULT nextval('iam.common_code_sequence') UNIQUE NOT NULL,
    tenant_id INTEGER REFERENCES iam.tenants(tenant_id) ON DELETE SET NULL, -- Hangi firmaya ait (müşteriler için null olabilir)
    branch_id INTEGER REFERENCES iam.branches(branch_id) ON DELETE SET NULL, -- Hangi şubeye ait (berber/şube sorumlusu için)
    users_name VARCHAR(100) NOT NULL,
    users_email VARCHAR(100) UNIQUE NOT NULL,
    users_password VARCHAR(255) NOT NULL,
    user_type_code VARCHAR(50) REFERENCES iam.user_types(user_types_code) ON DELETE SET NULL, -- Yeni rol bağlamı
    users_role VARCHAR(20) DEFAULT 'customer', -- Eski fallback alanı, kaldırılabilir.
    users_specialty VARCHAR(100),
    users_bio TEXT,
    users_photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_at TIMESTAMP,
    updated_by VARCHAR(50)
);

-- 6. SERVICES (Hizmetler - Şirket Bazında)
CREATE TABLE IF NOT EXISTS iam.services (
    services_id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES iam.tenants(tenant_id) ON DELETE CASCADE, -- Hizmet artık bir şirkete / tenant'a aittir
    services_name VARCHAR(100) NOT NULL,
    services_price DECIMAL(10,2) NOT NULL,
    services_duration_min INTEGER NOT NULL,
    services_is_active BOOLEAN DEFAULT true,
    insert_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_user_id BIGINT,
    update_datetime TIMESTAMP,
    update_user_id BIGINT
);

-- 7. BARBER AVAILABILITY (Çalışma Saatleri/Uygunluk)
CREATE TABLE IF NOT EXISTS iam.barber_availability (
    availability_id SERIAL PRIMARY KEY,
    barber_id INTEGER NOT NULL REFERENCES iam.users(users_id) ON DELETE CASCADE,
    branch_id INTEGER NOT NULL REFERENCES iam.branches(branch_id) ON DELETE CASCADE, -- Hangi şubedeki saati
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    insert_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_user_id BIGINT,
    update_datetime TIMESTAMP,
    update_user_id BIGINT
);

-- 8. APPOINTMENTS (Randevular)
CREATE TABLE IF NOT EXISTS iam.appointments (
    appointments_id SERIAL PRIMARY KEY,
    users_id BIGINT NOT NULL, -- Müşteri
    barber_id INTEGER NOT NULL REFERENCES iam.users(users_id) ON DELETE RESTRICT, -- Seçili berber
    branch_id INTEGER NOT NULL REFERENCES iam.branches(branch_id) ON DELETE RESTRICT, -- Nerede kesilecek
    services_id INTEGER NOT NULL REFERENCES iam.services(services_id) ON DELETE RESTRICT,
    appointment_date DATE NOT NULL, 
    appointment_time TIME NOT NULL,
    appointment_status VARCHAR(20) DEFAULT 'pending', 
    insert_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_user_id BIGINT,
    update_datetime TIMESTAMP,
    update_user_id BIGINT
);
