import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  callbacks: {
    async jwt({token, user}) {
      if(user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({session, token}) {
      if(session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role
      }
      return session
    }
  },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        if(!credentials.email || !credentials.password) return null

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string
          }
        })

        if(!user) return null

        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          user.password as string
        )

        if(!isValidPassword) return null

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
        }
      }
    })
  ],

  session: {
    strategy: "jwt"
  }
});