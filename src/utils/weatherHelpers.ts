import type { WeatherCondition, TimeOfDay } from '../types/weather';

export function getWeatherCondition(main: string): WeatherCondition {
  const normalized = main.toLowerCase();

  if (normalized === 'clear') return 'clear';
  if (normalized === 'clouds') return 'clouds';
  if (normalized === 'rain') return 'rain';
  if (normalized === 'snow') return 'snow';
  if (normalized === 'thunderstorm') return 'thunderstorm';
  if (normalized === 'drizzle') return 'drizzle';
  if (normalized === 'mist' || normalized === 'smoke' || normalized === 'haze' ||
      normalized === 'dust' || normalized === 'sand' || normalized === 'ash') return 'mist';
  if (normalized === 'fog') return 'fog';

  return 'clear';
}

export function getTimeOfDay(timestamp: number, timezone: number, sunrise: number, sunset: number): TimeOfDay {
  const localTime = timestamp + timezone;
  const localHour = new Date(localTime * 1000).getUTCHours();
  const sunriseHour = new Date((sunrise + timezone) * 1000).getUTCHours();
  const sunsetHour = new Date((sunset + timezone) * 1000).getUTCHours();

  if (localHour >= sunriseHour - 1 && localHour < sunriseHour + 2) {
    return 'morning';
  } else if (localHour >= sunriseHour + 2 && localHour < sunsetHour - 2) {
    return 'day';
  } else if (localHour >= sunsetHour - 2 && localHour < sunsetHour + 1) {
    return 'evening';
  } else {
    return 'night';
  }
}

export function getLocalTime(timestamp: number, timezone: number): string {
  const localTime = new Date((timestamp + timezone) * 1000);
  return localTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });
}

export function getLocalDate(timestamp: number, timezone: number): string {
  const localTime = new Date((timestamp + timezone) * 1000);
  return localTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
