import { query } from '../../../../infrastructure/persistence/persistence-utils.js';
import { CustomError } from '../../../../shared/utils/custom-error.js';

// Berber kendi verisini görür; manager/admin tümünü
const getBarberFilter = (caller, requestedBarberId) => {
  const isManagerOrAdmin = ['admin', 'manager_barber'].includes(caller.userTypeCode);
  if (isManagerOrAdmin && requestedBarberId) return parseInt(requestedBarberId);
  if (isManagerOrAdmin && !requestedBarberId) return null; // tümü
  return caller.usersId; // sadece kendi
};

const getTenantFilter = (caller, alias = 'a') => {
  if (caller.tenantId) return ` AND ${alias}.tenant_id = ${caller.tenantId}`;
  return '';
};

export const getRevenueSummary = async (data, caller) => {
  const { period = 'monthly', barberId: reqBarberId } = data.query || {};
  const targetBarberId = getBarberFilter(caller, reqBarberId);

  let dateFilter = '';
  if (period === 'daily') dateFilter = `AND a.appointment_date = CURRENT_DATE`;
  else if (period === 'weekly') dateFilter = `AND a.appointment_date >= CURRENT_DATE - INTERVAL '7 days'`;
  else dateFilter = `AND DATE_TRUNC('month', a.appointment_date) = DATE_TRUNC('month', CURRENT_DATE)`;

  const barberFilter = targetBarberId ? `AND a.barber_id = ${targetBarberId}` : '';

  const text = `
    SELECT
      COUNT(*) AS total_appointments,
      COUNT(*) FILTER (WHERE a.appointment_status = 'completed') AS completed_count,
      COUNT(*) FILTER (WHERE a.appointment_status = 'cancelled') AS cancelled_count,
      COUNT(*) FILTER (WHERE a.appointment_status = 'pending') AS pending_count,
      COALESCE(SUM(s.services_price) FILTER (WHERE a.appointment_status = 'completed'), 0) AS total_revenue
    FROM iam.appointments a
    LEFT JOIN iam.services s ON a.services_id = s.services_id
    WHERE 1=1 ${dateFilter} ${barberFilter}${getTenantFilter(caller)};
  `;

  const { rows } = await query(text);
  const row = rows[0];

  return {
    success: true,
    message: 'Gelir özeti getirildi.',
    data: {
      period,
      totalAppointments: parseInt(row.total_appointments),
      completedCount: parseInt(row.completed_count),
      cancelledCount: parseInt(row.cancelled_count),
      pendingCount: parseInt(row.pending_count),
      totalRevenue: parseFloat(row.total_revenue),
    }
  };
};

export const getPopularServices = async (data, caller) => {
  const { barberId: reqBarberId } = data.query || {};
  const targetBarberId = getBarberFilter(caller, reqBarberId);
  const barberFilter = targetBarberId ? `AND a.barber_id = ${targetBarberId}` : '';

  const text = `
    SELECT
      s.services_id,
      s.services_name,
      s.services_price,
      COUNT(a.appointments_id) AS booking_count,
      COALESCE(SUM(s.services_price) FILTER (WHERE a.appointment_status = 'completed'), 0) AS revenue
    FROM iam.services s
    LEFT JOIN iam.appointments a ON a.services_id = s.services_id ${barberFilter}${getTenantFilter(caller)}
    GROUP BY s.services_id, s.services_name, s.services_price
    ORDER BY booking_count DESC
    LIMIT 10;
  `;

  const { rows } = await query(text);
  return {
    success: true,
    message: 'Popüler hizmetler getirildi.',
    list: rows.map(r => ({
      servicesId: r.services_id,
      servicesName: r.services_name,
      servicesPrice: parseFloat(r.services_price),
      bookingCount: parseInt(r.booking_count),
      revenue: parseFloat(r.revenue),
    }))
  };
};

export const getAppointmentStats = async (data, caller) => {
  const { barberId: reqBarberId } = data.query || {};
  const targetBarberId = getBarberFilter(caller, reqBarberId);
  const barberFilter = targetBarberId ? `AND barber_id = ${targetBarberId}` : '';

  const text = `
    SELECT
      appointment_status,
      COUNT(*) AS count
    FROM iam.appointments a
    WHERE 1=1 ${barberFilter.replace('barber_id', 'a.barber_id')}${getTenantFilter(caller)}
    GROUP BY a.appointment_status;
  `;

  const { rows } = await query(text);
  const stats = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
  rows.forEach(r => { stats[r.appointment_status] = parseInt(r.count || 0); });
  const total = Object.values(stats).reduce((a, b) => a + b, 0);

  return { success: true, message: 'İstatistikler getirildi.', data: { ...stats, total } };
};

export const getCustomerAnalysis = async (data, caller) => {
  if (!['admin', 'manager_barber'].includes(caller.userTypeCode)) {
    throw new CustomError('Bu rapor için yetkiniz bulunmuyor.', 403);
  }
  const { barberId: reqBarberId } = data.query || {};
  const targetBarberId = getBarberFilter(caller, reqBarberId);
  const barberFilter = targetBarberId ? `AND a.barber_id = ${targetBarberId}` : '';

  const text = `
    SELECT
      u.users_id,
      u.users_name,
      COUNT(a.appointments_id) AS total_visits,
      MAX(a.appointment_date) AS last_visit,
      MIN(a.appointment_date) AS first_visit,
      COALESCE(SUM(s.services_price) FILTER (WHERE a.appointment_status = 'completed'), 0) AS total_spent
    FROM iam.users u
    JOIN iam.appointments a ON a.users_id = u.users_id
    LEFT JOIN iam.services s ON a.services_id = s.services_id
    WHERE u.users_role = 'customer' ${barberFilter}${getTenantFilter(caller)}
    GROUP BY u.users_id, u.users_name
    ORDER BY total_visits DESC
    LIMIT 20;
  `;

  const { rows } = await query(text);
  return {
    success: true,
    message: 'Müşteri analizi getirildi.',
    list: rows.map(r => ({
      usersId: r.users_id,
      usersName: r.users_name,
      totalVisits: parseInt(r.total_visits),
      lastVisit: r.last_visit,
      firstVisit: r.first_visit,
      totalSpent: parseFloat(r.total_spent),
      isReturning: parseInt(r.total_visits) > 1,
    }))
  };
};

export const getMonthlyTrend = async (data, caller) => {
  const { barberId: reqBarberId } = data.query || {};
  const targetBarberId = getBarberFilter(caller, reqBarberId);
  const barberFilter = targetBarberId ? `AND a.barber_id = ${targetBarberId}` : '';

  const text = `
    SELECT
      TO_CHAR(a.appointment_date, 'YYYY-MM') AS month,
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE a.appointment_status = 'completed') AS completed,
      COALESCE(SUM(s.services_price) FILTER (WHERE a.appointment_status = 'completed'), 0) AS revenue
    FROM iam.appointments a
    LEFT JOIN iam.services s ON a.services_id = s.services_id
    WHERE a.appointment_date >= CURRENT_DATE - INTERVAL '6 months' ${barberFilter}${getTenantFilter(caller)}
    GROUP BY TO_CHAR(a.appointment_date, 'YYYY-MM')
    ORDER BY month ASC;
  `;

  const { rows } = await query(text);
  return {
    success: true,
    message: 'Aylık trend getirildi.',
    list: rows.map(r => ({
      month: r.month,
      total: parseInt(r.total),
      completed: parseInt(r.completed),
      revenue: parseFloat(r.revenue),
    }))
  };
};

export default { getRevenueSummary, getPopularServices, getAppointmentStats, getCustomerAnalysis, getMonthlyTrend };
