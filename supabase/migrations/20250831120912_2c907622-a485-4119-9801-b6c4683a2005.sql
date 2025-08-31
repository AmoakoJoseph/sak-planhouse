-- Add missing fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN phone TEXT,
ADD COLUMN address TEXT,
ADD COLUMN city TEXT,
ADD COLUMN country TEXT DEFAULT 'Ghana',
ADD COLUMN bio TEXT,
ADD COLUMN company TEXT,
ADD COLUMN website TEXT;

-- Create an admin user profile (you'll need to sign up with this email first)
-- This will be used once the auth user is created
-- The trigger will automatically create the profile, but we'll update it to admin role

-- Create a function to promote user to admin (for manual use)
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET role = 'admin'
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
END;
$$;

-- Example: After you create a user account with email 'admin@sakconstructionsgh.com', 
-- you can promote them by running: SELECT promote_user_to_admin('admin@sakconstructionsgh.com');