import { routeResponse } from "../src/infrastructure/helper/route-wrapper.js";
import express from "express";

import usersController from "../src/contexts/users/interfaces/controllers/users.controller.js";
import authController from "../src/contexts/auth/interfaces/controllers/auth.controller.js";
import servicesController from "../src/contexts/services/interfaces/controllers/services.controller.js";
import appointmentsController from "../src/contexts/appointments/interfaces/controllers/appointments.controller.js";
import availabilityController from "../src/contexts/barber_availability/interfaces/controllers/barber_availability.controller.js";
import reportsController from "../src/contexts/reports/interfaces/controllers/reports.controller.js";
import tenantsController from "../src/contexts/tenants/interfaces/controllers/tenants.controller.js";
import { requireAuth, requireType } from "../middlewares/auth.middleware.js";

const router = express.Router();

// --- USERS ---
const getUsers = async (req, res, next) => {
  routeResponse(req, res, next, getUsers.name, usersController.getAllUsers);
};
const postUsers = async (req, res, next) => {
  routeResponse(req, res, next, postUsers.name, usersController.createUser);
};
const getBarbers = async (req, res, next) => {
  routeResponse(req, res, next, getBarbers.name, usersController.getBarbers, true);
};
const getBarberById = async (req, res, next) => {
  routeResponse(req, res, next, getBarberById.name, usersController.getBarberById, true);
};
const putProfile = async (req, res, next) => {
  routeResponse(req, res, next, putProfile.name, usersController.updateProfile);
};
const patchUserType = async (req, res, next) => {
  routeResponse(req, res, next, patchUserType.name, usersController.changeUserType);
};

// --- AUTH ---
const postLogin = async (req, res, next) => {
  routeResponse(req, res, next, postLogin.name, authController.login, true);
};
const postRegister = async (req, res, next) => {
  routeResponse(req, res, next, postRegister.name, authController.register, true);
};

// --- SERVICES ---
const getServices = async (req, res, next) => {
  routeResponse(req, res, next, getServices.name, servicesController.getAllServices);
};
const getPublicServices = async (req, res, next) => {
  routeResponse(req, res, next, getPublicServices.name, servicesController.getAllServices, true);
};
const postService = async (req, res, next) => {
  routeResponse(req, res, next, postService.name, servicesController.createService);
};
const putService = async (req, res, next) => {
  routeResponse(req, res, next, putService.name, servicesController.updateService);
};
const deleteServiceHandler = async (req, res, next) => {
  routeResponse(req, res, next, deleteServiceHandler.name, servicesController.deleteService);
};

// --- APPOINTMENTS ---
const postAppointment = async (req, res, next) => {
  routeResponse(req, res, next, postAppointment.name, appointmentsController.createAppointment);
};
const getMyAppointments = async (req, res, next) => {
  routeResponse(req, res, next, getMyAppointments.name, appointmentsController.getMyAppointments);
};
const getBarberAppointments = async (req, res, next) => {
  routeResponse(req, res, next, getBarberAppointments.name, appointmentsController.getBarberAppointments);
};
const getAllAppointments = async (req, res, next) => {
  routeResponse(req, res, next, getAllAppointments.name, appointmentsController.getAllAppointments);
};
const patchAppointmentStatus = async (req, res, next) => {
  routeResponse(req, res, next, patchAppointmentStatus.name, appointmentsController.patchAppointmentStatus);
};

// --- AVAILABILITY ---
const getMyAvailability = async (req, res, next) => {
  routeResponse(req, res, next, getMyAvailability.name, availabilityController.getMyAvailability);
};
const putMyAvailability = async (req, res, next) => {
  routeResponse(req, res, next, putMyAvailability.name, availabilityController.updateAvailability);
};

// --- REPORTS ---
const getRevenueReport = async (req, res, next) => {
  routeResponse(req, res, next, getRevenueReport.name, reportsController.getRevenueSummary);
};
const getPopularServicesReport = async (req, res, next) => {
  routeResponse(req, res, next, getPopularServicesReport.name, reportsController.getPopularServices);
};
const getStatsReport = async (req, res, next) => {
  routeResponse(req, res, next, getStatsReport.name, reportsController.getAppointmentStats);
};
const getCustomerReport = async (req, res, next) => {
  routeResponse(req, res, next, getCustomerReport.name, reportsController.getCustomerAnalysis);
};
const getTrendReport = async (req, res, next) => {
  routeResponse(req, res, next, getTrendReport.name, reportsController.getMonthlyTrend);
};

// --- TENANTS (Dükkanlar) ---
const getTenants = async (req, res, next) => {
  routeResponse(req, res, next, getTenants.name, tenantsController.listTenants, true);
};
const getTenantBySlug = async (req, res, next) => {
  routeResponse(req, res, next, getTenantBySlug.name, tenantsController.getTenantBySlug, true);
};
const getTenantById = async (req, res, next) => {
  routeResponse(req, res, next, getTenantById.name, tenantsController.getTenantById);
};
const postTenant = async (req, res, next) => {
  routeResponse(req, res, next, postTenant.name, tenantsController.createTenant);
};
const putTenant = async (req, res, next) => {
  routeResponse(req, res, next, putTenant.name, tenantsController.updateTenant);
};
const getTenantBarbers = async (req, res, next) => {
  routeResponse(req, res, next, getTenantBarbers.name, tenantsController.getTenantBarbers, true);
};
const postTenantBarber = async (req, res, next) => {
  routeResponse(req, res, next, postTenantBarber.name, tenantsController.addBarber);
};
const deleteTenantBarber = async (req, res, next) => {
  routeResponse(req, res, next, deleteTenantBarber.name, tenantsController.removeBarber);
};
const postOnboardShop = async (req, res, next) => {
  routeResponse(req, res, next, postOnboardShop.name, tenantsController.onboardShop);
};

// ====== ROUTE TANIMLARI ======

// Public
router.post("/login", postLogin);
router.post("/register", postRegister);
router.get("/barbers", getBarbers);

// Users (auth gerekli)
router.get("/users", requireAuth, requireType('admin'), getUsers);
router.post("/users", requireAuth, postUsers);
router.get("/barbers/:id", getBarberById);
router.put("/profile", requireAuth, putProfile);
router.patch("/users/:id/type", requireAuth, requireType('admin'), patchUserType);

// Services
router.get("/services/public", getPublicServices);
router.get("/services", requireAuth, getServices);
router.post("/services", requireAuth, requireType('manager_barber', 'admin'), postService);
router.put("/services/:servicesId", requireAuth, requireType('manager_barber', 'admin'), putService);
router.delete("/services/:servicesId", requireAuth, requireType('manager_barber', 'admin'), deleteServiceHandler);

// Appointments
router.post("/appointments", requireAuth, postAppointment);
router.get("/appointments/my", requireAuth, getMyAppointments);
router.get("/appointments/barber", requireAuth, getBarberAppointments);
router.get("/appointments/all", requireAuth, requireType('manager_barber', 'admin'), getAllAppointments);
router.patch("/appointments/:appointmentsId/status", requireAuth, patchAppointmentStatus);

// Availability (berber kendi müsaitliği)
router.get("/availability", requireAuth, getMyAvailability);
router.put("/availability", requireAuth, putMyAvailability);

// Reports
router.get("/reports/revenue", requireAuth, getRevenueReport);
router.get("/reports/services", requireAuth, getPopularServicesReport);
router.get("/reports/stats", requireAuth, getStatsReport);
router.get("/reports/customers", requireAuth, requireType('manager_barber', 'admin'), getCustomerReport);
router.get("/reports/trend", requireAuth, getTrendReport);

// Tenants (Dükkanlar)
router.get("/tenants", getTenants);
router.get("/tenants/slug/:slug", getTenantBySlug);
router.get("/tenants/:tenantId", requireAuth, getTenantById);
router.post("/tenants", requireAuth, requireType('admin'), postTenant);
router.put("/tenants/:tenantId", requireAuth, requireType('manager_barber', 'admin'), putTenant);
router.get("/tenants/:tenantId/barbers", getTenantBarbers);
router.post("/tenants/:tenantId/barbers", requireAuth, requireType('manager_barber', 'admin'), postTenantBarber);
router.delete("/tenants/:tenantId/barbers/:usersId", requireAuth, requireType('manager_barber', 'admin'), deleteTenantBarber);
router.post("/onboard/shop", requireAuth, postOnboardShop);

export default router;
