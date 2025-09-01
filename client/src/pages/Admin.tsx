import { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminPlans from './AdminPlans';

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
        <Route path="plans" element={<AdminPlans />} />
      </Routes>
    </div>
  );
};

export default Admin;
