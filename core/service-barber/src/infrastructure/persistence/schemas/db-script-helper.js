import { objectToDbDto } from './object-to-db-dto.js';
import { getInsertScript, getUpdateScript } from './db-script.js';

const getDefaultCreatedColumns = (caller) => {
  const defaults = {
    created_at: new Date(),
    created_by: caller?.userId || 'system',
  };
  if (caller?.tenantId) {
    defaults.tenant_id = caller.tenantId;
  }
  return defaults;
};

const getDefaultUpdatedColumns = (caller) => ({
  updated_at: new Date(),
  updated_by: caller?.userId || 'system',
});

export const createScript = (tableName, data, schema, caller) => {
  const mappedObj = objectToDbDto(schema, data);
  const dbObj = { ...mappedObj, ...getDefaultCreatedColumns(caller) };
  return getInsertScript(tableName, dbObj);
};

export const updateScript = (tableName, data, schema, caller, whereClause, startingIndex = 1) => {
  const mappedObj = objectToDbDto(schema, data);
  const dbObj = { ...mappedObj, ...getDefaultUpdatedColumns(caller) };
  return getUpdateScript(tableName, dbObj, whereClause, startingIndex);
};
