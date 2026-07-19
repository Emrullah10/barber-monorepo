import request from 'supertest';
import { buildTestApp } from '../../../config/test-server.js';
import { makeFakeQuery } from '../../../config/db-client.js';

describe('GET /health', () => {
  const fakePool = { query: makeFakeQuery([]) };
  const { app, gatewaySecret } = buildTestApp({ pool: fakePool });

  it('rejects requests without the gateway secret', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(403);
  });

  it('responds 200 when the gateway secret header is present', async () => {
    const res = await request(app).get('/health').set('x-gateway-secret', gatewaySecret);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/up and running/i);
  });

  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/no-such-route').set('x-gateway-secret', gatewaySecret);
    expect(res.status).toBe(404);
  });
});
