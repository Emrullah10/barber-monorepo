/**
 * Gelen JS Objelerini (camelCase), Veritabanının Beklediği Şemaya (snake_case) Dönüştürür.
 * Makro Pattern: Şemadaki 'camelCase' ismine bakar, 'original' ismine yazar.
 * 
 * @param {Object} schema - Tablonun kolon tanımları (örn: users.users)
 * @param {Object} data - JS dünyasından gelen veri (örn: req.body)
 */
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

/**
 * Veritabanından gelen verileri (snake_case), JS dünyasının beklediği formata (camelCase) çevirir.
 * Makro Pattern: Şemadaki 'original' ismine bakar, 'camelCase' ismine yazar.
 * 
 * @param {Object} schema - Tablonun kolon tanımları
 * @param {Object} data - Veritabanından dönen satır (row)
 */
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
