// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
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
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("got Token", token?.refreshToken);

  await connect();
  console.log("db connected");
  const userExists = await DBUser.find({ tweepId });
  if (!userExists || userExists.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }
  const ACCESS_TOKEN = userExists[0].accessToken;
  const REFRESH_TOKEN = userExists[0].refreshToken;

  console.log("are access' equal", token?.accessToken === ACCESS_TOKEN);
  console.log("are refresh equal", token?.refreshToken === REFRESH_TOKEN);
  if (ACCESS_TOKEN !== undefined || "") {
    console.log("starting tC...");
    const twitterClient = new TwitterApi(ACCESS_TOKEN);

    const readOnlyClient = twitterClient.readOnly;

    try {
      console.log("Starting bookmark endpoint call...");
      let bookmarks;
      if (slug.length === 1) {
        console.log("get all bookmarks");
        bookmarks = await readOnlyClient.v2.bookmarks({
          expansions: ["referenced_tweets.id"],
          "media.fields": ["duration_ms", "url"],
          "tweet.fields": [
            "created_at",
            "attachments",
            "in_reply_to_user_id",
            "author_id",
          ],
        });
      } else {
        console.log(`get ${maxResults} bookmarks`);
        bookmarks = await twitterClient.v2.bookmarks({
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
      }

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

        console.log(
          "IN ERRORaccess' equal",
          token?.accessToken === ACCESS_TOKEN
        );
        console.log(
          "IN ERROR refresh equal?",
          token?.refreshToken === REFRESH_TOKEN
        );

        try {
          console.log("bout to try", REFRESH_TOKEN);
          const response = await axios.post(
            "https://api.twitter.com/2/oauth2/token",
            new URLSearchParams({
              refresh_token: `${REFRESH_TOKEN}`,
              grant_type: "refresh_token",
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${process.env.CONF_HEADER}`,
              },
            }
          );

          console.log("sucesss", response);
        } catch (error) {
          console.log("Error refreshing tokens", error);
          return res
            .status(400)
            .json({ status: "Error refreshing token", message: error });
        }
      } else {
        console.log("Error getting bookmarks", error);
        return res
          .status(404)
          .json({ status: "Error getting bookmarks", message: error });
      }
    }
  } else {
    return res.status(404).json({ status: "Access Token not found" });
  }
}
