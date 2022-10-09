// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { TweetV2, TwitterApi } from "twitter-api-v2";
import connect from "../../../db/connect";
import DBUser from "../../../db/models/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const slug = req.query.slug as string[];
  const tweepId = slug[0];
  const number = slug[1];
  let maxResults: number = +number!;

  await connect();
  const userExists = await DBUser.find({ tweepId });
  if (!userExists || userExists.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }
  const ACCESS_TOKEN = userExists[0].accessToken;

  if (ACCESS_TOKEN !== undefined || "") {
    console.log("starting...");
    const twitterClient = new TwitterApi(ACCESS_TOKEN);
    console.log("\t{ access token", ACCESS_TOKEN);

    const readOnlyClient = twitterClient.readOnly;

    try {
      const bookmarks = await readOnlyClient.v2.bookmarks({
        expansions: ["referenced_tweets.id"],
        "media.fields": ["duration_ms", "url"],
        "tweet.fields": [
          "created_at",
          "attachments",
          "in_reply_to_user_id",
          "author_id",
        ],
        max_results: maxResults,
      });

      let allBookmarks: TweetV2[] = [];

      for await (const bookmark of bookmarks) {
        allBookmarks = [...allBookmarks, bookmark];
      }
      // console.log("loop? : done");

      let tweeps: any[] = [];

      allBookmarks.map((tweet) => {
        if (tweet !== undefined) {
          tweeps = [...tweeps, tweet?.author_id];
        }
      });

      const users = await readOnlyClient.v2.users(tweeps);

      const returnResponse = allBookmarks.map((tweet, idx) => {
        return {
          name: users.data[idx].name,
          username: users.data[idx].username,
          protected: users.data[idx].protected,
          text: tweet.text,
          id: tweet.id,
          created_at: tweet.created_at,
          attachments: tweet.attachments,
        };
      });

      console.log("nextToken:", { nextToken: bookmarks.meta.next_token });
      return res.json({
        data: returnResponse,
        count: bookmarks.meta.result_count,
        nextToken: bookmarks.meta.next_token,
      });
    } catch (error) {
      console.log("issue", { error });
      return res
        .status(error.code)
        .json({ status: error, message: "Error in getting bookmarks" });
    }
  } else {
    return res.status(400).json({ status: "Access Token not found" });
  }
}
