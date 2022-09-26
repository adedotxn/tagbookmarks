// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connect from "../../../db/connect";
import Collection from "../../../db/models/collection";
import logger from "../../../utils/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connect();
    logger.info("/tags/all");

    const data = await Collection.find().sort({ time: -1 });

    return res.status(200).json(data);
  } catch (error) {
    return res.json(error);
  }
}
