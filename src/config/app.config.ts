
export const appConfig = {
  version: 'v1.0.0',
  name: 'Budget Wizard',
  initiales: 'BW',
  landing: {
    hero: {
      title: 'Maitrisez vos dépenses, libérez vos ambitions',
      description: 'Prenez les commandes de votre budget avec BudgetWizard. Un tableau de bord intelligent pour gérer vos revenus, charges, crédits et objectifs d\'épargne en toute simplicité.',
      buttons: {
        login: 'Se connecter',
        register: 'S\'inscrire',
      },
    },
    features: [
      {
        title: 'Revenus et dépenses',
        description: 'Suivez vos revenus et charges mensuelles avec des graphiques clairs et intuitifs',
      },
      {
        title: 'Suivi des crédits',
        description: 'Gérez vos crédits et visualisez leur impact sur votre budget mensuel',
      },
      {
        title: 'Objectifs d\'épargne',
        description: 'Définissez vos objectifs et suivez votre progression en temps réel',
      },
      {
        title: 'Vue d\'ensemble détaillée',
        description: 'Accédez à une répartition claire de vos dépenses par catégorie',
      },
    ],
    stats: {
      title: 'Une vue d\'ensemble claire et précise',
      description: 'Prenez les bonnes décisions financières grâce à des statistiques détaillées',
      items: [
        { label: 'Revenus moyens', value: '4500 €', trend: '+5%' },
        { label: 'Charges mensuelles', value: '850 €', trend: '-2%' },
        { label: 'Épargne mensuelle', value: '300 €', trend: '+10%' },
      ],
    },
    security: {
      title: 'Sécurité maximale',
      description: 'Vos données financières sont protégées avec les plus hauts standards de sécurité',
      button: 'Commencer gratuitement',
    },
  },
};
