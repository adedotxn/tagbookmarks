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
    await connect();
    console.log("Connected to DB");

    const { tag, tweetId } = req.body;
    const { id: tweepId } = req.query;

    const collection = await Collection.find({
      tweepId,
      tweetId,
    });

    if (collection.length !== 0) {
      console.log("Found", collection);
      if (collection[0].tags.includes(tag)) {
        collection[0].tags.splice(collection[0].tags.indexOf(tag), 1);
        collection[0].save();

        return res
          .status(200)
          .json({ status: "Removed", collection: collection });
      } else {
        return res.status(200).json({
          status: `Tweet does not conatin tag : ${tag}`,
          collection: collection,
        });
      }
    } else {
      return res.status(404).json({
        message: `No tagged tweet '${tweetId}' for user '${tweepId}' found`,
      });
    }
  } catch (error) {
    res.json(error);
  }
}
