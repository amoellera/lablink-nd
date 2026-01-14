# Supabase Setup Instructions

## 1. Install Supabase Client

Run this command in your terminal:
```bash
npm install @supabase/supabase-js
```

## 2. Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or sign in
3. Click "New Project"
4. Fill in your project details
5. Wait for the project to be created

## 3. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon/public key**

## 4. Create Environment Variables File

Create a file named `.env.local` in the root of your project with:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with your actual Supabase credentials.

## 5. Configure Email Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Optionally configure email templates

## 6. Set Up Email Domain Restriction (Optional)

To enforce @nd.edu emails at the database level:

1. Go to **Authentication** → **Policies**
2. Create a policy that only allows @nd.edu emails

Or use Supabase's email domain validation feature in the Auth settings.

## 7. Test Your Setup

1. Start your development server: `npm run dev`
2. Try signing up with an @nd.edu email
3. Check your Supabase dashboard → **Authentication** → **Users** to see the new user

## Notes

- The signup form now validates that emails end with `@nd.edu`
- Accounts are created in Supabase Auth
- Users are redirected to onboarding after signup
- Users are redirected to dashboard after signin
