import reportsUseCase from '../../application/use-cases/reports.use-case.js';

export const getRevenueSummary = async (req, caller) => reportsUseCase.getRevenueSummary(req, caller);
export const getPopularServices = async (req, caller) => reportsUseCase.getPopularServices(req, caller);
export const getAppointmentStats = async (req, caller) => reportsUseCase.getAppointmentStats(req, caller);
export const getCustomerAnalysis = async (req, caller) => reportsUseCase.getCustomerAnalysis(req, caller);
export const getMonthlyTrend = async (req, caller) => reportsUseCase.getMonthlyTrend(req, caller);

export default { getRevenueSummary, getPopularServices, getAppointmentStats, getCustomerAnalysis, getMonthlyTrend };
