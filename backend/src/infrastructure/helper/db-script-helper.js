import { objectToDbDto } from './object-to-db-dto.js';
import { getInsertScript, getUpdateScript } from './db-script.js';

/**
 * Mimarinin Kalbi:
 * Dışarıdan gelen herhangi bir isteğe, "Kim İstiyor?" (caller) bağlamını otomatik olarak
 * SQL'e enjekte eden ve sorguyu hazırlayan Şef Yardımcısı.
 */

// Sistemin her kayda otomatik atacağı, kim oluşturdu bilgisi
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

const getDefaultUpdatedColumns = (caller) => {
    return {
        updated_at: new Date(),
        updated_by: caller?.userId || 'system',
    };
};

/**
 * Controller-UseCase üzerinden gelen saf veriyi, Veritabanına YAZMAYA (Insert) hazırlar.
 * @param {string} tableName - Tablo adı
 * @param {Object} data - JS Formatındaki Data objesi
 * @param {Object} schema - Tablonun Şeması (Sözlük)
 * @param {Object} caller - İsteği atan kişinin bilgisi (Header'dan gelen)
 */
export const createScript = (tableName, data, schema, caller) => {
    // 1. Önce JS datasını SQL kolonlarına (snake_case) çevirerek temizle
    const mappedObj = objectToDbDto(schema, data);

    // 2. Caller nesnesinden çıkarttığımız "Oluşturulma Bilgilerini" sessizce objeye göm
    const dbObj = {
        ...mappedObj,
        ...getDefaultCreatedColumns(caller)
    };

    // 3. Script Üreticiyi (db-script.js) çağır ve SQL Cümlesine dök!
    return getInsertScript(tableName, dbObj);
};

/**
 * Controller-UseCase üzerinden gelen saf veriyi, Veritabanında GÜNCELLEMEYE (Update) hazırlar.
 */
export const updateScript = (tableName, data, schema, caller, whereClause, startingIndex = 1) => {
    const mappedObj = objectToDbDto(schema, data);

    const dbObj = {
        ...mappedObj,
        ...getDefaultUpdatedColumns(caller)
    };

    return getUpdateScript(tableName, dbObj, whereClause, startingIndex);
};
