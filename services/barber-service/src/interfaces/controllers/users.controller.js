export const makeUsersController = ({ useCases }) => ({
  getAllUsers: async (req, caller) => useCases.listAllUsers(req, caller),
  createUser: async (req, caller) => useCases.registerUser(req, caller),
  getBarbers: async (req, caller) => useCases.listBarbers(req, caller),
  getBarberById: async (req, caller) => useCases.getBarberById(req, caller),
  updateProfile: async (req, caller) => useCases.updateProfile(req, caller),
  changeUserType: async (req, caller) => useCases.changeUserType(req, caller),
});
