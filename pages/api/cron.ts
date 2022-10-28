// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { verifySignature } from "@upstash/qstash/nextjs";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import connect from "../../db/connect";
import DBUser from "../../db/models/user";

/* 
  * UNDONE -- still getting errors

  *Trying to setup a cron job to refresh user access token per hour with Qstash
  *so that users don't have to reauthorise the app after leaving for a few hours or so
  */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connect();
    const data = await DBUser.find({});
    const refreshTokensArray: string[] = [];
    data.forEach((e) => refreshTokensArray.push(e.refreshToken!));

    refreshTokensArray.forEach(async (refreshToken: string) => {
      console.log("\nTrying....");
      try {
        console.log("\nTrying x2....");
        await axios
          .post(
            "https://api.twitter.com/2/oauth2/token",
            new URLSearchParams({
              refresh_token: refreshToken,
              grant_type: "refresh_token",
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${process.env.CONF_HEADER}`,
              },
            }
          )
          .then((response) => {
            console.log("chained response", response);
          });
      } catch (error) {
        console.log("\n Should Catch", error);
      }
    });

    // console.log("data", data);
    res.status(200).json(data);
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ error });
  }
}

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
