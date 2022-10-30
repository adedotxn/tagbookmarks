// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TwitterApiAutoTokenRefresher } from "@twitter-api-v2/plugin-token-refresher";
import type { NextApiRequest, NextApiResponse } from "next";
import { TweetV2, TwitterApi } from "twitter-api-v2";
import connect from "../../../db/connect";
import Collection from "../../../db/models/collection";
import DBUser from "../../../db/models/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  /**
   * Returns collection of a user's tagged tweets
   * I am trying to use autoRefresher on this endpoint to check if it will solve the issue
   */
  try {
    const { id: tweepId } = req.query;
    await connect();
    console.log(`/tags/${tweepId}`);

    const userExists = await DBUser.find({ tweepId });
    if (!userExists || userExists.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const data = await Collection.find({ tweepId }).sort({
      time: -1,
    });

    const tweetIds: string[] = data.map((e) => {
      return e.tweetId;
    });

    const ACCESS_TOKEN = userExists[0].accessToken;
    const REFRESH_TOKEN = userExists[0].refreshToken;

    const credentials = {
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
    };

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
        tokenStore.refreshToken = token.refreshToken;
        userExists[0].accessToken = token.accessToken;
        userExists[0].refreshToken = token.refreshToken;
        userExists[0].save();
      },
      onTokenRefreshError(error) {
        console.error("Refresh error", error);
      },
    });

    if (ACCESS_TOKEN !== undefined || "") {
      console.log("\taccess token type", ACCESS_TOKEN);
      // const twitterClient = new TwitterApi(ACCESS_TOKEN);
      const twitterClient = new TwitterApi(tokenStore.accessToken, {
        plugins: [autoRefresherPlugin],
      });
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
    return res.status(404).json({ error });
  }
}
