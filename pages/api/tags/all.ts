// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connect from "../../../db/connect";
import User from "../../../db/models/user";
import { UserInterface } from "../../../utils/user.interface";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connect();
    // logger.info("/tags/all");

    const data: UserInterface[] = await User.find({}).sort({ time: -1 });

    const tags = data.map((e) => {
      return e.userTags;
    });

    return res.status(200).json({ tags });
  } catch (error) {
    return res.json(error);
  }
}
