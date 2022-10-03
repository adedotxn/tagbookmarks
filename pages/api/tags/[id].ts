// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { TweetV2, TwitterApi } from "twitter-api-v2";
import connect from "../../../db/connect";
import Collection from "../../../db/models/collection";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  /**
   * Returns collection of a user's tagged tweets
   */
  try {
    const { id: tweepId } = req.query;
    await connect();
    console.log(`/tags/${tweepId}`);

    const data = await Collection.find({ tweepId }).sort({
      time: -1,
    });

    const tweetIds: string[] = data.map((e) => {
      return e.tweetId;
    });

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const ACCESS_TOKEN: string =
      token?.accessToken !== undefined ? token.accessToken : "";

    if (ACCESS_TOKEN !== undefined || "") {
      console.log("\taccess token type", ACCESS_TOKEN);
      const twitterClient = new TwitterApi(ACCESS_TOKEN);

      const readOnlyClient = twitterClient.readOnly;
      const alltweets = await readOnlyClient.v2.tweets(tweetIds, {
        "tweet.fields": [
          "created_at",
          "attachments",
          "in_reply_to_user_id",
          "author_id",
        ],
      });

      const userids = alltweets.data.map((e: TweetV2) => {
        return e?.author_id!;
      });

      const allUsers =
        userids === undefined
          ? { data: [{ id: "", name: "", username: "" }] }
          : await readOnlyClient.v2.users(userids);

      const returned = alltweets.data.map((tweet, idx) => {
        return {
          id: tweet.id,
          username: allUsers.data[idx].username,
          name: allUsers.data[idx].name,
          text: tweet.text,
          tags: data[idx].tags,
        };
      });

      return res.status(200).json({ data: returned });
    }
  } catch (error) {
    // console.log({ error });
    return res.status(404).json(error);
  }
}
