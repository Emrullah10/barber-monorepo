export const makeFakeQuery = (responses) => {
  let call = 0;
  return async (text, params) => {
    const response = Array.isArray(responses) ? responses[call] : responses(text, params, call);
    call += 1;
    return response ?? { rows: [] };
  };
};
