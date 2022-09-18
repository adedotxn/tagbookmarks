import NextAuth, { Account, NextAuthOptions, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import TwitterProvider from "next-auth/providers/twitter";

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      version: "2.0", // opt-in to Twitter OAuth 2.0
      authorization: {
        url: "https://twitter.com/i/oauth2/authorize",
        params: {
          scope: "tweet.read users.read bookmark.read",
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
      const provider = account?.provider !== undefined ? account.provider : "";

      if (provider && !token[provider]) {
        token["twitter"] = {};
      }

      if (account?.access_token) {
        token["twitter"].accessToken = account?.access_token!;
      }
      if (account?.refresh_token) {
        token["twitter"].refreshToken = account?.refresh_token!;
      }

      if (user?.id) {
        token["twitter"].userId = user?.id;
      }

      console.log(account?.refresh_token ? true : false);
      console.log("at callback", token);

      return token;
    },
    async session({ session, user, token }) {
      session["user"].id = token.twitter.userId;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "123",
};

export default NextAuth(authOptions);
