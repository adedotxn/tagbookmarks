// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connect from "../../../db/connect";
import Collection from "../../../db/schema";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    console.log("Connecting to DB");
    await connect();
    console.log("Connected to DB");

    const data = await Collection.find({ tweetId: `${id}` }).sort({ time: -1 });

    res.json(data);

    res.status(200);
  } catch (error) {
    res.json(error);
  }
}
