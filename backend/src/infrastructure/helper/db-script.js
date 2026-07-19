/**
 * Dinamik olarak INSERT ve UPDATE SQL string'leri ve parametreleri üretir.
 * Elle "$1, $2" yazma hamallığını tamamen bitirir.
 */

/**
 * Dinamik INSERT scripti oluşturur.
 * @param {string} tableName - Tablo adı (Örn: 'users')
 * @param {Object} dbObj - Veritabanına gidecek olan çevrilmiş (snake_case) obje
 * @returns { {script: string, data: any[]} }
 */
export const getInsertScript = (tableName, dbObj) => {
    const columns = Object.keys(dbObj);

    // Eğer obje boşsa hata fırlatmamak için boş obje dön
    if (columns.length === 0) return { script: '', data: [] };

    // Sütunlara karşılık gelen parametreleri (Örn: $1, $2, $3) oluştur
    const values = columns.map((_, index) => `$${index + 1}`);
    const data = columns.map(key => dbObj[key]);

    const script = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')}) RETURNING *;`;

    return { script, data };
};

/**
 * Dinamik UPDATE scripti oluşturur.
 * @param {string} tableName - Tablo adı
 * @param {Object} dbObj - Güncellenecek olan kolonlar
 * @param {string} whereClause - 'WHERE users_code = $X' stringi
 * @param {number} startingIndex - WHERE koşulunun kullandığı değişkene çarpmasın diye kaçtan ($3, $4) başlayacağı
 * @returns { {script: string, data: any[]} }
 */
export const getUpdateScript = (tableName, dbObj, whereClause, startingIndex = 1) => {
    const columns = Object.keys(dbObj);

    if (columns.length === 0) return { script: '', data: [] };

    // UPDATE tablename SET col1 = $2, col2 = $3 formatına getir
    const setString = columns.map((col, index) => `${col} = $${startingIndex + index}`).join(', ');
    const data = columns.map(key => dbObj[key]);

    const script = `UPDATE ${tableName} SET ${setString} ${whereClause} RETURNING *;`;

    return { script, data };
};
