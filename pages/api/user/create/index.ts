// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connect from "../../../../db/connect";
import User from "../../../../db/models/user";
import { UserInterface } from "../../../../utils/user.interface";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  /**
   * add userId to database to be able to match operations to it
   * this is invoked on the "Create Tag button" only when tags is empty
   * If user does not exist, create user and add their tags
   * If user already exists, just update their tags with the new ones
   */
  const { tweepId, userTags } = req.body;
  try {
    await connect();
    console.log("/create/index");

    console.log({ user: tweepId, userTags });

    const userExists = await User.find({ tweepId });

    if (userExists.length >= 1) {
      const temp = [].concat(...[...userExists[0].userTags, userTags]);
      const update = [...new Set(temp)]; //remove duplicates
      await User.updateOne(
        { tweepId },
        {
          userTags: update,
        }
      );

      return res.status(200).json({
        status: "Success",
        message: "Tag created added to User's collection",
      });
    }

    const saveUser = new User<UserInterface>({
      tweepId,
      userTags,
    });

    const saved = await saveUser.save();

    return res.status(200).json({
      status: "Success",
      data: saved,
      message: "User created successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(403)
        .json({ status: error, message: "User already exists" });
    } else {
      return res
        .status(404)
        .json({ message: "Unexpected error", tweepId, userTags });
    }
  }
}
