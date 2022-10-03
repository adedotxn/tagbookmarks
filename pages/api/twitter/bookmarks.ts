// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { TweetV2, TwitterApi } from "twitter-api-v2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const session = await getSession({ req });
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const ACCESS_TOKEN: string =
    token?.accessToken !== undefined ? token.accessToken : "";

  if (ACCESS_TOKEN !== undefined || "") {
    const twitterClient = new TwitterApi(ACCESS_TOKEN);
    console.log("access token type", typeof ACCESS_TOKEN);
    const readOnlyClient = twitterClient.readOnly;

    let nextToken;
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
        max_results: 10,
      });

      let meta = bookmarks.meta;
      console.log("meta", bookmarks.meta);

      let allBookmarks: TweetV2[] = [];

      for await (const bookmark of bookmarks) {
        allBookmarks = [...allBookmarks, bookmark];
      }
      console.log("loop? : done");

      let tweeps: any[] = [];

      console.log("map1?");
      allBookmarks.map((tweet) => {
        if (tweet !== undefined) {
          tweeps = [...tweeps, tweet?.author_id];
        }
      });
      console.log("map1? : done");

      const users = await readOnlyClient.v2.users(tweeps);

      console.log("map2?");
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
      console.log("map2? : done");

      console.log("response", returnResponse);
      return res.json({
        data: returnResponse,
        token: bookmarks.meta,
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
