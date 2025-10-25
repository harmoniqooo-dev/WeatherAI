import { useEffect, useState } from 'react';
import type { WeatherCondition, TimeOfDay } from '../types/weather';
import './WeatherAnimations.css';

interface WeatherAnimationProps {
  condition: WeatherCondition;
  timeOfDay: TimeOfDay;
}

export function WeatherAnimation({ condition, timeOfDay }: WeatherAnimationProps) {
  const [raindrops, setRaindrops] = useState<Array<{ id: number; left: string; delay: string }>>([]);
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: string; delay: string; duration: string }>>([]);
  const [stars, setStars] = useState<Array<{ id: number; top: string; left: string; delay: string }>>([]);

  useEffect(() => {
    if (condition === 'rain' || condition === 'drizzle' || condition === 'thunderstorm') {
      const drops = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2}s`,
      }));
      setRaindrops(drops);
    }

    if (condition === 'snow') {
      const flakes = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 8}s`,
        duration: `${8 + Math.random() * 4}s`,
      }));
      setSnowflakes(flakes);
    }

    if (timeOfDay === 'night') {
      const starCount = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        top: `${Math.random() * 60}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
      }));
      setStars(starCount);
    }
  }, [condition, timeOfDay]);

  const getBackgroundClass = () => {
    if (condition === 'thunderstorm') return 'background-thunderstorm';
    if (condition === 'rain' || condition === 'drizzle') return 'background-rain';
    if (condition === 'snow') return 'background-snow';
    if (condition === 'mist' || condition === 'fog') return 'background-mist';
    if (condition === 'clouds') {
      return timeOfDay === 'night' ? 'background-clouds-night' : 'background-clouds-day';
    }
    return timeOfDay === 'night' ? 'background-clear-night' : 'background-clear-day';
  };

  return (
    <div className={`weather-container ${getBackgroundClass()}`}>
      {timeOfDay === 'night' && (
        <>
          <div className="stars">
            {stars.map((star) => (
              <div
                key={star.id}
                className="star"
                style={{
                  top: star.top,
                  left: star.left,
                  animationDelay: star.delay,
                }}
              />
            ))}
          </div>
          <div className="moon" />
        </>
      )}

      {condition === 'clear' && timeOfDay !== 'night' && (
        <>
          <div className="sun">
            <div className="sun-ray" />
          </div>
        </>
      )}

      {(condition === 'clouds' || (condition === 'clear' && timeOfDay === 'day')) && (
        <>
          <div className="cloud cloud-1" />
          <div className="cloud cloud-2" />
        </>
      )}

      {(condition === 'rain' || condition === 'drizzle') && (
        <>
          <div className="cloud cloud-1" style={{ opacity: 0.8 }} />
          <div className="cloud cloud-2" style={{ opacity: 0.8 }} />
          <div className="rain-container">
            {raindrops.map((drop) => (
              <div
                key={drop.id}
                className="raindrop"
                style={{
                  left: drop.left,
                  animationDelay: drop.delay,
                }}
              />
            ))}
          </div>
        </>
      )}

      {condition === 'thunderstorm' && (
        <>
          <div className="cloud cloud-1" style={{ opacity: 0.9 }} />
          <div className="cloud cloud-2" style={{ opacity: 0.9 }} />
          <div className="rain-container">
            {raindrops.map((drop) => (
              <div
                key={drop.id}
                className="raindrop"
                style={{
                  left: drop.left,
                  animationDelay: drop.delay,
                }}
              />
            ))}
          </div>
          <div className="lightning-container">
            <div className="lightning" />
          </div>
        </>
      )}

      {condition === 'snow' && (
        <>
          <div className="cloud cloud-1" style={{ opacity: 0.7 }} />
          <div className="cloud cloud-2" style={{ opacity: 0.7 }} />
          <div className="snow-container">
            {snowflakes.map((flake) => (
              <div
                key={flake.id}
                className="snowflake"
                style={{
                  left: flake.left,
                  animationDelay: flake.delay,
                  animationDuration: flake.duration,
                }}
              />
            ))}
          </div>
        </>
      )}

      {(condition === 'mist' || condition === 'fog') && (
        <>
          <div className="mist" />
          <div className="cloud cloud-1" style={{ opacity: 0.5 }} />
          <div className="cloud cloud-2" style={{ opacity: 0.5 }} />
        </>
      )}
    </div>
  );
}
