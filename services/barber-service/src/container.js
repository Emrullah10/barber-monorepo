import jwt from 'jsonwebtoken';
import { makePool, makeQuery } from '@barber/core-service-barber/src/infrastructure/persistence/persistence-utils.js';
import { hasher } from '@barber/core-service-barber/src/infrastructure/security/hasher.js';
import { makeUsersRepository } from '@barber/core-service-barber/src/infrastructure/persistence/repositories/users.repository.js';
import { makeServicesRepository } from '@barber/core-service-barber/src/infrastructure/persistence/repositories/services.repository.js';
import { makeAppointmentsRepository } from '@barber/core-service-barber/src/infrastructure/persistence/repositories/appointments.repository.js';
import { makeBarberAvailabilityRepository } from '@barber/core-service-barber/src/infrastructure/persistence/repositories/barber-availability.repository.js';
import { makeTenantsRepository } from '@barber/core-service-barber/src/infrastructure/persistence/repositories/tenants.repository.js';
import { makeTenantMembershipRepository } from '@barber/core-service-barber/src/infrastructure/persistence/repositories/tenant-membership.repository.js';

import {
  makeListAllUsers, makeRegisterUser, makeListBarbers,
  makeGetBarberById, makeUpdateProfile, makeChangeUserType,
} from '@barber/core-service-barber/src/application/use-cases/users/users.use-case.js';
import { makeLogin, makeRegister } from '@barber/core-service-barber/src/application/use-cases/auth/auth.use-case.js';
import {
  makeListAllServices, makeCreateService, makeUpdateService, makeDeleteService,
} from '@barber/core-service-barber/src/application/use-cases/services/services.use-case.js';
import {
  makeCreateAppointment, makeListMyAppointments, makeListBarberAppointments,
  makeListAllAppointments, makeChangeAppointmentStatus,
} from '@barber/core-service-barber/src/application/use-cases/appointments/appointments.use-case.js';
import {
  makeGetMyAvailability, makeUpdateAvailability,
} from '@barber/core-service-barber/src/application/use-cases/availability/barber-availability.use-case.js';
import {
  makeGetRevenueSummary, makeGetPopularServices, makeGetAppointmentStats,
  makeGetCustomerAnalysis, makeGetMonthlyTrend,
} from '@barber/core-service-barber/src/application/use-cases/reports/reports.use-case.js';
import {
  makeListTenants, makeGetTenantBySlug, makeGetTenantById, makeCreateTenant,
  makeUpdateTenant, makeGetTenantBarbers, makeAddBarber, makeRemoveBarber, makeOnboardShop,
} from '@barber/core-service-barber/src/application/use-cases/tenants/tenants.use-case.js';

import { makeUsersController } from './interfaces/controllers/users.controller.js';
import { makeAuthController } from './interfaces/controllers/auth.controller.js';
import { makeServicesController } from './interfaces/controllers/services.controller.js';
import { makeAppointmentsController } from './interfaces/controllers/appointments.controller.js';
import { makeBarberAvailabilityController } from './interfaces/controllers/barber-availability.controller.js';
import { makeReportsController } from './interfaces/controllers/reports.controller.js';
import { makeTenantsController } from './interfaces/controllers/tenants.controller.js';

export const buildContainer = ({ appConfig, datasourceConfig, pool: injectedPool } = {}) => {
  const pool = injectedPool || makePool(datasourceConfig);
  const query = makeQuery(pool);

  const usersRepository = makeUsersRepository({ query });
  const servicesRepository = makeServicesRepository({ query });
  const appointmentsRepository = makeAppointmentsRepository({ query });
  const barberAvailabilityRepository = makeBarberAvailabilityRepository({ query });
  const tenantsRepository = makeTenantsRepository({ query });
  const tenantMembershipRepository = makeTenantMembershipRepository({ query });

  const usersController = makeUsersController({
    useCases: {
      listAllUsers: makeListAllUsers({ usersRepository }),
      registerUser: makeRegisterUser({ usersRepository, hasher }),
      listBarbers: makeListBarbers({ usersRepository }),
      getBarberById: makeGetBarberById({ usersRepository }),
      updateProfile: makeUpdateProfile({ usersRepository }),
      changeUserType: makeChangeUserType({ usersRepository }),
    },
  });

  const authController = makeAuthController({
    useCases: {
      login: makeLogin({ usersRepository, tenantMembershipRepository, hasher, jwt, jwtSecret: appConfig.jwtSecret }),
      register: makeRegister({ usersRepository, hasher, jwt, jwtSecret: appConfig.jwtSecret }),
    },
  });

  const servicesController = makeServicesController({
    useCases: {
      listAllServices: makeListAllServices({ servicesRepository }),
      createService: makeCreateService({ servicesRepository }),
      updateService: makeUpdateService({ servicesRepository }),
      deleteService: makeDeleteService({ servicesRepository }),
    },
  });

  const appointmentsController = makeAppointmentsController({
    useCases: {
      createAppointment: makeCreateAppointment({ appointmentsRepository }),
      listMyAppointments: makeListMyAppointments({ appointmentsRepository }),
      listBarberAppointments: makeListBarberAppointments({ appointmentsRepository }),
      listAllAppointments: makeListAllAppointments({ appointmentsRepository }),
      changeAppointmentStatus: makeChangeAppointmentStatus({ appointmentsRepository }),
    },
  });

  const availabilityController = makeBarberAvailabilityController({
    useCases: {
      getMyAvailability: makeGetMyAvailability({ barberAvailabilityRepository }),
      updateAvailability: makeUpdateAvailability({ barberAvailabilityRepository }),
    },
  });

  const reportsController = makeReportsController({
    useCases: {
      getRevenueSummary: makeGetRevenueSummary({ query }),
      getPopularServices: makeGetPopularServices({ query }),
      getAppointmentStats: makeGetAppointmentStats({ query }),
      getCustomerAnalysis: makeGetCustomerAnalysis({ query }),
      getMonthlyTrend: makeGetMonthlyTrend({ query }),
    },
  });

  const tenantsController = makeTenantsController({
    useCases: {
      listTenants: makeListTenants({ tenantsRepository }),
      getTenantBySlug: makeGetTenantBySlug({ tenantsRepository }),
      getTenantById: makeGetTenantById({ tenantsRepository }),
      createTenant: makeCreateTenant({ tenantsRepository }),
      updateTenant: makeUpdateTenant({ tenantsRepository }),
      getTenantBarbers: makeGetTenantBarbers({ tenantsRepository }),
      addBarber: makeAddBarber({ tenantsRepository }),
      removeBarber: makeRemoveBarber({ tenantsRepository }),
      onboardShop: makeOnboardShop({ tenantsRepository, usersRepository }),
    },
  });

  return {
    pool,
    controllers: {
      usersController,
      authController,
      servicesController,
      appointmentsController,
      availabilityController,
      reportsController,
      tenantsController,
    },
  };
};
