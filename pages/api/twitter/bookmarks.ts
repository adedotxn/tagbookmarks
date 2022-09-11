// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { TweetV2, TwitterApi } from "twitter-api-v2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const ACCESS_TOKEN: string =
    token?.twitter.accessToken !== undefined ? token.twitter.accessToken : "";

  if (ACCESS_TOKEN !== undefined || "") {
    const twitterClient = new TwitterApi(ACCESS_TOKEN);
    console.log("access token type", typeof ACCESS_TOKEN);
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
      });

      let allBookmarks: TweetV2[] = [];
      for await (const bookmark of bookmarks) {
        // console.log("all bookmarksss", bookmark);
        allBookmarks = [...allBookmarks, bookmark];
      }
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

      return res.json(returnResponse);
    } catch (error) {
      return res.status(400).json({ status: error });
    }
  }
}
