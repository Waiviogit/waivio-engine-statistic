import fp from 'fastify-plugin';
import dayjs from 'dayjs';

async function engineStatisticService(fastify, options, next) {
  const { dbModels } = fastify;

  const getActiveUsers = async () => {
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

    return result?.[0]?.count || 0;
  };

  const getUsersOwnWAIV = async () => {
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

    return result?.[0]?.count || 0;
  };

  fastify.decorate('engineStatisticService', {
    getActiveUsers,
    getUsersOwnWAIV,
  });

  next();
}

export default fp(engineStatisticService);
