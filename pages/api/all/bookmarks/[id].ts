// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { TweetV2, TwitterApi } from "twitter-api-v2";
import connect from "../../../../db/connect";
import DBUser from "../../../../db/models/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connect();
  const tweepId = req.query.id;
  const userExists = await DBUser.find({ tweepId });
  const ACCESS_TOKEN = userExists[0].accessToken;
  const twitterClient = new TwitterApi(ACCESS_TOKEN);
  const readOnlyClient = twitterClient.readOnly;

  // const authorId = ids[0];
  // const tweepId = ids[1];

  if (!userExists) return res.status(404);

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

    while (!bookmarks.done) {
      await bookmarks.fetchNext();
    }

    const allBookmarks = await bookmarks.fetchLast(2000);
    const includesResult = allBookmarks?.includes;
    // const test = TwitterV2IncludesHelper.tweets(allBookmarks);
    // const includes = new TwitterV2IncludesHelper(allBookmarks);
    // console.log("allBookmarks", allBookmarks);
    // console.log("allBookmarksIncludes", allBookmarks.includes);

    // console.log("includes", includes);

    // console.log("test", test);
    // console.log("testLength", test.length);

    let iterateBookmarks: TweetV2[] = [];

    for await (const tweet of bookmarks) {
      iterateBookmarks = [...iterateBookmarks, tweet];
    }

    console.log("iterateBookmarks", iterateBookmarks);

    return res.status(200).json({
      bookmarks: iterateBookmarks,
      nextToken: bookmarks.meta.next_token,
    });
  } catch (error) {
    console.log("Error", error);
    return res
      .status(404)
      .json({ status: "Error fetching all bookmarks", message: error });
  }
}
