import dotenv from 'dotenv';

dotenv.config();

const { boot } = await import('./src/boot.js');
const { appConfig } = await import('./src/configs/app-config.js');
const { datasourceConfig } = await import('./src/configs/datasource-config.js');

const { app } = boot({ appConfig, datasourceConfig });

app.listen(appConfig.port, () => {
  console.log(`[BACKEND] Sunucu port ${appConfig.port} üzerinde çalışıyor.`);
});
