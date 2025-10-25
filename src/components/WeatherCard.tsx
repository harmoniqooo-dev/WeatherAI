import { Cloud, Droplets, Wind, Gauge, Thermometer, Heart } from 'lucide-react';
import type { WeatherData, TemperatureUnit } from '../types/weather';
import { WeatherAnimation } from './WeatherAnimation';
import { getWeatherCondition, getTimeOfDay, getLocalTime, getLocalDate } from '../utils/weatherHelpers';
import { convertToFahrenheit, getWindDirection } from '../services/weatherService';

interface WeatherCardProps {
  weather: WeatherData;
  unit: TemperatureUnit;
  onToggleFavorite?: (city: string) => void;
  isFavorite?: boolean;
}

export function WeatherCard({ weather, unit, onToggleFavorite, isFavorite = false }: WeatherCardProps) {
  const condition = getWeatherCondition(weather.main);
  const timeOfDay = getTimeOfDay(weather.dt, weather.timezone, weather.sunrise, weather.sunset);

  const displayTemp = unit === 'celsius' ? weather.temp : convertToFahrenheit(weather.temp);
  const displayFeelsLike = unit === 'celsius' ? weather.feelsLike : convertToFahrenheit(weather.feelsLike);
  const displayTempMin = unit === 'celsius' ? weather.tempMin : convertToFahrenheit(weather.tempMin);
  const displayTempMax = unit === 'celsius' ? weather.tempMax : convertToFahrenheit(weather.tempMax);
  const unitSymbol = unit === 'celsius' ? '°C' : '°F';

  return (
    <div className="relative w-full max-w-2xl mx-auto overflow-hidden rounded-3xl shadow-2xl">
      <div className="absolute inset-0 w-full h-full">
        <WeatherAnimation condition={condition} timeOfDay={timeOfDay} />
      </div>

      <div className="relative z-10 p-8 md:p-12 backdrop-blur-sm bg-white/10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2">
              {weather.city}
            </h2>
            <p className="text-xl text-white/90 drop-shadow-md">
              {weather.country}
            </p>
          </div>
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(weather.city)}
              className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-md"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                size={24}
                className={isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}
              />
            </button>
          )}
        </div>

        <div className="mb-6">
          <p className="text-lg text-white/80 drop-shadow-md mb-1">
            {getLocalDate(weather.dt, weather.timezone)}
          </p>
          <p className="text-xl text-white/90 drop-shadow-md">
            {getLocalTime(weather.dt, weather.timezone)}
          </p>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-8xl md:text-9xl font-bold text-white drop-shadow-2xl">
              {displayTemp}{unitSymbol}
            </div>
            <p className="text-2xl text-white/90 capitalize drop-shadow-md mt-2">
              {weather.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-white/20 backdrop-blur-md rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <Thermometer className="text-white/90" size={24} />
            <div>
              <p className="text-sm text-white/70">Feels Like</p>
              <p className="text-lg font-semibold text-white">{displayFeelsLike}{unitSymbol}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Thermometer className="text-white/90" size={24} />
            <div>
              <p className="text-sm text-white/70">Min / Max</p>
              <p className="text-lg font-semibold text-white">
                {displayTempMin} / {displayTempMax}{unitSymbol}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Droplets className="text-white/90" size={24} />
            <div>
              <p className="text-sm text-white/70">Humidity</p>
              <p className="text-lg font-semibold text-white">{weather.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Wind className="text-white/90" size={24} />
            <div>
              <p className="text-sm text-white/70">Wind</p>
              <p className="text-lg font-semibold text-white">
                {weather.windSpeed} m/s {getWindDirection(weather.windDeg)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Gauge className="text-white/90" size={24} />
            <div>
              <p className="text-sm text-white/70">Pressure</p>
              <p className="text-lg font-semibold text-white">{weather.pressure} hPa</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Cloud className="text-white/90" size={24} />
            <div>
              <p className="text-sm text-white/70">Condition</p>
              <p className="text-lg font-semibold text-white capitalize">{weather.main}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
