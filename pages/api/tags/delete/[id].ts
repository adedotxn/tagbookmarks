// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connect from "../../../../db/connect";
import Collection from "../../../../db/models/collection";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  /**
   * Delete tags from specific tweets
   */
  try {
    console.log("Connecting to DB");
    await connect();
    console.log("Connected to DB");

    const { tag, id: dataId } = req.body;
    const { id } = req.query;

    const data = await Collection.findById(id);

    if (data.tags.includes(tag)) {
      data.tags.splice(data.tags.indexOf(tag), 1);
      data.save();

      res.status(200).json({ status: "Removed", data: data });
    } else {
      res
        .status(200)
        .json({ status: `Tweet does not conatin tag : ${tag}`, data: data });
    }
  } catch (error) {
    res.json(error);
  }
}
