import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { PartnerDashboard } from './PartnerDashboard';
import { InvestorDashboard } from './InvestorDashboard';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const { role } = useAuth();

  if (role === 'admin') {
    return <AdminDashboard />;
  }

  if (role === 'partner') {
    return <PartnerDashboard />;
  }

  return <InvestorDashboard />;
};
