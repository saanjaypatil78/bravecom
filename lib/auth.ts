import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client to handle user profile creation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth (when credentials are provided)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== "your-client-id.apps.googleusercontent.com"
      ? [
        require("next-auth/providers/google").GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
      ]
      : []),
    // Fallback: Email-based credentials for development
    CredentialsProvider({
      id: "email-otp",
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        if (process.env.NODE_ENV === "development" && credentials.otp === "123456") {
          const email = credentials.email.toLowerCase();

          // 1. Check if user profile exists
          let { data: profile } = await supabaseAdmin
            .from('user_profiles')
            .select('*')
            .eq('email', email)
            .single();

          if (!profile) {
            // Create user in Supabase Auth first
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
              email: email,
              email_confirm: true,
              user_metadata: { name: email.split('@')[0] }
            });

            if (authError && !authError.message.includes('already exists')) {
              console.error("[AUTH] Failed to create Supabase auth user:", authError);
              return null;
            }

            // In case it already existed in auth but not profile, fetch auth user
            let authId = authData?.user?.id;
            if (!authId) {
              const { data: users } = await supabaseAdmin.auth.admin.listUsers();
              const existing = users.users.find(u => u.email === email);
              if (existing) authId = existing.id;
            }

            if (authId) {
              // Insert profile
              const { data: newProfile, error: profileError } = await supabaseAdmin
                .from('user_profiles')
                .insert({
                  id: authId,
                  email: email,
                  full_name: email.split("@")[0],
                  role: 'user', // maps to 'buyer' in NextAuth
                })
                .select()
                .single();

              if (profileError) {
                console.error("[AUTH] Failed to create user profile:", profileError);
                return null;
              }
              profile = newProfile;
              console.log(`[AUTH] New user created in Supabase: ${email}`);
            } else {
              return null;
            }
          }

          return {
            id: profile.id,
            email: profile.email,
            name: profile.full_name,
            image: profile.avatar_url,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        (session.user as any).userType = token.userType;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      // Re-hydrate the role from Supabase to ensure RBAC is fresh
      if (token.email) {
        const { data: profile } = await supabaseAdmin
          .from('user_profiles')
          .select('role')
          .eq('email', token.email)
          .single();

        if (profile) {
          // Map 'user' from DB to 'buyer' for frontend compatibility
          token.userType = profile.role === 'user' ? 'buyer' : profile.role;
        }
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-in-prod",
};
