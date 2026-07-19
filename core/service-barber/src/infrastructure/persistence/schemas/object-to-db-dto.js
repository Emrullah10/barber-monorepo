export const objectToDbDto = (schema, data) => {
  const result = {};
  if (!data || !schema) return result;

  Object.keys(schema).forEach((key) => {
    const column = schema[key];
    if (data[column.camelCase] !== undefined) {
      result[column.original] = data[column.camelCase];
    }
  });

  return result;
};

export const dbDtoToObject = (schema, data) => {
  const result = {};
  if (!data || !schema) return result;

  Object.keys(schema).forEach((key) => {
    const column = schema[key];
    if (data[column.original] !== undefined) {
      result[column.camelCase] = data[column.original];
    }
  });

  return result;
};
