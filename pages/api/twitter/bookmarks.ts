// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TwitterApiAutoTokenRefresher } from "@twitter-api-v2/plugin-token-refresher";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { TweetV2, TwitterApi } from "twitter-api-v2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const session = await getSession({ req });
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const credentials = {
    clientId: "<oauth2 client ID>",
    clientSecret: "<oauth2 client secret>",
  };
  // Obtained first through OAuth2 auth flow
  const tokenStore = { accessToken: "", refreshToken: "" };

  const autoRefresherPlugin = new TwitterApiAutoTokenRefresher({
    refreshToken: tokenStore.refreshToken,
    refreshCredentials: credentials,
    onTokenUpdate(token) {
      tokenStore.accessToken = token.accessToken;
      tokenStore.refreshToken = token.refreshToken!;
      // store in DB/Redis/...
    },
    onTokenRefreshError(error) {
      console.error("Refresh error", error);
    },
  });

  const ACCESS_TOKEN: string =
    token?.accessToken !== undefined ? token.accessToken : "";

  if (ACCESS_TOKEN !== undefined || "") {
    const twitterClient = new TwitterApi(tokenStore.accessToken, {
      plugins: [autoRefresherPlugin],
    });
    console.log("access token", typeof tokenStore.accessToken);
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

      return res.json({
        data: returnResponse,
        token: bookmarks.meta,
      });
    } catch (error) {
      return res
        .status(error.code)
        .json({ status: error, message: "Error in getting bookmarks" });
    }
  } else {
    return res.status(400).json({ status: "Access Token not found" });
  }
}
