import { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminPlans from './AdminPlans';
import AdminAnalytics from './AdminAnalytics';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import AdminAds from './AdminAds';
import AdminManager from './AdminManager';
import AdminSettings from './AdminSettings';

const Admin = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not logged in, redirect to admin login
    if (!user) {
      navigate('/admin/login');
      return;
    }

    // If user is logged in but not an admin, redirect to admin login
    if (user && profile && profile.role !== 'admin' && profile.role !== 'super_admin') {
      navigate('/admin/login');
      return;
    }

    // If user is admin and on /admin, redirect to admin dashboard
    if (user && profile && (profile.role === 'admin' || profile.role === 'super_admin')) {
      const currentPath = window.location.pathname;
      if (currentPath === '/admin') {
        navigate('/admin/dashboard');
      }
    }
  }, [user, profile, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="plans" element={<AdminPlans />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="ads" element={<AdminAds />} />
        <Route path="admin-manager" element={<AdminManager />} />
        <Route path="settings" element={<AdminSettings />} />
      </Routes>
    </div>
  );
};

export default Admin;
