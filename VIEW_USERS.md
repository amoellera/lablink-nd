# How to View Registered Users

## View All Users in Supabase Dashboard

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com
   - Sign in to your account
   - Select your project

2. **Navigate to Authentication → Users**
   - In the left sidebar, click **Authentication**
   - Then click **Users**
   - You'll see a list of all registered users with:
     - Email addresses
     - User IDs (UUID)
     - Created dates
     - Last sign in dates
     - Other metadata

3. **View Profile Data**
   - Go to **Table Editor** in the left sidebar
   - Select the **profiles** table (if it exists)
   - You'll see all user profiles with:
     - Email addresses
     - Names
     - Majors
     - Years
     - GPA (if uploaded)
     - Work experience (if uploaded)

## Check Duplicate Signups

Supabase Auth automatically prevents duplicate email addresses. If a user tries to sign up with an email that already exists, they will get an error message and must sign in instead.

## SQL Query to View All Users

You can also run this query in **SQL Editor** to see all users and their profile data:

```sql
SELECT 
  u.id,
  u.email,
  u.created_at as user_created_at,
  p.name,
  p.major,
  p.year,
  p.gpa,
  p.work_experience,
  p.updated_at as profile_updated_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
```

This will show all users from the auth system along with their profile information.
