-- Create a function to create admin from existing user
CREATE OR REPLACE FUNCTION public.create_admin_user(
  admin_email TEXT DEFAULT 'admin@sakconstructionsgh.com'
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Check if user exists
  SELECT user_id INTO admin_user_id FROM profiles WHERE email = admin_email;
  
  IF admin_user_id IS NOT NULL THEN
    -- Update existing user to admin
    UPDATE profiles 
    SET role = 'admin'
    WHERE email = admin_email;
    
    RETURN 'User promoted to admin: ' || admin_email;
  ELSE
    RETURN 'Please sign up with email: ' || admin_email || ' first, then run this function again';
  END IF;
END;
$$;