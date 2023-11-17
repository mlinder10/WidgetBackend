import mongoose from "mongoose";

const TickerValuesSchema = new mongoose.Schema({
  workspace_id: Number,
  values: [
    {
      date: Date,
      boards: [
        {
          id: String,
          items: [
            {
              groupId: String,
              columnId: String,
              id: String,
              value: String
            }
          ]
        },
      ],
    },
  ],
});

export default mongoose.models.TickerValue ||
  mongoose.model("TickerValue", TickerValuesSchema);
