export const makeAuthController = ({ useCases }) => ({
  login: async (req, caller) => useCases.login(req, caller),
  register: async (req, caller) => useCases.register(req, caller),
});
