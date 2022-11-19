import nextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { resHandler } from "../../../utils/api";
import { http } from "../../../utils/http";

const googleProviderProps = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
};

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials, req) {
        let formData = {};

        if (credentials?.login === "true") {
          formData = {
            email: credentials?.email,
            password: credentials?.password,
            source: credentials?.source,
          };
        }

        let obj = {
          data: formData,
          token: "",
          method: credentials?.method,
          url: credentials?.url,
        };

        let res = await http(obj);
        res = resHandler(res);

        if (!res?.status) throw new Error(res?.message);
        const user = res.body.profile;
        return {
          id: user.user_id,
          ...user,
          token: res?.body?.token,
          comments: res?.body?.comments,
        };
      },
    }),
    // GoogleProvider({
    //   ...googleProviderProps,
    // }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      return { ...token, ...user };
    },
    session: async ({ session, token }) => {
      if (!token) return token;
      return { ...session, user: token };
    },
    signIn: async ({ user, profile, account }) => {
      return true;
    },
  },
};

export default nextAuth(authOptions);
