// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connect from "../../../../db/connect";
import Collection from "../../../../db/models/collection";
import { CollectionInterface } from "../../../../utils/collection.interface";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  /**
   * Returns the tags for a specific tweet
   */
  try {
    const ids = req.query.ids as string[];
    const tweepId = ids[0];
    const tweetId = ids[1];

    await connect();
    console.log(`/tags/${tweepId}`);

    const data: CollectionInterface[] = await Collection.find({
      tweepId,
      tweetId,
    }).sort({
      time: -1,
    });

    const tagsArray: string[] = [];
    data.map((e) => {
      e.tags.map((tags: string) => {
        tagsArray.push(tags);
      });
    });

    return res.status(200).json({ tags: tagsArray });
  } catch (error) {
    return res.status(404).json(error);
  }
}
