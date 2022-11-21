import nextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
      async authorize(credentials) {

        let formData = {};

        if (credentials?.login == "true") {
          // Google login
          if (credentials?.source === "2") {
            formData = {
              source_id: credentials?.source_id,
              source: credentials?.source
            }
          }
          else {
            // Normal login
            formData = {
              email: credentials?.email,
              password: credentials?.password,
              source: credentials?.source
            };
          }
        } else {
          // Register
          formData = {
            source_id: credentials?.source_id,
            source: credentials?.source,
            display_name: credentials?.display_name,
            email: credentials?.email,
            password: credentials?.password
          }
        }

        const res =
          await fetch(`https://cloudart.com.au:3235/api/${credentials?.url
            }`, {
            method: credentials?.method ?? "get",
            body: JSON.stringify(formData),
            headers: {
              "Content-Type": "application/json",
              token: "",
            },
          });
        const userDetails = (await res.json());
        if (!userDetails?.status) {
          if (credentials?.source == "2" || credentials?.source == "3") {
            throw new Error(JSON.stringify(userDetails))
          } else
            throw new Error(userDetails?.message ?? "something went wrong");
        }
        const user = userDetails.body.profile;
        return { id: user.user_id, ...user, token: userDetails?.body?.token ?? "", comments: userDetails?.body?.token ?? 0 };
      },
    })
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
    signIn: async ({ user }) => {
      if (user?.id) return true
      return false
    },
  },
};

export default nextAuth(authOptions);
