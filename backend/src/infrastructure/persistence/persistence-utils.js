import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL veritabanı bağlantı havuzumuz
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.on('error', (err) => {
    console.error('Beklenmeyen Veritabanı Hatası:', err);
    process.exit(-1);
});

// Senin örneğindeki gibi projeye dışarıdan açılan sorgu çalıştırma metodu (Exec Script mantığı)
export const query = async (text, params) => {
    // Burada pool.query çağırıyoruz, ileride bağlantıyı kapatmak (release) için client'da kullanabiliriz
    return pool.query(text, params);
};

export default {
    query,
    pool
};
