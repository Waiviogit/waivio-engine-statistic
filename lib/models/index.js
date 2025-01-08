import fp from 'fastify-plugin';
import TokensBalancesModel from './hsc/tokens_balances.js';
import AccountsHistoryModel from './engineHistory/accountsHistory.js';

async function fastifyDbModels(fastify, serverOptions, next) {
  const { hscDB, engineHistoryDB } = fastify;

  const tokensBalancesModel = TokensBalancesModel(hscDB);
  const accountsHistoryModel = AccountsHistoryModel(engineHistoryDB);

  fastify.decorate('dbModels', {
    tokensBalancesModel,
    accountsHistoryModel,
  });

  next();
}

export default fp(fastifyDbModels);
