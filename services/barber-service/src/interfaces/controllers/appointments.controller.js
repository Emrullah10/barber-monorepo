export const makeAppointmentsController = ({ useCases }) => ({
  createAppointment: async (req, caller) => useCases.createAppointment(req, caller),
  getMyAppointments: async (req, caller) => useCases.listMyAppointments(req, caller),
  getBarberAppointments: async (req, caller) => useCases.listBarberAppointments(req, caller),
  getAllAppointments: async (req, caller) => useCases.listAllAppointments(req, caller),
  patchAppointmentStatus: async (req, caller) => useCases.changeAppointmentStatus(req, caller),
});
