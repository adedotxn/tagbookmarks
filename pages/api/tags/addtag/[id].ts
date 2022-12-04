// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connect from "../../../../db/connect";
import Collection from "../../../../db/models/collection";
import DBUser from "../../../../db/models/user";
import { CollectionInterface } from "../../../../utils/interface/collection.interface";
import { UserInterface } from "../../../../utils/interface/user.interface";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    /**
     * Add tags to specific tweetId
     * Checks if tags are part of the tags already created by the user, if they are not, add to them
     * Agin check if there's already a collection by the user with the tweetID
     * If there is not, create the collection with the tweetId and add it's tags to it
     * If there is already a collection by the user with that tweetId, simply update the tags
     *
     */
    await connect();
    console.log("tags/add");

    const tweetId: string = req.body.tweetId;
    const tag = req.body.tags;

    const tweepId = req.query.id as string;
    // const {id : tweepId} = req.query

    const userExists: UserInterface[] = await DBUser.find({ tweepId });
    if (userExists.length === 0) {
      return res
        .status(404)
        .send({ found: userExists, message: "Create at least one tag first" });
    }

    if (userExists[0].userTags !== undefined) {
      const temp: string[] = [].concat(...[...userExists[0].userTags, tag]);
      const tagUpdates = [...new Set(temp)];
      await DBUser.updateOne(
        { tweepId },
        {
          userTags: tagUpdates,
        }
      );
    }

    const collectionExists = await Collection.find({
      tweepId,
      tweetId,
    });

    if (collectionExists.length === 0) {
      console.log("nu collection", collectionExists);
      const saveTag = new Collection<CollectionInterface>({
        tweepId,
        tweetId: tweetId,
        tags: tag,
      });

      const saved = await saveTag.save();

      return res.status(200).json({
        status: "Success created collection and added tags",
        data: saved,
      });
    } else {
      const temp = [].concat(...[...collectionExists[0].tags, tag]);
      const update = [...new Set(temp)];
      const updatedTags = await Collection.updateOne(
        { tweetId },
        {
          tags: update,
        }
      );

      return res.status(200).json({
        status: "Successfuly Updated Tags",
        data: updatedTags,
      });
    }
  } catch (error) {
    return res
      .status(404)
      .json({ error, message: "Error updating, check tag format" });
  }
}
