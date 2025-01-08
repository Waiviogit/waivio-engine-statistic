import fp from 'fastify-plugin';
import { LRUCache } from 'lru-cache';
import dayjs from 'dayjs';

const options = {
  max: 500,
  ttl: 1000 * 60 * 60 * 24,
  allowStale: false,
};

const cache = new LRUCache(options);

const ACTIVE_USERS = 'ACTIVE_USERS';
const WAIV_OWNERS = 'WAIV_OWNERS';

async function engineStatisticService(fastify, options, next) {
  const { dbModels } = fastify;

  const getActiveUsers = async () => {
    const cachedValue = cache.get(ACTIVE_USERS);
    if (cachedValue) return cachedValue;

    const monthAgo = dayjs().subtract(30, 'd').unix();
    const { result } = await dbModels.accountsHistoryModel.aggregate([
      {
        $match: {
          symbol: 'WAIV', timestamp: { $gte: monthAgo },
        },

      },
      {
        $group: {
          _id: '$account',
        },
      },
      {
        $count: 'count',
      },
    ]);
    const response = result?.[0]?.count || 0;
    cache.set(ACTIVE_USERS, response);
    return response;
  };

  const getUsersOwnWAIV = async () => {
    const cachedValue = cache.get(WAIV_OWNERS);
    if (cachedValue) return cachedValue;

    const { result } = await dbModels.tokensBalancesModel.aggregate([
      {
        $match: {
          symbol: 'WAIV',
          $or: [{ balance: { $ne: '0' } }, { stake: { $ne: '0' } }],
        },
      },
      {
        $count: 'count',
      },
    ]);

    const response = result?.[0]?.count || 0;
    cache.set(WAIV_OWNERS, response);
    return response;
  };

  fastify.decorate('engineStatisticService', {
    getActiveUsers,
    getUsersOwnWAIV,
  });

  next();
}

export default fp(engineStatisticService);
