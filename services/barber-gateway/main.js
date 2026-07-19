import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const { boot } = await import('./src/boot.js');
const { gatewayConfig } = await import('./src/configs/gateway-config.js');

const { app } = boot({ gatewayConfig });

app.listen(gatewayConfig.port, () => {
  console.log(`🏰 Gateway Sunucusu Başarıyla Çalışıyor. Dış Kapı Numarası: ${gatewayConfig.port}`);
});
