-- Create or update admin profile for the current user
-- This function will be called manually to set up admin access

CREATE OR REPLACE FUNCTION public.setup_admin_profile(
  admin_email TEXT DEFAULT 'admin@sakconstructionsgh.com'
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get the user_id for the admin email
  SELECT id INTO admin_user_id FROM auth.users WHERE email = admin_email;
  
  IF admin_user_id IS NULL THEN
    RETURN 'User with email ' || admin_email || ' not found in auth.users';
  END IF;
  
  -- Insert or update the profile
  INSERT INTO public.profiles (
    user_id,
    email,
    first_name,
    last_name,
    role,
    phone,
    country
  ) VALUES (
    admin_user_id,
    admin_email,
    'Admin',
    'User',
    'admin',
    '+233 20 123 4567',
    'Ghana'
  ) ON CONFLICT (user_id) 
  DO UPDATE SET
    role = 'admin',
    first_name = 'Admin',
    last_name = 'User',
    phone = '+233 20 123 4567',
    country = 'Ghana';
    
  RETURN 'Admin profile created/updated for user: ' || admin_email;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.setup_admin_profile(TEXT) TO authenticated;
