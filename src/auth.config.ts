import type { NextAuthConfig } from "next-auth";

export default {
  providers: [],
  callbacks: {
    authorized({ auth }) {
      return !!auth;
    },
  },
} satisfies NextAuthConfig;
