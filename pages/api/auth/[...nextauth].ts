import NextAuth, { Account, NextAuthOptions, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import TwitterProvider from "next-auth/providers/twitter";
import { refreshAccessToken } from "../../../utils/api/refreshToken";

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      version: "2.0", // opt-in to Twitter OAuth 2.0
      authorization: {
        url: "https://twitter.com/i/oauth2/authorize",
        params: {
          scope: "tweet.read users.read bookmark.read offline.access",
        },
      },
      // token : {
      //   url : "https://api.twitter.com/2/oauth2/token"
      // }
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
      account,
    }: {
      token: JWT;
      account?: Account;
      user?: User;
    }) {
      // const provider = account?.provider !== undefined ? account.provider : "";

      // if (provider && !token[provider]) {
      //   token["twitter"] = {};
      // }

      // if (account?.access_token) {
      //   token["twitter"].accessToken = account?.access_token!;
      // }
      // if (account?.refresh_token) {
      //   token["twitter"].refreshToken = account?.refresh_token!;
      // }

      // if (user?.id) {
      //   token["twitter"].userId = user?.id;
      // }
      // if (account?.expires_at) {
      //   token["twitter"].expires = account?.expires_at;
      // }

      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_at! * 1000,
          refreshToken: account.refresh_token,
          user,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires!) {
        return token;
      }

      console.log("final token?", token);

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    // attaching the userID to session
    async session({ session, token }) {
      session["user"].id = token?.user?.id;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "123",
};

export default NextAuth(authOptions);
