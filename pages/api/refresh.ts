// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const refreshToken = token?.refreshToken;
    console.log("refresh token endpoint", refreshToken);
    return res.status(200).json(refreshToken);
  } catch (error) {
    console.log("refresh error", error);
    return res.status(404).json(error);
  }
}
