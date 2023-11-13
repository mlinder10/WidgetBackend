import mongoose from "mongoose";

const TickerValuesSchema = new mongoose.Schema({
  accountId: {
    type: Number,
    require: true,
  },
  values: [
    {
      date: {
        type: Date,
        require: true,
      },
      sum: {
        type: Number,
        require: true,
      },
      min: {
        type: Number,
        require: true,
      },
      max: {
        type: Number,
        require: true,
      },
      count: {
        type: Number,
        require: true,
      },
      average: {
        type: Number,
        require: true,
      },
      median: {
        type: Number,
        require: true,
      },
    },
  ],
});

export default mongoose.models.TickerValue ||
  mongoose.model("TickerValue", TickerValuesSchema);
