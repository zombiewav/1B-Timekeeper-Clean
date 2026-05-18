import { useEffect, useState } from 'react';
import { CloudSun, MapPin, RefreshCw, Wind, Droplets, Thermometer } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { APP_NAME, APP_ORGANIZATION, appTheme } from '../theme';

type WeatherResponse = {
  current?: {
    temperature_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily?: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
};

type ReverseGeocodeResponse = {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  countryName?: string;
};

type Coords = {
  latitude: number;
  longitude: number;
};

const WEATHER_LABELS: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

function formatCoordsLabel(coords: Coords) {
  return `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
}

function formatLocationLabel(location: ReverseGeocodeResponse | null, coords: Coords | null) {
  if (location) {
    const parts = [location.city ?? location.locality, location.principalSubdivision].filter(Boolean);
    if (parts.length > 0) {
      return parts.join(', ');
    }

    if (location.countryName) {
      return location.countryName;
    }
  }

  if (coords) {
    return formatCoordsLabel(coords);
  }

  return 'Your area';
}

async function fetchWeather(coords: Coords): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: String(coords.latitude),
    longitude: String(coords.longitude),
    current: [
      'temperature_2m',
      'apparent_temperature',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
    ].join(','),
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: '1',
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Unable to load weather right now.');
  }

  return response.json();
}

async function fetchLocationLabel(coords: Coords): Promise<ReverseGeocodeResponse | null> {
  const params = new URLSearchParams({
    latitude: String(coords.latitude),
    longitude: String(coords.longitude),
    localityLanguage: 'en',
  });

  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?${params.toString()}`,
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

function getCurrentPosition(): Promise<Coords> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported on this device.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      () => reject(new Error('Location access was denied. Please allow it to see your weather.')),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  });
}

export function WeatherPage() {
  const { isDark } = useApp();
  const colors = isDark ? appTheme.dark : appTheme.light;
  const [coords, setCoords] = useState<Coords | null>(null);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [locationLabel, setLocationLabel] = useState('Waiting for location');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const nextCoords = await getCurrentPosition();
        if (cancelled) return;
        setCoords(nextCoords);
        setLocationLabel(formatCoordsLabel(nextCoords));

        const [weatherResult, locationResult] = await Promise.all([
          fetchWeather(nextCoords),
          fetchLocationLabel(nextCoords),
        ]);

        if (cancelled) return;
        setWeather(weatherResult);
        setLocationLabel(formatLocationLabel(locationResult, nextCoords));
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : 'Unable to load weather.';
        setError(message);
        setWeather(null);
        setLocationLabel('Location unavailable');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [refreshToken]);

  const current = weather?.current;
  const daily = weather?.daily;
  const condition = current ? WEATHER_LABELS[current.weather_code] ?? 'Unknown conditions' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-xl mx-auto"
    >
      <div
        className="rounded-[2rem] overflow-hidden shadow-2xl"
        style={{
          border: `2px solid ${colors.brandAccent}`,
          boxShadow: colors.cardShadow,
          backgroundColor: colors.surfaceBackground,
        }}
      >
        <div
          className="px-6 py-6 sm:px-8 sm:py-8"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(31,58,95,0.95), rgba(15,32,80,0.98))'
              : 'linear-gradient(135deg, rgba(134,168,207,0.95), rgba(195,142,180,0.92))',
          }}
        >
          <p
            className="text-[10px] uppercase tracking-[0.22em] mb-3"
            style={{ color: 'rgba(255,255,255,0.78)' }}
          >
            {APP_ORGANIZATION}
          </p>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-white text-2xl sm:text-3xl font-bold leading-tight">{APP_NAME} Weather</h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Live forecast based on the user&apos;s location
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.24)',
                color: '#fff',
              }}
            >
              <CloudSun size={24} />
            </div>
          </div>
        </div>

        <div className="px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2" style={{ color: colors.mutedText }}>
              <MapPin size={15} />
              <span className="text-sm font-medium">{locationLabel}</span>
            </div>

            <button
              onClick={() => setRefreshToken((value) => value + 1)}
              className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
              style={{
                backgroundColor: colors.bubbleBackground,
                color: colors.text,
                border: `1px solid ${colors.border}`,
              }}
            >
              <RefreshCw size={13} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div
              className="rounded-[1.75rem] px-5 py-12 text-center"
              style={{
                backgroundColor: colors.cardBackground,
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
            >
              Loading local weather...
            </div>
          ) : error ? (
            <div
              className="rounded-[1.75rem] px-5 py-10 text-center"
              style={{
                backgroundColor: colors.cardBackground,
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
            >
              <p className="font-semibold mb-2">{error}</p>
              <p className="text-sm" style={{ color: colors.faintText }}>
                Turn on location access and try again.
              </p>
            </div>
          ) : current && daily ? (
            <>
              <div
                className="rounded-[1.75rem] px-5 py-6 sm:px-7 sm:py-8 text-center"
                style={{
                  backgroundColor: colors.cardBackground,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: colors.faintText }}>
                  {condition}
                </p>
                <p
                  className="font-bold leading-none mt-3"
                  style={{
                    color: colors.text,
                    fontSize: 'clamp(2.8rem, 14vw, 5.2rem)',
                  }}
                >
                  {Math.round(current.temperature_2m)}°
                </p>
                <p className="mt-2 text-sm" style={{ color: colors.mutedText }}>
                  Feels like {Math.round(current.apparent_temperature)}°
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <StatCard
                  icon={<Thermometer size={16} />}
                  label="Today"
                  value={`${Math.round(daily.temperature_2m_max[0])}° / ${Math.round(daily.temperature_2m_min[0])}°`}
                  colors={colors}
                />
                <StatCard
                  icon={<Wind size={16} />}
                  label="Wind"
                  value={`${Math.round(current.wind_speed_10m)} km/h`}
                  colors={colors}
                />
                <StatCard
                  icon={<Droplets size={16} />}
                  label="Rain"
                  value={`${Math.round(current.precipitation)} mm`}
                  colors={colors}
                />
                <StatCard
                  icon={<CloudSun size={16} />}
                  label="Rain Chance"
                  value={`${daily.precipitation_probability_max[0] ?? 0}%`}
                  colors={colors}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({
  icon,
  label,
  value,
  colors,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  colors: (typeof appTheme)['light'];
}) {
  return (
    <div
      className="rounded-2xl px-4 py-4"
      style={{
        backgroundColor: colors.bubbleBackground,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className="flex items-center gap-2 mb-2" style={{ color: colors.mutedText }}>
        {icon}
        <p className="text-[10px] uppercase tracking-[0.18em]">{label}</p>
      </div>
      <p className="text-sm font-semibold" style={{ color: colors.text }}>
        {value}
      </p>
    </div>
  );
}
