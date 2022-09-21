// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connect from "../../../../db/connect";
import Collection from "../../../../db/models/collection";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("Connecting to DB");
    await connect();
    console.log("Connected to DB");

    const { newTag } = req.body;
    const { id } = req.query;

    const data = await Collection.findById(id);

    data.tags = [...data.tags, newTag];
    data.save();

    res.json({
      status: "Tag added",
      data: data,
    });

    res.status(200);
  } catch (error) {
    res.json(error);
  }
}
