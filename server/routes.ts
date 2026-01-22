import type { Express } from "express";
import { createServer, type Server } from "http";

// City coordinates for weather lookup
const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
  // Oceania
  auckland: { lat: -36.8485, lon: 174.7633 },
  fiji: { lat: -18.1416, lon: 178.4419 },
  sydney: { lat: -33.8688, lon: 151.2093 },
  melbourne: { lat: -37.8136, lon: 144.9631 },
  brisbane: { lat: -27.4698, lon: 153.0251 },
  perth: { lat: -31.9505, lon: 115.8605 },
  
  // East Asia
  tokyo: { lat: 35.6762, lon: 139.6503 },
  osaka: { lat: 34.6937, lon: 135.5023 },
  seoul: { lat: 37.5665, lon: 126.978 },
  hongKong: { lat: 22.3193, lon: 114.1694 },
  taipei: { lat: 25.033, lon: 121.5654 },
  beijing: { lat: 39.9042, lon: 116.4074 },
  shanghai: { lat: 31.2304, lon: 121.4737 },
  
  // Southeast Asia
  singapore: { lat: 1.3521, lon: 103.8198 },
  kualaLumpur: { lat: 3.139, lon: 101.6869 },
  manila: { lat: 14.5995, lon: 120.9842 },
  bangkok: { lat: 13.7563, lon: 100.5018 },
  jakarta: { lat: -6.2088, lon: 106.8456 },
  hanoi: { lat: 21.0285, lon: 105.8542 },
  hoChiMinhCity: { lat: 10.8231, lon: 106.6297 },
  
  // South Asia
  dhaka: { lat: 23.8103, lon: 90.4125 },
  mumbai: { lat: 19.076, lon: 72.8777 },
  delhi: { lat: 28.6139, lon: 77.209 },
  bangalore: { lat: 12.9716, lon: 77.5946 },
  kolkata: { lat: 22.5726, lon: 88.3639 },
  karachi: { lat: 24.8607, lon: 67.0011 },
  
  // Middle East
  dubai: { lat: 25.2048, lon: 55.2708 },
  abuDhabi: { lat: 24.4539, lon: 54.3773 },
  riyadh: { lat: 24.7136, lon: 46.6753 },
  telaviv: { lat: 32.0853, lon: 34.7818 },
  
  // Eastern Europe / Russia
  moscow: { lat: 55.7558, lon: 37.6173 },
  istanbul: { lat: 41.0082, lon: 28.9784 },
  kyiv: { lat: 50.4501, lon: 30.5234 },
  bucharest: { lat: 44.4268, lon: 26.1025 },
  athens: { lat: 37.9838, lon: 23.7275 },
  helsinki: { lat: 60.1699, lon: 24.9384 },
  
  // Africa
  cairo: { lat: 30.0444, lon: 31.2357 },
  johannesburg: { lat: -26.2041, lon: 28.0473 },
  capeTown: { lat: -33.9249, lon: 18.4241 },
  nairobi: { lat: -1.2921, lon: 36.8219 },
  addisAbaba: { lat: 9.0254, lon: 38.7468 },
  lagos: { lat: 6.5244, lon: 3.3792 },
  casablanca: { lat: 33.5731, lon: -7.5898 },
  accra: { lat: 5.6037, lon: -0.187 },
  
  // Western / Central Europe
  berlin: { lat: 52.52, lon: 13.405 },
  paris: { lat: 48.8566, lon: 2.3522 },
  madrid: { lat: 40.4168, lon: -3.7038 },
  rome: { lat: 41.9028, lon: 12.4964 },
  amsterdam: { lat: 52.3676, lon: 4.9041 },
  brussels: { lat: 50.8503, lon: 4.3517 },
  vienna: { lat: 48.2082, lon: 16.3738 },
  warsaw: { lat: 52.2297, lon: 21.0122 },
  prague: { lat: 50.0755, lon: 14.4378 },
  stockholm: { lat: 59.3293, lon: 18.0686 },
  oslo: { lat: 59.9139, lon: 10.7522 },
  copenhagen: { lat: 55.6761, lon: 12.5683 },
  zurich: { lat: 47.3769, lon: 8.5417 },
  munich: { lat: 48.1351, lon: 11.582 },
  milan: { lat: 45.4642, lon: 9.19 },
  barcelona: { lat: 41.3851, lon: 2.1734 },
  
  // UK / Ireland / Portugal
  london: { lat: 51.5074, lon: -0.1278 },
  dublin: { lat: 53.3498, lon: -6.2603 },
  lisbon: { lat: 38.7223, lon: -9.1393 },
  
  // South America
  saoPaulo: { lat: -23.5505, lon: -46.6333 },
  buenosAires: { lat: -34.6037, lon: -58.3816 },
  rioDeJaneiro: { lat: -22.9068, lon: -43.1729 },
  santiago: { lat: -33.4489, lon: -70.6693 },
  bogota: { lat: 4.711, lon: -74.0721 },
  lima: { lat: -12.0464, lon: -77.0428 },
  caracas: { lat: 10.4806, lon: -66.9036 },
  
  // North America - East
  newYork: { lat: 40.7128, lon: -74.006 },
  toronto: { lat: 43.6532, lon: -79.3832 },
  miami: { lat: 25.7617, lon: -80.1918 },
  washington: { lat: 38.9072, lon: -77.0369 },
  boston: { lat: 42.3601, lon: -71.0589 },
  atlanta: { lat: 33.749, lon: -84.388 },
  
  // North America - Central
  chicago: { lat: 41.8781, lon: -87.6298 },
  houston: { lat: 29.7604, lon: -95.3698 },
  dallas: { lat: 32.7767, lon: -96.797 },
  mexicoCity: { lat: 19.4326, lon: -99.1332 },
  
  // North America - West
  denver: { lat: 39.7392, lon: -104.9903 },
  phoenix: { lat: 33.4484, lon: -112.074 },
  losAngeles: { lat: 34.0522, lon: -118.2437 },
  sanFrancisco: { lat: 37.7749, lon: -122.4194 },
  seattle: { lat: 47.6062, lon: -122.3321 },
  vancouver: { lat: 49.2827, lon: -123.1207 },
  
  // Pacific
  honolulu: { lat: 21.3069, lon: -157.8583 },
};

// Simple in-memory cache for weather data (10 minute TTL)
const weatherCache = new Map<string, { data: { celsius: number; fahrenheit: number }; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Weather API endpoint
  app.get("/api/weather", async (req, res) => {
    const city = req.query.city as string;
    
    if (!city || !CITY_COORDS[city]) {
      return res.status(400).json({ error: "Invalid city" });
    }

    // Check cache first
    const cached = weatherCache.get(city);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json(cached.data);
    }

    const coords = CITY_COORDS[city];

    try {
      // Using Open-Meteo API (free, no API key required)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m`
      );

      if (!response.ok) {
        throw new Error("Weather API error");
      }

      const data = await response.json();
      const tempCelsius = Math.round(data.current.temperature_2m);
      const tempFahrenheit = Math.round((tempCelsius * 9) / 5 + 32);

      const weatherData = {
        celsius: tempCelsius,
        fahrenheit: tempFahrenheit,
      };

      // Cache the result
      weatherCache.set(city, { data: weatherData, timestamp: Date.now() });

      return res.json(weatherData);
    } catch (error) {
      console.error("Weather fetch error:", error);
      return res.status(500).json({ error: "Failed to fetch weather" });
    }
  });

  return httpServer;
}
