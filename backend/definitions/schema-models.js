export const users = {
  table: { dbName: 'barber_app', schemaName: 'iam', tableName: 'users', tableNameWithSchema: 'iam.users' },
  users: {
    usersId: { original: 'users_id', camelCase: 'usersId', isPrimaryKey: true },
    usersCode: { original: 'users_code', camelCase: 'usersCode', isUnique: true },
    tenantId: { original: 'tenant_id', camelCase: 'tenantId' },
    branchId: { original: 'branch_id', camelCase: 'branchId' },
    usersName: { original: 'users_name', camelCase: 'usersName' },
    usersEmail: { original: 'users_email', camelCase: 'usersEmail', isUnique: true },
    usersPassword: { original: 'users_password', camelCase: 'usersPassword' },
    userTypeCode: { original: 'user_type_code', camelCase: 'userTypeCode' },
    usersRole: { original: 'users_role', camelCase: 'usersRole' },
    usersSpecialty: { original: 'users_specialty', camelCase: 'usersSpecialty' },
    usersBio: { original: 'users_bio', camelCase: 'usersBio' },
    usersPhotoUrl: { original: 'users_photo_url', camelCase: 'usersPhotoUrl' },
    createdBy: { original: 'created_by', camelCase: 'createdBy' },
    updatedBy: { original: 'updated_by', camelCase: 'updatedBy' },
    createdAt: { original: 'created_at', camelCase: 'createdAt' },
    updatedAt: { original: 'updated_at', camelCase: 'updatedAt' },
  },
};

export const userTypes = {
  table: { dbName: 'barber_app', schemaName: 'iam', tableName: 'user_types', tableNameWithSchema: 'iam.user_types' },
  userTypes: {
    userTypesId: { original: 'user_types_id', camelCase: 'userTypesId', isPrimaryKey: true },
    userTypesCode: { original: 'user_types_code', camelCase: 'userTypesCode', isUnique: true },
    userTypesName: { original: 'user_types_name', camelCase: 'userTypesName' },
    userTypesDesc: { original: 'user_types_desc', camelCase: 'userTypesDesc' },
    insertDatetime: { original: 'insert_datetime', camelCase: 'insertDatetime' }
  },
};

export const tenants = {
  table: { dbName: 'barber_app', schemaName: 'iam', tableName: 'tenants', tableNameWithSchema: 'iam.tenants' },
  tenants: {
    tenantId: { original: 'tenant_id', camelCase: 'tenantId', isPrimaryKey: true },
    tenantCode: { original: 'tenant_code', camelCase: 'tenantCode', isUnique: true },
    tenantName: { original: 'tenant_name', camelCase: 'tenantName' },
    tenantSlug: { original: 'tenant_slug', camelCase: 'tenantSlug', isUnique: true },
    tenantPhone: { original: 'tenant_phone', camelCase: 'tenantPhone' },
    tenantEmail: { original: 'tenant_email', camelCase: 'tenantEmail' },
    tenantAddress: { original: 'tenant_address', camelCase: 'tenantAddress' },
    tenantCity: { original: 'tenant_city', camelCase: 'tenantCity' },
    tenantPhotoUrl: { original: 'tenant_photo_url', camelCase: 'tenantPhotoUrl' },
    tenantIsActive: { original: 'tenant_is_active', camelCase: 'tenantIsActive' },
    createdAt: { original: 'created_at', camelCase: 'createdAt' },
    updatedAt: { original: 'updated_at', camelCase: 'updatedAt' },
  },
};

export const branches = {
  table: { dbName: 'barber_app', schemaName: 'iam', tableName: 'branches', tableNameWithSchema: 'iam.branches' },
  branches: {
    branchId: { original: 'branch_id', camelCase: 'branchId', isPrimaryKey: true },
    tenantId: { original: 'tenant_id', camelCase: 'tenantId' },
    branchCode: { original: 'branch_code', camelCase: 'branchCode', isUnique: true },
    branchName: { original: 'branch_name', camelCase: 'branchName' },
    branchAddress: { original: 'branch_address', camelCase: 'branchAddress' },
    branchPhone: { original: 'branch_phone', camelCase: 'branchPhone' },
    branchLatitude: { original: 'branch_latitude', camelCase: 'branchLatitude' },
    branchLongitude: { original: 'branch_longitude', camelCase: 'branchLongitude' },
    branchIsActive: { original: 'branch_is_active', camelCase: 'branchIsActive' },
    createdAt: { original: 'created_at', camelCase: 'createdAt' },
    updatedAt: { original: 'updated_at', camelCase: 'updatedAt' },
  },
};

export const services = {
  table: { dbName: 'barber_app', schemaName: 'iam', tableName: 'services', tableNameWithSchema: 'iam.services' },
  services: {
    servicesId: { original: 'services_id', camelCase: 'servicesId', isPrimaryKey: true },
    tenantId: { original: 'tenant_id', camelCase: 'tenantId' },
    servicesName: { original: 'services_name', camelCase: 'servicesName' },
    servicesPrice: { original: 'services_price', camelCase: 'servicesPrice' },
    servicesDurationMin: { original: 'services_duration_min', camelCase: 'servicesDurationMin' },
    servicesIsActive: { original: 'services_is_active', camelCase: 'servicesIsActive' },
    insertDatetime: { original: 'insert_datetime', camelCase: 'insertDatetime' },
    insertUserId: { original: 'insert_user_id', camelCase: 'insertUserId' },
    updateDatetime: { original: 'update_datetime', camelCase: 'updateDatetime' },
    updateUserId: { original: 'update_user_id', camelCase: 'updateUserId' },
  },
};

export const barberAvailability = {
  table: { dbName: 'barber_app', schemaName: 'iam', tableName: 'barber_availability', tableNameWithSchema: 'iam.barber_availability' },
  barberAvailability: {
    availabilityId: { original: 'availability_id', camelCase: 'availabilityId', isPrimaryKey: true },
    barberId: { original: 'barber_id', camelCase: 'barberId' },
    branchId: { original: 'branch_id', camelCase: 'branchId' },
    dayOfWeek: { original: 'day_of_week', camelCase: 'dayOfWeek' },
    startTime: { original: 'start_time', camelCase: 'startTime' },
    endTime: { original: 'end_time', camelCase: 'endTime' },
    isActive: { original: 'is_active', camelCase: 'isActive' },
    insertDatetime: { original: 'insert_datetime', camelCase: 'insertDatetime' },
    insertUserId: { original: 'insert_user_id', camelCase: 'insertUserId' },
    updateDatetime: { original: 'update_datetime', camelCase: 'updateDatetime' },
    updateUserId: { original: 'update_user_id', camelCase: 'updateUserId' },
  },
};

export const appointments = {
  table: { dbName: 'barber_app', schemaName: 'iam', tableName: 'appointments', tableNameWithSchema: 'iam.appointments' },
  appointments: {
    appointmentsId: { original: 'appointments_id', camelCase: 'appointmentsId', isPrimaryKey: true },
    usersId: { original: 'users_id', camelCase: 'usersId' },
    barberId: { original: 'barber_id', camelCase: 'barberId' },
    branchId: { original: 'branch_id', camelCase: 'branchId' },
    servicesId: { original: 'services_id', camelCase: 'servicesId' },
    appointmentDate: { original: 'appointment_date', camelCase: 'appointmentDate' },
    appointmentTime: { original: 'appointment_time', camelCase: 'appointmentTime' },
    appointmentStatus: { original: 'appointment_status', camelCase: 'appointmentStatus' },
    insertDatetime: { original: 'insert_datetime', camelCase: 'insertDatetime' },
    insertUserId: { original: 'insert_user_id', camelCase: 'insertUserId' },
    updateDatetime: { original: 'update_datetime', camelCase: 'updateDatetime' },
    updateUserId: { original: 'update_user_id', camelCase: 'updateUserId' },
  },
};

export default {
  users,
  userTypes,
  tenants,
  branches,
  services,
  barberAvailability,
  appointments,
};
