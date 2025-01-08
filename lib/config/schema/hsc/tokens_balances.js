import mongoose from 'mongoose';

// this scheme is not complete
const TokensBalances = new mongoose.Schema(
  {
    account: { type: String },
    symbol: { type: String },
    balance: { type: String },
    stake: { type: String },
  },
  { timestamps: false },
);

export default TokensBalances;
