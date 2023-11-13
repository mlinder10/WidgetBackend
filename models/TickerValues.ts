import mongoose from "mongoose";

const TickerValuesSchema = new mongoose.Schema({
  accountId: {
    type: Number,
    require: true,
  },
  day: {
    date: {
      type: Date,
      require: true,
    },
    value: {
      type: Number,
      require: true,
    },
  },
  week: {
    date: {
      type: Date,
      require: true,
    },
    value: {
      type: Number,
      require: true,
    },
  },
  month: {
    date: {
      type: Date,
      require: true,
    },
    value: {
      type: Number,
      require: true,
    },
  },
});

export default mongoose.models.TickerValue ||
  mongoose.model("TickerValue", TickerValuesSchema);