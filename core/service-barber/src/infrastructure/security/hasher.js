import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hasher = {
  hash: (plain) => bcrypt.hash(plain, SALT_ROUNDS),
  compare: (plain, hash) => bcrypt.compare(plain, hash),
};
