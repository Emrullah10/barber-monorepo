export const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const optionalEnv = (name, fallback) => process.env[name] || fallback;
