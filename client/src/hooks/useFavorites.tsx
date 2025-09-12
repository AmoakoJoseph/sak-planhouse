import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { api } from '@/lib/api';

interface Favorite {
  id: string;
  user_id: string;
  plan_id: string;
  created_at: string;
  plan?: any;
}

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const data = await api.get(`favorites/${user.id}`);
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (planId: string) => {
    if (!user?.id) return false;
    
    try {
      await api.post('favorites', { userId: user.id, planId });
      await fetchFavorites();
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      return false;
    }
  };

  const removeFavorite = async (planId: string) => {
    if (!user?.id) return false;
    
    try {
      await api.delete('favorites', { userId: user.id, planId });
      await fetchFavorites();
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  };

  const isFavorite = (planId: string) => {
    return favorites.some(fav => fav.plan_id === planId);
  };

  const toggleFavorite = async (planId: string) => {
    if (isFavorite(planId)) {
      return await removeFavorite(planId);
    } else {
      return await addFavorite(planId);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchFavorites();
    }
  }, [user?.id]);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    fetchFavorites
  };
};
