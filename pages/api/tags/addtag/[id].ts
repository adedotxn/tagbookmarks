// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connect from "../../../../db/connect";
import Collection from "../../../../db/models/collection";
import User from "../../../../db/models/user";
import { CollectionInterface } from "../../../../utils/collection.interface";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    /**
     * Add tags to specific tweetId
     */
    await connect();
    console.log("tags/add");

    const { userID, tag } = req.body;
    // const { id }: { id: string } = req.query;
    const tweetID = req.query.id as string;

    const findUser = await User.find({ userId: `${userID}` });
    if (findUser.length === 0) {
      return res.status(404).send({ found: findUser });
    }

    // Assuming I'd want to create a new tag if the tag does not already exist but i won't because the user will only be picking tags from their created tags
    // for (let i = 0; i < findUser.userTags.length; i++) {
    //   if (!findUser.userTags.includes(tag[i])) {
    //     findUser.userTags = [].concat(...[...findUser.userTags, tag[i]]);
    //     findUser.save();
    //   }
    // }

    const saveTagged = new Collection<CollectionInterface>({
      userId: userID,
      tweetId: tweetID,
      tags: tag,
    });

    console.log("returned", req.body);
    const saved = await saveTagged.save();

    res.json({
      status: "Success",
      data: findUser,
    });

    res.status(200);
  } catch (error) {
    res.json(error);
  }
}
