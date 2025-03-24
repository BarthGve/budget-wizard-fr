
-- Ajouter une colonne pour suivre l'état de l'onboarding dans les profils
ALTER TABLE IF EXISTS public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Commentaire pour la nouvelle colonne
COMMENT ON COLUMN public.profiles.onboarding_completed IS 'Indique si l''utilisateur a terminé l''onboarding ou choisi de ne plus le voir';
