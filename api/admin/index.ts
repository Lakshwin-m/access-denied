import { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  res.status(200).json({ message: "Admin API" });
}
