import { Heart, X } from 'lucide-react';

interface FavoritesListProps {
  favorites: string[];
  onSelectCity: (city: string) => void;
  onRemoveFavorite: (city: string) => void;
}

export function FavoritesList({ favorites, onSelectCity, onRemoveFavorite }: FavoritesListProps) {
  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <Heart className="text-red-500 fill-red-500" size={20} />
        <h3 className="text-lg font-semibold text-gray-700">Favorite Cities</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {favorites.map((city) => (
          <button
            key={city}
            onClick={() => onSelectCity(city)}
            className="group relative px-4 py-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-full transition-all duration-300 shadow-sm hover:shadow-md flex items-center space-x-2"
          >
            <span className="text-gray-700 font-medium">{city}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFavorite(city);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-100 rounded-full"
              aria-label={`Remove ${city} from favorites`}
            >
              <X size={14} className="text-red-500" />
            </button>
          </button>
        ))}
      </div>
    </div>
  );
}
