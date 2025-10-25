import { useState, useEffect } from 'react';
import { Cloud, Sun } from 'lucide-react';
import { CitySearch } from './components/CitySearch';
import { WeatherCard } from './components/WeatherCard';
import { FavoritesList } from './components/FavoritesList';
import { useFavorites } from './hooks/useFavorites';
import { getCurrentWeather, getWeatherByCoords } from './services/weatherService';
import type { WeatherData, TemperatureUnit } from './types/weather';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { favorites, toggleFavorite, isFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    loadDefaultCity();
  }, []);

  const loadDefaultCity = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCurrentWeather('Tokyo');
      setWeather(data);
    } catch (err) {
      setError('Failed to load default city weather');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySelect = async (city: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCurrentWeather(city);
      setWeather(data);
    } catch (err) {
      setError('City not found. Please try another search.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await getWeatherByCoords(
            position.coords.latitude,
            position.coords.longitude
          );
          setWeather(data);
        } catch (err) {
          setError('Failed to fetch weather for your location');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setError('Unable to retrieve your location');
        setIsLoading(false);
      }
    );
  };

  const toggleUnit = () => {
    setUnit((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Sun className="text-yellow-500" size={40} />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Weather AI
            </h1>
            <Cloud className="text-blue-500" size={40} />
          </div>
          <p className="text-xl text-gray-600">
            Beautiful weather visualizations powered by animations
          </p>
        </header>

        <div className="mb-8">
          <CitySearch onCitySelect={handleCitySelect} onUseLocation={handleUseLocation} />
        </div>

        {favorites.length > 0 && (
          <FavoritesList
            favorites={favorites}
            onSelectCity={handleCitySelect}
            onRemoveFavorite={removeFavorite}
          />
        )}

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-center">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Loading weather data...</p>
            </div>
          </div>
        )}

        {!isLoading && weather && (
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <button
                onClick={toggleUnit}
                className="px-6 py-3 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
              >
                <span className={unit === 'celsius' ? 'text-blue-600' : 'text-gray-400'}>
                  °C
                </span>
                <span className="text-gray-400">|</span>
                <span className={unit === 'fahrenheit' ? 'text-blue-600' : 'text-gray-400'}>
                  °F
                </span>
              </button>
            </div>
            <WeatherCard
              weather={weather}
              unit={unit}
              onToggleFavorite={toggleFavorite}
              isFavorite={isFavorite(weather.city)}
            />
          </div>
        )}

        <footer className="text-center mt-16 pb-8">
          <p className="text-gray-500 text-sm">
            Weather data provided by OpenWeatherMap
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Data updates every 30 minutes
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
