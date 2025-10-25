export interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDeg: number;
  description: string;
  main: string;
  icon: string;
  timezone: number;
  sunrise: number;
  sunset: number;
  dt: number;
}

export interface ForecastData {
  dt: number;
  temp: number;
  tempMin: number;
  tempMax: number;
  description: string;
  main: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface CitySearchResult {
  name: string;
  country: string;
  lat: number;
  lon: number;
  state?: string;
}

export type WeatherCondition = 'clear' | 'clouds' | 'rain' | 'snow' | 'thunderstorm' | 'drizzle' | 'mist' | 'fog';

export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

export type TemperatureUnit = 'celsius' | 'fahrenheit';
