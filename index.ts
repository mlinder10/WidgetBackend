import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import TickerValues from "./models/TickerValues";
import { checkApiKey, isWithinOneDay, isWithinOneMonth } from "./helpers";
dotenv.config();

mongoose.connect(process.env.DB_URL || "");
const db = mongoose.connection;
const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(checkApiKey);

app.post("/", async (req, res) => {
  try {
    const { workspace_id, boards } = req.body;
    const now = Date.now();
    return res.status(500).json({ log: boards });
    const ticker = await TickerValues.findOne({ workspace_id });

    // if ticker doesn't exist
    if (ticker === null) {
      const newTicker = await TickerValues.create({
        workspace_id,
        values: [{ date: now, boards }],
      });
      return res.status(201).json({ ticker: newTicker });
    }

    // if ticker is old
    while (!isWithinOneMonth(ticker.values[0].date)) {
      ticker.values.shift();
    }

    // if ticker values havent been added to today
    if (
      ticker.values.length === 0 ||
      !isWithinOneDay(ticker.values[ticker.values.length - 1].date)
    )
      ticker.values.push({ date: now, boards });

    // update and return ticker
    await TickerValues.updateOne({ workspace_id }, { values: ticker.values });
    return res.status(202).json({ ticker: ticker });
  } catch (err: any) {
    console.error(err?.message);
    return res.status(500).json({ message: err?.message });
  }
});

db.once("open", () => {
  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
});

db.on("error", (error) => {
  console.log(error?.message);
});
