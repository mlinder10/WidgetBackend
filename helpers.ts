import { Request, Response, NextFunction } from "express";

export function isWithinOneDay(date: Date): boolean {
  const now = new Date()
  const timeDifference = now.getTime() - date.getTime()
  const twentyFourHoursInMilliseconds = 7 * 24 * 60 * 60 * 1000;
  return timeDifference <= twentyFourHoursInMilliseconds;
}

export function isWithinOneMonth(date: Date): boolean {
  const now = new Date()
  const timeDifference = now.getTime() - date.getTime()
  const twentyFourHoursInMilliseconds = 31 * 24 * 60 * 60 * 1000;
  return timeDifference <= twentyFourHoursInMilliseconds;
}

export function checkApiKey(req: Request, res: Response, next: NextFunction) {
  if (!(req.headers.authorization === process.env.API_KEY))
    return res.status(401).json({ message: "Invalid Credentials" });
  next();
}
