import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      stripeCustomerId: string;
      isActive: boolean;
      dark_mode: boolean;
    } & DefaultSession["user"];
  }
}
