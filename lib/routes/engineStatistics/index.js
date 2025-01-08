import fp from 'fastify-plugin';
import schema from './schema.js';

async function botStatisticsRoutes(fastify, opts) {
  const { engineStatisticService } = fastify;

  fastify.route({
    method: 'GET',
    path: '/waiv/active-users',
    handler: activeUsers,
    schema: schema.addVisit,
  });

  async function activeUsers(req, reply) {
    const result = await engineStatisticService.getActiveUsers();
    return { result };
  }

  fastify.route({
    method: 'GET',
    path: '/waiv/owners',
    handler: usersOwnWAIV,
    schema: schema.addVisit,
  });

  async function usersOwnWAIV(req, reply) {
    const result = await engineStatisticService.getUsersOwnWAIV();
    return { result };
  }
}

export default fp(botStatisticsRoutes);
