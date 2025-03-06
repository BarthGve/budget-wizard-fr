
-- Créer une fonction pour lister les IDs des utilisateurs admin
CREATE OR REPLACE FUNCTION public.list_admins()
RETURNS TABLE (id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT user_id::uuid FROM user_roles WHERE role = 'admin';
END;
$$;
