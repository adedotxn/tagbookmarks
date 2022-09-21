// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { TweetV2, TwitterApi } from "twitter-api-v2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { bookmarks: number } = req.query;
  let maxResults: number = +number!;

  // console.log("number: ", number);
  // console.log("typeof number: ", typeof number);

  // console.log("\nmax: ", maxResults);
  // console.log("typeof max: ", typeof maxResults);

  // console.log("\nquery", req.query);
  // res.json(maxResults);

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const ACCESS_TOKEN: string =
    token?.twitter.accessToken !== undefined ? token.twitter.accessToken : "";

  if (ACCESS_TOKEN !== undefined || "") {
    console.log("\n\taccess token type", ACCESS_TOKEN);
    const twitterClient = new TwitterApi(ACCESS_TOKEN);
    console.log("access token type @dynamo", typeof ACCESS_TOKEN);
    console.log("using: ", maxResults);
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

      // console.log("response", returnResponse);
      return res.json({
        data: returnResponse,
        count: bookmarks.meta.result_count,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ status: error, message: "Error in getting bookmarks" });
    }
  } else {
    return res.status(400).json({ status: "Access Token not found" });
  }
}
