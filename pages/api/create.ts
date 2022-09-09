// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connect from "../../lib/db/connect/connectdb";
import User from "../../lib/db/models/schema";
import { UserInterface } from "../../utils/interface";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("Connecting to mongoDB");
    await connect();
    console.log("Connected to mongoDB");

    const createUser = new User<UserInterface>({
      username: req.body.username,
      bio: req.body.bio,
      socials: req.body.socials,
    });

    const saved = await createUser.save();

    res.json({
      status: "Success",
      data: saved,
    });

    res.status(200);
  } catch (error) {
    res.json(error);
  }
}
