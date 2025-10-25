import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'weather-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFavorites(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('Failed to parse favorites:', error);
        setFavorites([]);
      }
    }
  }, []);

  const addFavorite = (city: string) => {
    setFavorites((prev) => {
      if (prev.includes(city)) return prev;
      const updated = [...prev, city];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFavorite = (city: string) => {
    setFavorites((prev) => {
      const updated = prev.filter((fav) => fav !== city);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFavorite = (city: string) => {
    if (favorites.includes(city)) {
      removeFavorite(city);
    } else {
      addFavorite(city);
    }
  };

  const isFavorite = (city: string) => favorites.includes(city);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
}
