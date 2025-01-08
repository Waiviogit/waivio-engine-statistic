function AccountsHistoryModel(db) {
  const tokensBalancesModel = db.models.accountsHistory;

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

export default AccountsHistoryModel;
