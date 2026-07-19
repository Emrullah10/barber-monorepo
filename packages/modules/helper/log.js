const levels = { info: '🟢', warn: '🟠', error: '🔴', debug: '🔵' };

export const log = (scope, level, message, ...rest) => {
  const icon = levels[level] || levels.info;
  const line = `[${scope} ${icon}] ${message}`;
  if (level === 'error') console.error(line, ...rest);
  else if (level === 'warn') console.warn(line, ...rest);
  else console.log(line, ...rest);
};
