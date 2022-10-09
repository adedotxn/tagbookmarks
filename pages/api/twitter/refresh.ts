// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const refreshToken = token?.refreshToken;

  try {
    const url =
      "https://twitter.com/i/oauth2/authorize?" +
      new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
        client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: refreshToken!,
      });

    console.log("get client id", { url });
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });
    console.log("response", response);

    return res.status(200).json(response);
  } catch (error) {
    console.log("refresh error", error);
    return res.status(404).json(error);
  }
}
