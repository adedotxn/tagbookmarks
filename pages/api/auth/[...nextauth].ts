import NextAuth, { Account, NextAuthOptions, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import TwitterProvider from "next-auth/providers/twitter";
// import clientPromise from "../../../db/adapter";
import connect from "../../../db/connect";
import DBUser from "../../../db/models/user";

import { refreshAccessTokenNext } from "../../../utils/api/refreshToken";
import { UserInterface } from "../../../utils/interface/user.interface";

export const authOptions: NextAuthOptions = {
  // adapter: MongoDBAdapter(clientPromise),
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

      // Access token has expired, try to update it
      return refreshAccessTokenNext(token);
    },
    async session({ session, token }) {
      session["user"].id = token?.user?.id;
      session["user"].image = token?.user?.image;
      session["user"].name = token?.user?.name;
      session.accessToken = token.accessToken;
      session.error = token.error;
      session.refreshToken = token.refreshToken;

      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log("signIn", { user, account, credentials, profile, email });

      try {
        await connect();
        const userExists = await DBUser.find({ tweepId: user?.id });
        console.log("signIn-CB -- UserExists");

        if (userExists.length >= 1) {
          userExists[0].accessToken = account?.access_token;
          userExists[0].refreshToken = account?.refresh_token;
          userExists[0].save();
          return true;
        }

        const saveUser = new DBUser<UserInterface>({
          tweepId: user?.id,
          userTags: [],
          refreshToken: account?.refresh_token,
          accessToken: account?.access_token,
        });

        await saveUser.save();

        return true;
      } catch (error) {
        console.log("Sign in callback error", error);
      }

      return false;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "123",
};

export default NextAuth(authOptions);
