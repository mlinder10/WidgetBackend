import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import TickerValues from "./models/TickerValues";
import {
  checkApiKey,
  isWithinOneDay,
  isWithinOneMonth,
  isWithinOneWeek,
} from "./helpers";
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
    const { id, sum, min, max, count, average, median } = req.body;
    const ticker = await TickerValues.findOne({ accountId: id });
    const now = new Date();

    if (ticker !== null) {
      if (!isWithinOneMonth(ticker.day.date)) {
        await TickerValues.deleteOne({ accountId: id });
        const newTicker = await TickerValues.create({
          accountId: id,
          day: { date: now, sum, min, max, count, average, median },
          week: { date: now, sum, min, max, count, average, median },
          month: { date: now, sum, min, max, count, average, median },
        });
        return res.status(201).json({ ticker: newTicker });
      } else if (!isWithinOneWeek(ticker.day.date)) {
        await TickerValues.deleteOne({ accountId: id });
        const newTicker = await TickerValues.create({
          accountId: id,
          day: { date: now, sum, min, max, count, average, median },
          week: { date: now, sum, min, max, count, average, median },
          month: {
            date: now,
            sum: ticker.month.sum,
            min: ticker.month.min,
            max: ticker.month.max,
            count: ticker.month.count,
            average: ticker.month.average,
            median: ticker.month.median,
          },
        });
        return res.status(201).json({ ticker: newTicker });
      } else if (!isWithinOneDay(ticker.day.date)) {
        await TickerValues.deleteOne({ accountId: id });
        const newTicker = await TickerValues.create({
          accountId: id,
          day: { date: now, sum, min, max, count, average, median },
          week: {
            date: now,
            sum: ticker.week.sum,
            min: ticker.week.min,
            max: ticker.week.max,
            count: ticker.week.count,
            average: ticker.week.average,
            median: ticker.week.median,
          },
          month: {
            date: now,
            sum: ticker.month.sum,
            min: ticker.month.min,
            max: ticker.month.max,
            count: ticker.month.count,
            average: ticker.month.average,
            median: ticker.month.median,
          },
        });
        return res.status(201).json({ ticker: newTicker });
      } else {
        return res.status(200).json({ ticker });
      }
    }

    const newTicker = await TickerValues.create({
      accountId: id,
      day: { date: now, sum, min, max, count, average, median },
      week: { date: now, sum, min, max, count, average, median },
      month: { date: now, sum, min, max, count, average, median },
    });
    return res.status(201).json({ ticker: newTicker });
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
