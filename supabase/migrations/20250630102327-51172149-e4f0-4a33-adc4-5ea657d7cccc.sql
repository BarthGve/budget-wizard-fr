
-- Ajout d'index de performance pour optimiser les requêtes fréquentes
-- Ces index vont considérablement améliorer les performances des requêtes filtrées par profile_id

-- Index pour la table contributors
CREATE INDEX IF NOT EXISTS idx_contributors_profile_id ON public.contributors(profile_id);
CREATE INDEX IF NOT EXISTS idx_contributors_profile_created ON public.contributors(profile_id, created_at);

-- Index pour la table expenses
CREATE INDEX IF NOT EXISTS idx_expenses_profile_id ON public.expenses(profile_id);
CREATE INDEX IF NOT EXISTS idx_expenses_profile_date ON public.expenses(profile_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_retailer ON public.expenses(retailer_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(date DESC);

-- Index pour la table recurring_expenses
CREATE INDEX IF NOT EXISTS idx_recurring_expenses_profile_id ON public.recurring_expenses(profile_id);
CREATE INDEX IF NOT EXISTS idx_recurring_expenses_profile_created ON public.recurring_expenses(profile_id, created_at);

-- Index pour la table monthly_savings
CREATE INDEX IF NOT EXISTS idx_monthly_savings_profile_id ON public.monthly_savings(profile_id);
CREATE INDEX IF NOT EXISTS idx_monthly_savings_profile_created ON public.monthly_savings(profile_id, created_at);

-- Index pour la table credits
CREATE INDEX IF NOT EXISTS idx_credits_profile_id ON public.credits(profile_id);
CREATE INDEX IF NOT EXISTS idx_credits_profile_status ON public.credits(profile_id, statut);
CREATE INDEX IF NOT EXISTS idx_credits_status_date ON public.credits(statut, date_derniere_mensualite);

-- Index pour la table vehicles
CREATE INDEX IF NOT EXISTS idx_vehicles_profile_id ON public.vehicles(profile_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_profile_status ON public.vehicles(profile_id, status);

-- Index pour la table vehicle_expenses
CREATE INDEX IF NOT EXISTS idx_vehicle_expenses_vehicle_id ON public.vehicle_expenses(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_expenses_vehicle_date ON public.vehicle_expenses(vehicle_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_vehicle_expenses_date ON public.vehicle_expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_vehicle_expenses_type ON public.vehicle_expenses(expense_type);

-- Index pour la table properties
CREATE INDEX IF NOT EXISTS idx_properties_profile_id ON public.properties(profile_id);

-- Index pour la table property_expenses
CREATE INDEX IF NOT EXISTS idx_property_expenses_profile_id ON public.property_expenses(profile_id);
CREATE INDEX IF NOT EXISTS idx_property_expenses_property_date ON public.property_expenses(property_id, date DESC);

-- Index pour la table feedbacks
CREATE INDEX IF NOT EXISTS idx_feedbacks_profile_id ON public.feedbacks(profile_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_status ON public.feedbacks(status);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created ON public.feedbacks(created_at DESC);

-- Index pour la table notifications
CREATE INDEX IF NOT EXISTS idx_notifications_profile_id ON public.notifications(profile_id);
CREATE INDEX IF NOT EXISTS idx_notifications_profile_status ON public.notifications(profile_id, statut);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);

-- Index pour la table stock_assets
CREATE INDEX IF NOT EXISTS idx_stock_assets_profile_id ON public.stock_assets(profile_id);

-- Index pour la table stock_investments
CREATE INDEX IF NOT EXISTS idx_stock_investments_profile_id ON public.stock_investments(profile_id);
CREATE INDEX IF NOT EXISTS idx_stock_investments_date ON public.stock_investments(investment_date DESC);

-- Index pour la table projets_epargne
CREATE INDEX IF NOT EXISTS idx_projets_epargne_profile_id ON public.projets_epargne(profile_id);
CREATE INDEX IF NOT EXISTS idx_projets_epargne_status ON public.projets_epargne(statut);

-- Index pour la table retailers
CREATE INDEX IF NOT EXISTS idx_retailers_profile_id ON public.retailers(profile_id);

-- Index pour la table recurring_expense_categories
CREATE INDEX IF NOT EXISTS idx_recurring_expense_categories_profile_id ON public.recurring_expense_categories(profile_id);

-- Index pour les requêtes de jointure fréquentes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_documents_vehicle_id ON public.vehicle_documents(vehicle_id);

-- Index composites pour les requêtes complexes du dashboard
CREATE INDEX IF NOT EXISTS idx_contributors_total_contrib ON public.contributors(profile_id, total_contribution DESC);
CREATE INDEX IF NOT EXISTS idx_recurring_expenses_amount ON public.recurring_expenses(profile_id, amount DESC);
CREATE INDEX IF NOT EXISTS idx_monthly_savings_amount ON public.monthly_savings(profile_id, amount DESC);

-- Statistiques pour optimiser le planificateur de requêtes
ANALYZE public.contributors;
ANALYZE public.expenses;
ANALYZE public.recurring_expenses;
ANALYZE public.monthly_savings;
ANALYZE public.credits;
ANALYZE public.vehicles;
ANALYZE public.vehicle_expenses;
ANALYZE public.feedbacks;
ANALYZE public.notifications;
