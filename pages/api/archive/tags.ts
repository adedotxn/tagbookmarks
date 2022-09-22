// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connect from "../../../db/connect";
import User from "../../../db/models/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  /**
   * Invoked when saved tags of user is > 0
   * Create/Add new tags tags with respect to current user
   */
  try {
    await connect();
    console.log("/create/tags");

    const { id: _id, tag } = req.body; //_id given by mongoDB
    const data = await User.findById(_id);

    //spread tags into userTags, creates a 2D array, flatten the array with [].concar(...arr)
    data.userTags = [].concat(...[...data.userTags, tag]);
    data.save();

    return res.status(200).json(data);
  } catch (error) {
    if (error.name === "CastError") {
      res
        .status(404)
        .json({ status: "error", message: "User with this id does not exist" });
    }
  }
}
