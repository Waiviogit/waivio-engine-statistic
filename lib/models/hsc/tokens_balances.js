function TokensBalancesModel(db) {
  const tokensBalancesModel = db.models.tokens_balances;

  const aggregate = async (pipeline) => {
    try {
      const result = await tokensBalancesModel.aggregate(pipeline);
      return { result };
    } catch (error) {
      return { error };
    }
  };

  return {
    aggregate,
  };
}

export default TokensBalancesModel;
