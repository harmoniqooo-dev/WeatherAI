import type { WeatherData, ForecastData, CitySearchResult } from '../types/weather';

const API_KEY = '9ca5f9f01c88e97f74a17c7f54086c9e';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

const CACHE_DURATION = 30 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();

function getCachedData<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export async function getCurrentWeather(city: string): Promise<WeatherData> {
  const cacheKey = `weather:${city.toLowerCase()}`;
  const cached = getCachedData<WeatherData>(cacheKey);

  if (cached) {
    return cached;
  }

  const response = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error('City not found');
  }

  const data = await response.json();

  const weatherData: WeatherData = {
    city: data.name,
    country: data.sys.country,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    tempMin: Math.round(data.main.temp_min),
    tempMax: Math.round(data.main.temp_max),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: data.wind.speed,
    windDeg: data.wind.deg,
    description: data.weather[0].description,
    main: data.weather[0].main.toLowerCase(),
    icon: data.weather[0].icon,
    timezone: data.timezone,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    dt: data.dt,
  };

  setCachedData(cacheKey, weatherData);
  return weatherData;
}

export async function searchCities(query: string): Promise<CitySearchResult[]> {
  if (query.length < 2) return [];

  const cacheKey = `cities:${query.toLowerCase()}`;
  const cached = getCachedData<CitySearchResult[]>(cacheKey);

  if (cached) {
    return cached;
  }

  const response = await fetch(
    `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to search cities');
  }

  const data = await response.json();

  const cities: CitySearchResult[] = data.map((item: any) => ({
    name: item.name,
    country: item.country,
    lat: item.lat,
    lon: item.lon,
    state: item.state,
  }));

  setCachedData(cacheKey, cities);
  return cities;
}

export async function getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  const cacheKey = `weather:${lat},${lon}`;
  const cached = getCachedData<WeatherData>(cacheKey);

  if (cached) {
    return cached;
  }

  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();

  const weatherData: WeatherData = {
    city: data.name,
    country: data.sys.country,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    tempMin: Math.round(data.main.temp_min),
    tempMax: Math.round(data.main.temp_max),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: data.wind.speed,
    windDeg: data.wind.deg,
    description: data.weather[0].description,
    main: data.weather[0].main.toLowerCase(),
    icon: data.weather[0].icon,
    timezone: data.timezone,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    dt: data.dt,
  };

  setCachedData(cacheKey, weatherData);
  return weatherData;
}

export function convertToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}
