// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connect from "../../../db/connect";
import User from "../../../db/models/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  /**
   * Getting user and their tags, to display as tags they can choose from
   */
  try {
    const { id } = req.query; //twitterID used as userID in create user
    await connect();
    console.log(".user/[id]");

    const data = await User.find({ userId: `${id}` });

    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(404)
      .json({ error: error, message: "Error getting tags. Check ID" });
  }
}
