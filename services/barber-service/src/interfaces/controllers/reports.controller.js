export const makeReportsController = ({ useCases }) => ({
  getRevenueSummary: async (req, caller) => useCases.getRevenueSummary(req, caller),
  getPopularServices: async (req, caller) => useCases.getPopularServices(req, caller),
  getAppointmentStats: async (req, caller) => useCases.getAppointmentStats(req, caller),
  getCustomerAnalysis: async (req, caller) => useCases.getCustomerAnalysis(req, caller),
  getMonthlyTrend: async (req, caller) => useCases.getMonthlyTrend(req, caller),
});
