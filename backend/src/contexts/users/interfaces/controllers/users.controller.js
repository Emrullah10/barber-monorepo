import usersUseCase from '../../application/use-cases/users.use-case.js';

export const getAllUsers = async (req, caller) => {
  // Makro pattern: req nesnesi doğrudan gelir, içinden body/query alınır
  return await usersUseCase.listAllUsers(req, caller);
};

export const createUser = async (req, caller) => {
  return await usersUseCase.registerUser(req, caller);
};

export const getBarbers = async (req, caller) => {
  return await usersUseCase.listBarbers(req, caller);
};

export const getBarberById = async (req, caller) => {
  return await usersUseCase.getBarberById(req, caller);
};

export const updateProfile = async (req, caller) => {
  return await usersUseCase.updateProfile(req, caller);
};

export const changeUserType = async (req, caller) => {
  return await usersUseCase.changeUserType(req, caller);
};

export default {
  getAllUsers,
  createUser,
  getBarbers,
  getBarberById,
  updateProfile,
  changeUserType,
};
