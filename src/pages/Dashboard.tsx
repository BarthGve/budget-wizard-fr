
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardHeader } from '@/components/dashboard/dashboard-header/DashboardHeader';
import { DashboardCards } from '@/components/dashboard/dashboard-content/DashboardCards';
import { DashboardCharts } from '@/components/dashboard/dashboard-content/DashboardCharts';
import { DashboardContributors } from '@/components/dashboard/dashboard-content/DashboardContributors';
import { DashboardBanners } from '@/components/dashboard/dashboard-banners/DashboardBanners';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader />
        <DashboardBanners />
        <DashboardCards />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCharts />
          <DashboardContributors />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
