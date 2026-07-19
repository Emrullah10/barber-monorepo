import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const { boot } = await import('./src/boot.js');
const { appConfig } = await import('./src/configs/app-config.js');
const { datasourceConfig } = await import('./src/configs/datasource-config.js');

const { app } = boot({ appConfig, datasourceConfig });

app.listen(appConfig.port, () => {
  console.log(`[BACKEND] Sunucu port ${appConfig.port} üzerinde çalışıyor.`);
});
