// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { verifySignature } from "@upstash/qstash/nextjs";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const REFRESH_TOKEN = token?.refreshToken;

  if (req.method === "POST") {
    try {
      console.log("got Token", REFRESH_TOKEN);

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

      console.log("cron response", response);
    } catch (error) {
      console.log("refresh error", error);
      return res
        .status(400)
        .json({ statusCode: 500, message: error, tokenCheck: REFRESH_TOKEN });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
