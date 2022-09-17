// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connect from "../../../db/connect";
import Collection from "../../../db/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("Connecting to DB");
    await connect();
    console.log("Connected to DB");

    const { tweetId: id, tag } = req.body;

    const saveTagged = new Collection({
      tweetId: id,
      tags: tag,
    });

    console.log("returned", req.body);
    const saved = await saveTagged.save();

    res.json({
      status: "Success",
      data: saved,
    });

    res.status(200);
  } catch (error) {
    res.json(error);
  }
}
