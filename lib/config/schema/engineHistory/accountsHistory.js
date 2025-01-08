import mongoose from 'mongoose';

// this scheme is not complete
const AccountsHistory = new mongoose.Schema(
  {
    account: { type: String },
    symbol: { type: String },
    operation: { type: String },
    timestamp: { type: Number },
  },
  { timestamps: false },
);

export default AccountsHistory;
