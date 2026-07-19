import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import bcrypt from 'bcrypt';
import pkg from 'pg';

const { Pool } = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../services/barber-service/.env') });

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const isBcryptHash = (value) => typeof value === 'string' && value.startsWith('$2');

const run = async () => {
  const { rows } = await pool.query('SELECT users_id, users_password FROM iam.users;');

  let migrated = 0;
  for (const row of rows) {
    if (isBcryptHash(row.users_password)) continue;
    const hash = await bcrypt.hash(row.users_password, 10);
    await pool.query('UPDATE iam.users SET users_password = $1 WHERE users_id = $2;', [hash, row.users_id]);
    migrated += 1;
  }

  console.log(`Şifre migration tamamlandı. ${migrated}/${rows.length} kullanıcı hash'lendi (kalanlar zaten bcrypt idi).`);
  await pool.end();
};

run().catch((err) => {
  console.error('Şifre migration hatası:', err);
  process.exit(1);
});
