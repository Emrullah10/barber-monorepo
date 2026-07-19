export const queryKeys = {
  appointments: {
    my: ['appointments', 'my'],
  },
  barbers: {
    all: ['barbers', 'all'],
  },
  services: {
    list: (tenantId = null) => ['services', 'list', tenantId],
  },
  shops: {
    all: ['shops', 'all'],
    detail: (slug) => ['shops', 'detail', slug],
  },
};
