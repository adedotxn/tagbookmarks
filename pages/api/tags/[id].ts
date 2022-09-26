// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connect from "../../../db/connect";
import Collection from "../../../db/models/collection";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  /**
   * Returns collection of a user's tagged tweets
   */
  try {
    const { id: tweepId } = req.query;
    await connect();
    console.log(`/tags/${tweepId}`);

    const data = await Collection.find({ tweepId }).sort({
      time: -1,
    });
    console.log("data", data);

    return res.status(200).json(data);
  } catch (error) {
    return res.json(error);
  }
}
