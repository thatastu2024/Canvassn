import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AzureADProvider from 'next-auth/providers/azure-ad';

export default NextAuth({
  providers: [],
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      return token
    },
    async session(session) {
      return session;
    },
    async redirect({url,baseUrl}){
      return baseUrl
    }
  }
});
