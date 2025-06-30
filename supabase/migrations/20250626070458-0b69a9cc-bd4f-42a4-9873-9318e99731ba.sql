
-- Supprimer les politiques existantes et les recréer proprement
-- Commencer par désactiver RLS temporairement pour nettoyer

-- Nettoyer les politiques existantes sur feedbacks
DROP POLICY IF EXISTS "Users can view own feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Users can insert own feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Users can update own feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Admins can view all feedbacks" ON public.feedbacks;

-- Recréer les politiques pour feedbacks
CREATE POLICY "Users can view own feedbacks" ON public.feedbacks
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own feedbacks" ON public.feedbacks
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own feedbacks" ON public.feedbacks
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Admins can view all feedbacks" ON public.feedbacks
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Activer RLS sur les tables restantes qui n'ont pas encore été traitées
-- (en évitant les doublons)

-- Table profiles
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view own profile') THEN
        CREATE POLICY "Users can view own profile" ON public.profiles
          FOR SELECT USING (auth.uid() = id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON public.profiles
          FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile') THEN
        CREATE POLICY "Users can insert own profile" ON public.profiles
          FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- Table contributors
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contributors' AND policyname = 'Users can view own contributors') THEN
        CREATE POLICY "Users can view own contributors" ON public.contributors
          FOR SELECT USING (auth.uid() = profile_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contributors' AND policyname = 'Users can insert own contributors') THEN
        CREATE POLICY "Users can insert own contributors" ON public.contributors
          FOR INSERT WITH CHECK (auth.uid() = profile_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contributors' AND policyname = 'Users can update own contributors') THEN
        CREATE POLICY "Users can update own contributors" ON public.contributors
          FOR UPDATE USING (auth.uid() = profile_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contributors' AND policyname = 'Users can delete own contributors') THEN
        CREATE POLICY "Users can delete own contributors" ON public.contributors
          FOR DELETE USING (auth.uid() = profile_id);
    END IF;
END $$;

-- Table expenses
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'expenses' AND policyname = 'Users can view own expenses') THEN
        CREATE POLICY "Users can view own expenses" ON public.expenses
          FOR SELECT USING (auth.uid() = profile_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'expenses' AND policyname = 'Users can insert own expenses') THEN
        CREATE POLICY "Users can insert own expenses" ON public.expenses
          FOR INSERT WITH CHECK (auth.uid() = profile_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'expenses' AND policyname = 'Users can update own expenses') THEN
        CREATE POLICY "Users can update own expenses" ON public.expenses
          FOR UPDATE USING (auth.uid() = profile_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'expenses' AND policyname = 'Users can delete own expenses') THEN
        CREATE POLICY "Users can delete own expenses" ON public.expenses
          FOR DELETE USING (auth.uid() = profile_id);
    END IF;
END $$;

-- Activer RLS sur toutes les tables principales
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_savings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projets_epargne ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.changelog_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_expense_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_permissions ENABLE ROW LEVEL SECURITY;
