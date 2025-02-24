
-- Optimisation des politiques RLS
ALTER TABLE public.contributors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contributors are viewable by owner"
  ON public.contributors
  FOR SELECT
  USING (auth.uid() = profile_id);

ALTER TABLE public.monthly_savings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Monthly savings are viewable by owner"
  ON public.monthly_savings
  FOR SELECT
  USING (auth.uid() = profile_id);

ALTER TABLE public.recurring_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Recurring expenses are viewable by owner"
  ON public.recurring_expenses
  FOR SELECT
  USING (auth.uid() = profile_id);

-- Ajout d'index pour optimiser les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_contributors_profile_id 
  ON public.contributors(profile_id);
CREATE INDEX IF NOT EXISTS idx_monthly_savings_profile_id 
  ON public.monthly_savings(profile_id);
CREATE INDEX IF NOT EXISTS idx_recurring_expenses_profile_id 
  ON public.recurring_expenses(profile_id);
