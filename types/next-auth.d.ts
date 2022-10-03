/* eslint-disable no-unused-vars */
import "next-auth";
import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    user: {
      id: string;
      name: string;
      image: string;
    };
    iat: number;
    exp: number;
    jti: string;
    twitter: {
      expires?: number;
      accessToken?: string;
      refreshToken?: string;
      userId?: string;
    };
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id?: string;
    } & DefaultSession["user"];
  }
}
