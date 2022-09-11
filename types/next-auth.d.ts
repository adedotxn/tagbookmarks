/* eslint-disable no-unused-vars */
import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    twitter: {
      accessToken?: string;
      refreshToken?: string;
      userId?: string;
    };
  }
}
