import authUseCase from '../../application/use-cases/auth.use-case.js';

export const login = async (req, caller) => {
  return await authUseCase.login(req, caller);
};

export const register = async (req, caller) => {
  return await authUseCase.register(req, caller);
};

export default {
  login,
  register,
};
