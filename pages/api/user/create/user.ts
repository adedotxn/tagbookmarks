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
   */
  try {
    await connect();
    console.log("/create/user");

    const { userId } = req.body;

    const saveUser = new User<UserInterface>({
      userId,
    });

    // console.log("returned", req.body);
    const saved = await saveUser.save();

    return res.status(200).json({
      status: "User created successfully",
      data: saved,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(403)
        .json({ status: error, message: "User already exists" });
    }
  }
}
