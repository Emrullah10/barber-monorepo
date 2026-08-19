# barber-monorepo

Barbershop booking platform organised as a monorepo: a core booking service, an API gateway, shared modules and a React web client, backed by versioned SQL schemas and a Jest test suite.

## Architecture

| Path | Responsibility |
|---|---|
| `core/service-barber` | Core booking & business logic (shops, barbers, services, reports) |
| `services` | Gateway and supporting services |
| `packages/modules` | Reusable internal modules |
| `db-schemas` | Numbered SQL schema files |
| `barber-web` | React web client |
| `test` | Jest unit & integration tests |
| `docs` | Architecture notes |

## Tech Stack

Node.js, Express, React, SQL, Jest.

## Getting started

```bash
npm install
npm test
npm start
```
