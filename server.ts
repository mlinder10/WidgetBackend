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
    const { id, current } = req.body;
    const ticker = await TickerValues.findOne({ accountId: id });
    const now = new Date();

    if (ticker !== null) {
      if (!isWithinOneMonth(ticker.day.date)) {
        await TickerValues.deleteOne({ accountId: id });
        const newTicker = await TickerValues.create({
          accountId: id,
          day: { date: now, value: current },
          week: { date: now, value: current },
          month: { date: now, value: current },
        });
        return res.status(201).json({ ticker: newTicker });
      } else if (!isWithinOneWeek(ticker.day.date)) {
        await TickerValues.deleteOne({ accountId: id });
        const newTicker = await TickerValues.create({
          accountId: id,
          day: { date: now, value: current },
          week: { date: now, value: current },
          month: { date: now, value: ticker.month.value },
        });
        return res.status(201).json({ ticker: newTicker });
      } else if (!isWithinOneDay(ticker.day.date)) {
        await TickerValues.deleteOne({ accountId: id });
        const newTicker = await TickerValues.create({
          accountId: id,
          day: { date: now, value: current },
          week: { date: now, value: ticker.week.value },
          month: { date: now, value: ticker.month.value },
        });
        return res.status(201).json({ ticker: newTicker });
      } else {
        return res.status(200).json({ ticker });
      }
    }

    const newTicker = await TickerValues.create({
      accountId: id,
      day: { date: now, value: current },
      week: { date: now, value: current },
      month: { date: now, value: current },
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
