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
