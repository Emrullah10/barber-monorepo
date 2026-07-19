export const getInsertScript = (tableName, dbObj) => {
  const columns = Object.keys(dbObj);
  if (columns.length === 0) return { script: '', data: [] };

  const values = columns.map((_, index) => `$${index + 1}`);
  const data = columns.map((key) => dbObj[key]);

  const script = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')}) RETURNING *;`;

  return { script, data };
};

export const getUpdateScript = (tableName, dbObj, whereClause, startingIndex = 1) => {
  const columns = Object.keys(dbObj);
  if (columns.length === 0) return { script: '', data: [] };

  const setString = columns.map((col, index) => `${col} = $${startingIndex + index}`).join(', ');
  const data = columns.map((key) => dbObj[key]);

  const script = `UPDATE ${tableName} SET ${setString} ${whereClause} RETURNING *;`;

  return { script, data };
};
