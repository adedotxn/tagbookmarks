// https://twitter.com/i/oauth2/authorize

import axios from "axios";

export async function refreshAccessTokenNext(token: any) {
  try {
    const url =
      "https://twitter.com/i/oauth2/authorize?" +
      new URLSearchParams({
        client_id: process.env.CLIENT_ID!,
        client_secret: process.env.CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// https://twitter.com/i/oauth2/authorize

export async function refreshAccessToken() {
  try {
    const refreshToken = await axios.get("api/refresh");

    const response = await axios.post(
      "https://api.twitter.com/2/oauth2/token",
      new URLSearchParams({
        refresh_token: refreshToken.data,
        grant_type: "refresh_token",
        client_id: process.env.CLIENT_ID!,
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      }
    );

    console.log("interceptor response", response);
  } catch (error) {
    console.log("interceptor error", error);

    return {
      error: "RefreshAccessTokenError",
    };
  }
}

export const axiosRefreshAccessToken = async (refresh: string | undefined) => {
  await axios("https://api.twitter.com/2/oauth2/token"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: `grant_type=refresh_token&refresh_token=${refresh}&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}`,
    };
};
