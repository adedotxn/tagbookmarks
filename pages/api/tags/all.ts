// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connect from "../../../db/connect";
import Collection from "../../../db/schema";
import logger from "../../../utils/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    logger.info("Connecting to DB");
    await connect();
    logger.info("Connected to DB");

    const data = await Collection.find().sort({ time: -1 });

    res.json(data);

    res.status(200);
  } catch (error) {
    res.json(error);
  }
}
