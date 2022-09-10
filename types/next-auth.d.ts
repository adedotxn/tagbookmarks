/* eslint-disable no-unused-vars */
import { Account } from "next-auth";
import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    /** OpenID ID Token */
    idToken?: string;
    accessToken?: string;
    account: Account;
    twitter: {
      accessToken?: string;
      refreshToken?: string;
      userId?: string;
    };
  }
}
