# Supabase Setup Guide for CarConnect Ghana

This guide will help you set up Supabase as the backend for your CarConnect Ghana application.

## Prerequisites

- A Supabase account (free tier is sufficient for development)
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up/login with your GitHub account
4. Click "New Project"
5. Select your organization
6. Enter project details:
   - **Project Name**: `carconnect-ghana`
   - **Database Password**: Create a strong password (save it securely)
   - **Region**: Choose the closest region to your users (e.g., West Africa)
7. Click "Create new project"
8. Wait for the project to be created (2-3 minutes)

## Step 2: Get Your Supabase Credentials

1. Go to your project dashboard
2. Click on **Settings** (gear icon)
3. Select **API**
4. Copy the following values:
   - **Project URL** (starts with https://)
   - **anon public** API key

## Step 3: Update Environment Variables

Update your `.env` file with your Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace:
- `https://your-project-id.supabase.co` with your actual Project URL
- `your_anon_key_here` with your actual anon public key

## Step 4: Set Up Database Schema

1. Go to your Supabase project dashboard
2. Click on **SQL Editor**
3. Click **"New query"**
4. Copy the entire contents of `supabase-schema.sql`
5. Paste it into the SQL editor
6. Click **"Run"** to execute the schema

This will create:
- Tables: `users`, `car_listings`, `payments`, `subscriptions`, `inquiries`
- Indexes for performance
- Row Level Security (RLS) policies
- Storage buckets for images
- Triggers and functions

## Step 5: Configure Authentication

1. Go to **Authentication** → **Settings**
2. Under **Site URL**, enter: `http://localhost:8080`
3. Under **Redirect URLs**, add:
   - `http://localhost:8080`
   - `http://localhost:8080/dashboard`
   - `http://localhost:8080/login`
   - `http://localhost:8080/register`

4. Enable providers you want to use:
   - **Email**: Enable and configure SMTP settings (optional for development)
   - **Google**: Enable if you want Google OAuth (requires Google Cloud setup)

## Step 6: Set Up Storage

1. Go to **Storage**
2. You should see two buckets created:
   - `car-images` (for car listing photos)
   - `avatars` (for user profile pictures)

3. The bucket policies are already set up by the schema script

## Step 7: Create an Admin User (Optional)

Run this SQL in the SQL Editor to create an admin user:

```sql
-- First, create the auth user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  uuid_generate_v4(),
  'admin@carconnect.com',
  crypt('your_admin_password', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"name": "Admin User", "role": "admin"}'
) ON CONFLICT (id) DO NOTHING;

-- Then create the user profile
INSERT INTO public.users (
  id,
  email,
  name,
  role,
  is_verified,
  is_active
) SELECT 
  id,
  email,
  raw_user_meta_data->>'name',
  'admin',
  true,
  true
FROM auth.users 
WHERE email = 'admin@carconnect.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  is_verified = true,
  is_active = true;
```

Replace `your_admin_password` with a secure password.

## Step 8: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the browser console and check for Supabase connection logs

3. Try registering a new user or logging in

## Step 9: Enable Real-time Features

1. Go to **Database** → **Replication**
2. Under **Realtime**, click **"Enable"** for the following tables:
   - `users`
   - `car_listings` 
   - `payments`
   - `subscriptions`
   - `inquiries`

This enables real-time updates between admin and user dashboards.

## Step 10: Production Considerations

For production deployment:

1. **Security**:
   - Enable Row Level Security (already done in schema)
   - Use environment variables for all secrets
   - Enable 2FA for your Supabase account

2. **Performance**:
   - Monitor database usage in Supabase dashboard
   - Set up database backups
   - Consider upgrading to Pro plan for higher limits

3. **Domain**:
   - Add your custom domain to Supabase settings
   - Update redirect URLs accordingly

## Troubleshooting

### Common Issues:

1. **"Invalid JWT" errors**:
   - Check that your anon key is correct
   - Ensure environment variables are loaded properly

2. **"Permission denied" errors**:
   - Check RLS policies in SQL Editor
   - Ensure user is authenticated

3. **Real-time not working**:
   - Ensure replication is enabled for the tables
   - Check browser console for WebSocket connection errors

4. **File upload issues**:
   - Check storage bucket policies
   - Ensure user is authenticated

### Debugging Tips:

1. Check browser console for detailed error messages
2. Use Supabase dashboard to verify data
3. Test queries in SQL Editor first
4. Check network tab for API requests

## Next Steps

Once Supabase is set up:

1. All CRUD operations will work with real data
2. Authentication will use Supabase Auth
3. Real-time updates will work between admin and user dashboards
4. File uploads will store in Supabase Storage
5. Your application is now production-ready with a proper backend!

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.gg/supabase)
- Check the browser console for detailed error messages
