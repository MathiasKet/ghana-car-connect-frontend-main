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
      setLoading(true);
      
      // Get current user
      const { user: authUser, profile } = await SupabaseService.getCurrentUser();
      
      if (!authUser || !profile) {
        navigate('/login', { state: { from: location.pathname } });
        return;
      }

      // Check if user has admin role
      if (profile.role !== 'admin') {
        navigate('/dashboard'); // Redirect to user dashboard
        return;
      }

      setUser({ authUser, profile });
      setIsAdmin(true);
      
    } catch (error) {
      console.error('Admin auth check failed:', error);
      navigate('/login', { state: { from: location.pathname } });
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
