import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

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
      const response = await fetch(`/api/favorites/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (planId: string) => {
    if (!user?.id) return false;
    
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          planId: planId
        })
      });

      if (response.ok) {
        await fetchFavorites(); // Refresh favorites list
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding favorite:', error);
      return false;
    }
  };

  const removeFavorite = async (planId: string) => {
    if (!user?.id) return false;
    
    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          planId: planId
        })
      });

      if (response.ok) {
        await fetchFavorites(); // Refresh favorites list
        return true;
      }
      return false;
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
