import { getCaller } from './get-caller.js';

export const routeResponse = async (
  req,
  res,
  next,
  callerName,
  serviceFunction,
  isPublic = false,
) => {
  try {
    if (typeof serviceFunction !== 'function') {
      throw new Error('Invalid service function provided');
    }

    const caller = getCaller(req.headers, isPublic);
    const response = await serviceFunction(req, caller);

    res.status(200).json(response);
  } catch (error) {
    error.callerName = callerName;
    error.path = req.path;
    error.method = req.method;
    next(error);
  }
};
