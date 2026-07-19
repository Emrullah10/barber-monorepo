import pkg from 'pg';

const { Pool } = pkg;

export const makePool = (datasourceConfig) => {
  const pool = new Pool(datasourceConfig);
  pool.on('error', (err) => {
    console.error('Beklenmeyen Veritabanı Hatası:', err);
    process.exit(-1);
  });
  return pool;
};

export const makeQuery = (pool) => async (text, params) => pool.query(text, params);
