-- Yeni monorepo şemasını mevcut (Faz 5 öncesi) veritabanına uygular.
-- Kod, appointments/barber_availability üzerinde tenant_id filtresi kullanıyordu
-- ama kolon şemada yoktu (raporlar ve tenant'lı randevu listeleri 500 ile patlıyordu).
-- tenant_users tablosu da hiç yoktu (login'in tenant bilgisini çektiği tablo).

CREATE TABLE IF NOT EXISTS iam.tenant_users (
    tenant_users_id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES iam.tenants(tenant_id) ON DELETE CASCADE,
    users_id INTEGER NOT NULL REFERENCES iam.users(users_id) ON DELETE CASCADE,
    role_in_tenant VARCHAR(50) NOT NULL DEFAULT 'barber',
    is_active BOOLEAN DEFAULT true,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tenant_id, users_id)
);

ALTER TABLE iam.tenants ADD COLUMN IF NOT EXISTS owner_user_id INTEGER;
ALTER TABLE iam.tenants ADD COLUMN IF NOT EXISTS tenant_latitude DECIMAL(10, 8);
ALTER TABLE iam.tenants ADD COLUMN IF NOT EXISTS tenant_longitude DECIMAL(11, 8);

ALTER TABLE iam.appointments ADD COLUMN IF NOT EXISTS tenant_id INTEGER REFERENCES iam.tenants(tenant_id) ON DELETE RESTRICT;
ALTER TABLE iam.appointments ALTER COLUMN branch_id DROP NOT NULL;
ALTER TABLE iam.appointments ALTER COLUMN barber_id DROP NOT NULL;

ALTER TABLE iam.barber_availability ADD COLUMN IF NOT EXISTS tenant_id INTEGER REFERENCES iam.tenants(tenant_id) ON DELETE CASCADE;
ALTER TABLE iam.barber_availability ALTER COLUMN branch_id DROP NOT NULL;
ALTER TABLE iam.barber_availability ADD CONSTRAINT barber_availability_barber_day_unique UNIQUE (barber_id, day_of_week);
