import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SupabaseService from '@/services/supabaseService';

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      console.log('useAdminAuth: Starting checkAdminAuth...');
      setLoading(true);

      // Get current user
      const { user: authUser, profile } = await SupabaseService.getCurrentUser();
      console.log('useAdminAuth: User fetched:', authUser?.email, 'Role from DB:', profile?.role);

      if (!authUser || !profile) {
        console.warn('useAdminAuth: No user or profile found, redirecting to admin login');
        navigate('/admin/login', { state: { from: location.pathname } });
        return;
      }

      // Check if user has admin role
      if (profile.role !== 'admin') {
        console.error('useAdminAuth: Unauthorized access attempt. Role:', profile.role);
        navigate('/dashboard'); // Redirect to user dashboard
        return;
      }

      console.log('useAdminAuth: Admin verification successful');
      setUser({ authUser, profile });
      setIsAdmin(true);

    } catch (error) {
      console.error('Admin auth check failed:', error);
      navigate('/admin/login', { state: { from: location.pathname } });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await SupabaseService.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    loading,
    isAdmin,
    user,
    logout,
    refreshAuth: checkAdminAuth
  };
};
