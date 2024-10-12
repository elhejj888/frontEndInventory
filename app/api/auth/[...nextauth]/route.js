import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const res = await fetch("http://localhost:8080/auth/generateToken2", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password
            })
          });

          if (!res.ok) {
            if (res.status === 401) {
              throw new Error('Mot de passe ou Nom d\'utilisateur incorrect');
            } else if (res.status === 404) {
              throw new Error('Username not found');
            } else if (res.status === 500) {
              throw new Error('Internal server error');
            } else {
              throw new Error(`Erreur: ${res.status}`);
            }
          }

          const user = await res.json();

          if (user && res.ok) {
            return {
              id: user.user.id,
              username: user.user.username,
              email: user.user.email,
              roles: user.user.roles,
              firstName: user.user.firstName,
              lastName: user.user.lastName,
              service: user.user.service,
              confirmed: user.user.confirmed,
              tempon: user.user.tempon,
              software: user.user.software,
              token: user.token
            };
          }
        } catch (error) {
          console.error('Error during authorization:', error);
          throw new Error("Serveur ne repond pas..!"); // Pass the error message to the front-end
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      return session;
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    encryption: true, // If you want to use encryption, ensure you have a valid secret
  },
  pages: {
    signIn: '/Login',
  }
});

// Named export for HTTP methods
export { handler as POST, handler as GET };