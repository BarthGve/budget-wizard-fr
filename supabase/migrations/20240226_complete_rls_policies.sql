
-- Créer les politiques RLS manquantes pour toutes les tables

-- Table retailers
CREATE POLICY IF NOT EXISTS "Users can view own retailers" ON public.retailers
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can insert own retailers" ON public.retailers
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can update own retailers" ON public.retailers
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can delete own retailers" ON public.retailers
  FOR DELETE USING (auth.uid() = profile_id);

-- Table recurring_expenses
CREATE POLICY IF NOT EXISTS "Users can view own recurring expenses" ON public.recurring_expenses
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can insert own recurring expenses" ON public.recurring_expenses
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can update own recurring expenses" ON public.recurring_expenses
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can delete own recurring expenses" ON public.recurring_expenses
  FOR DELETE USING (auth.uid() = profile_id);

-- Table monthly_savings
CREATE POLICY IF NOT EXISTS "Users can view own monthly savings" ON public.monthly_savings
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can insert own monthly savings" ON public.monthly_savings
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can update own monthly savings" ON public.monthly_savings
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can delete own monthly savings" ON public.monthly_savings
  FOR DELETE USING (auth.uid() = profile_id);

-- Table credits
CREATE POLICY IF NOT EXISTS "Users can view own credits" ON public.credits
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can insert own credits" ON public.credits
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can update own credits" ON public.credits
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can delete own credits" ON public.credits
  FOR DELETE USING (auth.uid() = profile_id);

-- Table vehicles
CREATE POLICY IF NOT EXISTS "Users can view own vehicles" ON public.vehicles
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can insert own vehicles" ON public.vehicles
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can update own vehicles" ON public.vehicles
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can delete own vehicles" ON public.vehicles
  FOR DELETE USING (auth.uid() = profile_id);

-- Table vehicle_expenses
CREATE POLICY IF NOT EXISTS "Users can view own vehicle expenses" ON public.vehicle_expenses
  FOR SELECT USING (auth.uid() = (SELECT profile_id FROM vehicles WHERE id = vehicle_id));

CREATE POLICY IF NOT EXISTS "Users can insert own vehicle expenses" ON public.vehicle_expenses
  FOR INSERT WITH CHECK (auth.uid() = (SELECT profile_id FROM vehicles WHERE id = vehicle_id));

CREATE POLICY IF NOT EXISTS "Users can update own vehicle expenses" ON public.vehicle_expenses
  FOR UPDATE USING (auth.uid() = (SELECT profile_id FROM vehicles WHERE id = vehicle_id));

CREATE POLICY IF NOT EXISTS "Users can delete own vehicle expenses" ON public.vehicle_expenses
  FOR DELETE USING (auth.uid() = (SELECT profile_id FROM vehicles WHERE id = vehicle_id));

-- Table projets_epargne
CREATE POLICY IF NOT EXISTS "Users can view own savings projects" ON public.projets_epargne
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can insert own savings projects" ON public.projets_epargne
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can update own savings projects" ON public.projets_epargne
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can delete own savings projects" ON public.projets_epargne
  FOR DELETE USING (auth.uid() = profile_id);

-- Table properties
CREATE POLICY IF NOT EXISTS "Users can view own properties" ON public.properties
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can insert own properties" ON public.properties
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can update own properties" ON public.properties
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can delete own properties" ON public.properties
  FOR DELETE USING (auth.uid() = profile_id);

-- Table property_expenses
CREATE POLICY IF NOT EXISTS "Users can view own property expenses" ON public.property_expenses
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can insert own property expenses" ON public.property_expenses
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can update own property expenses" ON public.property_expenses
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can delete own property expenses" ON public.property_expenses
  FOR DELETE USING (auth.uid() = profile_id);

-- Table notifications
CREATE POLICY IF NOT EXISTS "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = profile_id);

-- Table recurring_expense_categories
CREATE POLICY IF NOT EXISTS "Users can view own expense categories" ON public.recurring_expense_categories
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can insert own expense categories" ON public.recurring_expense_categories
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can update own expense categories" ON public.recurring_expense_categories
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can delete own expense categories" ON public.recurring_expense_categories
  FOR DELETE USING (auth.uid() = profile_id);

-- Table stock_assets
CREATE POLICY IF NOT EXISTS "Users can view own stock assets" ON public.stock_assets
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can insert own stock assets" ON public.stock_assets
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can update own stock assets" ON public.stock_assets
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can delete own stock assets" ON public.stock_assets
  FOR DELETE USING (auth.uid() = profile_id);

-- Table stock_investments
CREATE POLICY IF NOT EXISTS "Users can view own stock investments" ON public.stock_investments
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can insert own stock investments" ON public.stock_investments
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can update own stock investments" ON public.stock_investments
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY IF NOT EXISTS "Users can delete own stock investments" ON public.stock_investments
  FOR DELETE USING (auth.uid() = profile_id);

-- Politiques pour les tables publiques en lecture seule
CREATE POLICY IF NOT EXISTS "Everyone can view visible changelog entries" ON public.changelog_entries
  FOR SELECT USING (is_visible = true);

CREATE POLICY IF NOT EXISTS "Admins can view all changelog entries" ON public.changelog_entries
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY IF NOT EXISTS "Admins can manage changelog entries" ON public.changelog_entries
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Tables de référence publiques
CREATE POLICY IF NOT EXISTS "Everyone can view fuel companies" ON public.fuel_companies
  FOR SELECT TO authenticated USING (true);

CREATE POLICY IF NOT EXISTS "Everyone can view vehicle expense types" ON public.vehicle_expense_types
  FOR SELECT TO authenticated USING (true);

CREATE POLICY IF NOT EXISTS "Everyone can view vehicle document categories" ON public.vehicle_document_categories
  FOR SELECT TO authenticated USING (true);

-- Politiques pour les tables administratives
CREATE POLICY IF NOT EXISTS "Admins can manage user roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY IF NOT EXISTS "Admins can manage page permissions" ON public.page_permissions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY IF NOT EXISTS "Everyone can view page permissions" ON public.page_permissions
  FOR SELECT TO authenticated USING (true);

-- Table vehicle_documents (sécuriser les documents des véhicules)
ALTER TABLE public.vehicle_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view own vehicle documents" ON public.vehicle_documents
  FOR SELECT USING (auth.uid() = (SELECT profile_id FROM vehicles WHERE id = vehicle_id));

CREATE POLICY IF NOT EXISTS "Users can insert own vehicle documents" ON public.vehicle_documents
  FOR INSERT WITH CHECK (auth.uid() = (SELECT profile_id FROM vehicles WHERE id = vehicle_id));

CREATE POLICY IF NOT EXISTS "Users can update own vehicle documents" ON public.vehicle_documents
  FOR UPDATE USING (auth.uid() = (SELECT profile_id FROM vehicles WHERE id = vehicle_id));

CREATE POLICY IF NOT EXISTS "Users can delete own vehicle documents" ON public.vehicle_documents
  FOR DELETE USING (auth.uid() = (SELECT profile_id FROM vehicles WHERE id = vehicle_id));
