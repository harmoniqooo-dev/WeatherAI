import { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import type { CitySearchResult } from '../types/weather';
import { searchCities } from '../services/weatherService';

interface CitySearchProps {
  onCitySelect: (city: string) => void;
  onUseLocation?: () => void;
}

export function CitySearch({ onCitySelect, onUseLocation }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        try {
          const cities = await searchCities(query);
          setResults(cities);
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [query]);

  const handleSelectCity = (city: CitySearchResult) => {
    onCitySelect(city.name);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Search className="text-gray-400" size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="w-full pl-12 pr-24 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300 shadow-lg"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          {query && (
            <button
              onClick={handleClearSearch}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Clear search"
            >
              <X className="text-gray-400" size={20} />
            </button>
          )}
          {onUseLocation && (
            <button
              onClick={onUseLocation}
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all duration-300 shadow-md"
              aria-label="Use current location"
            >
              <MapPin size={18} />
            </button>
          )}
        </div>
      </div>

      {showResults && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl overflow-hidden z-20 border border-gray-100">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" />
            </div>
          ) : results.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto">
              {results.map((city, index) => (
                <li key={`${city.name}-${city.country}-${index}`}>
                  <button
                    onClick={() => handleSelectCity(city)}
                    className="w-full px-6 py-4 text-left hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
                  >
                    <MapPin className="text-blue-500 flex-shrink-0" size={18} />
                    <div>
                      <div className="font-semibold text-gray-800">
                        {city.name}
                        {city.state && `, ${city.state}`}
                      </div>
                      <div className="text-sm text-gray-500">{city.country}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No cities found. Try a different search term.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
