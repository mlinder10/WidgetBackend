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

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(express.json());
app.use(checkApiKey);

app.get("/", async (req, res) => {
  try {
    const { id, sum, min, max, count, average, median } = req.body;
    const ticker = await TickerValues.findOne({ accountId: id });
    const now = new Date();

    if (ticker === null) {
      const newTicker = await TickerValues.create({
        accountId: id,
        values: [{ sum, min, max, median, count, average, date: now }],
      });
      return res.status(201).json({ ticker: newTicker });
    }

    while (!isWithinOneMonth(ticker.values[0].date)) {
      ticker.values.shift();
    }

    if (
      ticker.values.length === 0 ||
      !isWithinOneDay(ticker.values[ticker.values.length - 1].date)
    ) {
      ticker.values.push({ sum, min, max, median, count, average, date: now });
    }

    await TickerValues.findByIdAndUpdate(ticker._id, { values: ticker.values });
    return res.status(202).json({ ticker });
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
