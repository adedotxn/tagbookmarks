// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TwitterApiAutoTokenRefresher } from "@twitter-api-v2/plugin-token-refresher";
import axios from "axios";
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
  const REFRESH_TOKEN = userExists[0].refreshToken;

  const toCompare = {
    accessToken: ACCESS_TOKEN,
    refreshToken: REFRESH_TOKEN,
  };

  const credentials = {
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!,
  };
  // Obtained first through OAuth2 auth flow
  const tokenStore = {
    accessToken: ACCESS_TOKEN,
    refreshToken: REFRESH_TOKEN,
  };

  const autoRefresherPlugin = new TwitterApiAutoTokenRefresher({
    refreshToken: tokenStore.refreshToken,
    refreshCredentials: credentials,
    onTokenUpdate(token) {
      console.log("Refresh Tokens");
      tokenStore.accessToken = token.accessToken;
      tokenStore.refreshToken = token.refreshToken!;
      // store in DB/Redis/...
    },
    onTokenRefreshError(error) {
      console.error("Refresh error", error);
    },
  });

  if (ACCESS_TOKEN !== undefined || "") {
    console.log("starting tC...");
    // const temp = token?.accessToken!;
    // const twitterClient = new TwitterApi(ACCESS_TOKEN);
    const twitterClient = new TwitterApi(tokenStore.accessToken, {
      plugins: [autoRefresherPlugin],
    });
    // const twitterClient = new TwitterApi({
    //   clientId: process.env.CLIENT_ID!,
    //   clientSecret: process.env.CLIENT_SECRET!,
    // });

    // let refreshToken = REFRESH_TOKEN;
    // const {
    //   client: refreshedClient,
    //   accessToken,
    //   refreshToken: newRefreshToken,
    // } = await twitterClient.refreshOAuth2Token(refreshToken);
    // console.log("\t{ access token", ACCESS_TOKEN);

    const readOnlyClient = twitterClient.readOnly;

    try {
      console.log("Starting bookmark endpoint call...");
      const bookmarks = await twitterClient.v2.bookmarks({
        expansions: ["referenced_tweets.id"],
        "media.fields": [
          "duration_ms",
          "url",
          "type",
          "media_key",
          "width",
          "height",
          "preview_image_url",
        ],
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

      // console.log("<><>", { allBookmarks });

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
      return res.status(200).json({
        data: returnResponse,
        count: bookmarks.meta.result_count,
        nextToken: bookmarks.meta.next_token,
      });
    } catch (error) {
      if (error.code === 401) {
        console.log("401 ISSUE : ", error);

        try {
          console.log("bout to try", REFRESH_TOKEN);
          const response = await axios(
            "https://api.twitter.com/2/oauth2/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${process.env.CONF_HEADER}`,
              },
              data: `grant_type=refresh_token&refresh_token=${REFRESH_TOKEN}`,
            }
          );

          console.log("sucesss", response);
        } catch (error) {
          console.log("err ref", error?.data);
        }

        return res
          .status(error.code)
          .json({ status: error, message: "Error in getting bookmarks" });
      }

      console.log("another issue", error);
    }
  } else {
    return res.status(400).json({ status: "Access Token not found" });
  }
}
