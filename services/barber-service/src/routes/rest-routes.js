import express from 'express';
import { routeResponse } from '@barber/helper';
import { makeRequireAuth, requireType } from '@barber/middlewares';

export const buildRestRoutes = ({ controllers, appConfig }) => {
  const {
    usersController, authController, servicesController,
    appointmentsController, availabilityController, reportsController, tenantsController,
  } = controllers;

  const requireAuth = makeRequireAuth({ jwtSecret: appConfig.jwtSecret });
  const router = express.Router();

  // --- USERS ---
  const getUsers = (req, res, next) => routeResponse(req, res, next, 'getUsers', usersController.getAllUsers);
  const postUsers = (req, res, next) => routeResponse(req, res, next, 'postUsers', usersController.createUser);
  const getBarbers = (req, res, next) => routeResponse(req, res, next, 'getBarbers', usersController.getBarbers, true);
  const getBarberById = (req, res, next) => routeResponse(req, res, next, 'getBarberById', usersController.getBarberById, true);
  const putProfile = (req, res, next) => routeResponse(req, res, next, 'putProfile', usersController.updateProfile);
  const patchUserType = (req, res, next) => routeResponse(req, res, next, 'patchUserType', usersController.changeUserType);

  // --- AUTH ---
  const postLogin = (req, res, next) => routeResponse(req, res, next, 'postLogin', authController.login, true);
  const postRegister = (req, res, next) => routeResponse(req, res, next, 'postRegister', authController.register, true);

  // --- SERVICES ---
  const getServices = (req, res, next) => routeResponse(req, res, next, 'getServices', servicesController.getAllServices);
  const getPublicServices = (req, res, next) => routeResponse(req, res, next, 'getPublicServices', servicesController.getAllServices, true);
  const postService = (req, res, next) => routeResponse(req, res, next, 'postService', servicesController.createService);
  const putService = (req, res, next) => routeResponse(req, res, next, 'putService', servicesController.updateService);
  const deleteServiceHandler = (req, res, next) => routeResponse(req, res, next, 'deleteService', servicesController.deleteService);

  // --- APPOINTMENTS ---
  const postAppointment = (req, res, next) => routeResponse(req, res, next, 'postAppointment', appointmentsController.createAppointment);
  const getMyAppointments = (req, res, next) => routeResponse(req, res, next, 'getMyAppointments', appointmentsController.getMyAppointments);
  const getBarberAppointments = (req, res, next) => routeResponse(req, res, next, 'getBarberAppointments', appointmentsController.getBarberAppointments);
  const getAllAppointments = (req, res, next) => routeResponse(req, res, next, 'getAllAppointments', appointmentsController.getAllAppointments);
  const patchAppointmentStatus = (req, res, next) => routeResponse(req, res, next, 'patchAppointmentStatus', appointmentsController.patchAppointmentStatus);

  // --- AVAILABILITY ---
  const getMyAvailability = (req, res, next) => routeResponse(req, res, next, 'getMyAvailability', availabilityController.getMyAvailability);
  const putMyAvailability = (req, res, next) => routeResponse(req, res, next, 'putMyAvailability', availabilityController.updateAvailability);

  // --- REPORTS ---
  const getRevenueReport = (req, res, next) => routeResponse(req, res, next, 'getRevenueReport', reportsController.getRevenueSummary);
  const getPopularServicesReport = (req, res, next) => routeResponse(req, res, next, 'getPopularServicesReport', reportsController.getPopularServices);
  const getStatsReport = (req, res, next) => routeResponse(req, res, next, 'getStatsReport', reportsController.getAppointmentStats);
  const getCustomerReport = (req, res, next) => routeResponse(req, res, next, 'getCustomerReport', reportsController.getCustomerAnalysis);
  const getTrendReport = (req, res, next) => routeResponse(req, res, next, 'getTrendReport', reportsController.getMonthlyTrend);

  // --- TENANTS ---
  const getTenants = (req, res, next) => routeResponse(req, res, next, 'getTenants', tenantsController.listTenants, true);
  const getTenantBySlug = (req, res, next) => routeResponse(req, res, next, 'getTenantBySlug', tenantsController.getTenantBySlug, true);
  const getTenantById = (req, res, next) => routeResponse(req, res, next, 'getTenantById', tenantsController.getTenantById);
  const postTenant = (req, res, next) => routeResponse(req, res, next, 'postTenant', tenantsController.createTenant);
  const putTenant = (req, res, next) => routeResponse(req, res, next, 'putTenant', tenantsController.updateTenant);
  const getTenantBarbers = (req, res, next) => routeResponse(req, res, next, 'getTenantBarbers', tenantsController.getTenantBarbers, true);
  const postTenantBarber = (req, res, next) => routeResponse(req, res, next, 'postTenantBarber', tenantsController.addBarber);
  const deleteTenantBarber = (req, res, next) => routeResponse(req, res, next, 'deleteTenantBarber', tenantsController.removeBarber);
  const postOnboardShop = (req, res, next) => routeResponse(req, res, next, 'postOnboardShop', tenantsController.onboardShop);

  // ====== ROUTE TANIMLARI ======

  router.post('/login', postLogin);
  router.post('/register', postRegister);
  router.get('/barbers', getBarbers);

  router.get('/users', requireAuth, requireType('admin'), getUsers);
  router.post('/users', requireAuth, postUsers);
  router.get('/barbers/:id', getBarberById);
  router.put('/profile', requireAuth, putProfile);
  router.patch('/users/:id/type', requireAuth, requireType('admin'), patchUserType);

  router.get('/services/public', getPublicServices);
  router.get('/services', requireAuth, getServices);
  router.post('/services', requireAuth, requireType('manager_barber', 'admin'), postService);
  router.put('/services/:servicesId', requireAuth, requireType('manager_barber', 'admin'), putService);
  router.delete('/services/:servicesId', requireAuth, requireType('manager_barber', 'admin'), deleteServiceHandler);

  router.post('/appointments', requireAuth, postAppointment);
  router.get('/appointments/my', requireAuth, getMyAppointments);
  router.get('/appointments/barber', requireAuth, getBarberAppointments);
  router.get('/appointments/all', requireAuth, requireType('manager_barber', 'admin'), getAllAppointments);
  router.patch('/appointments/:appointmentsId/status', requireAuth, patchAppointmentStatus);

  router.get('/availability', requireAuth, getMyAvailability);
  router.put('/availability', requireAuth, putMyAvailability);

  router.get('/reports/revenue', requireAuth, getRevenueReport);
  router.get('/reports/services', requireAuth, getPopularServicesReport);
  router.get('/reports/stats', requireAuth, getStatsReport);
  router.get('/reports/customers', requireAuth, requireType('manager_barber', 'admin'), getCustomerReport);
  router.get('/reports/trend', requireAuth, getTrendReport);

  router.get('/tenants', getTenants);
  router.get('/tenants/slug/:slug', getTenantBySlug);
  router.get('/tenants/:tenantId', requireAuth, getTenantById);
  router.post('/tenants', requireAuth, requireType('admin'), postTenant);
  router.put('/tenants/:tenantId', requireAuth, requireType('manager_barber', 'admin'), putTenant);
  router.get('/tenants/:tenantId/barbers', getTenantBarbers);
  router.post('/tenants/:tenantId/barbers', requireAuth, requireType('manager_barber', 'admin'), postTenantBarber);
  router.delete('/tenants/:tenantId/barbers/:usersId', requireAuth, requireType('manager_barber', 'admin'), deleteTenantBarber);
  router.post('/onboard/shop', requireAuth, postOnboardShop);

  return router;
};
