import mongoose from "mongoose";

const TickerValuesSchema = new mongoose.Schema({
  workspace_id: Number,
  values: [
    {
      date: Date,
      boards: [
        {
          id: String,
          workspace_id: Number,
          items: [
            {
              id: String,
              group: {
                id: String,
              },
              column_values: [{
                type: String,
                text: String,
                id: String,
              }],
            },
          ],
        },
      ],
    },
  ],
});

export default mongoose.models.TickerValue ||
  mongoose.model("TickerValue", TickerValuesSchema);
