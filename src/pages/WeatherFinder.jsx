import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Gauge,
  Moon,
} from "lucide-react";
import Hero from "../components/Hero";

const WeatherDisplay = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState(null);

  // Open-Meteo weather code mapping
  const weatherCodes = {
    0: "Clear",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "cloud",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "snow",
    80: "Rain showers",
    81: "Moderate showers",
    82: "Violent showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Thunderstorm with heavy hail",
  };

  const fetchWeather = async () => {
    if (!location) return;
    setLoading(true);
    try {
      // Step 1: Geocoding via Nominatim
      const geoRes = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
      );
      if (!geoRes.data.length) {
        throw new Error("City not found");
      }
      const lat = geoRes.data[0].lat;
      const lon = geoRes.data[0].lon;

      // Step 2: Current weather
      const res = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,pressure_msl,weathercode`
      );
      

      setWeather({
        name: location,
        main: {
          temp: res.data.current_weather.temperature,
          feels_like: res.data.current_weather.temperature,
          pressure: res.data.hourly.pressure_msl[0],
          humidity: res.data.hourly.relative_humidity_2m[0],
        },
        wind: { speed: res.data.current_weather.windspeed },
        weather: [
          {
            main: weatherCodes[res.data.current_weather.weathercode] || "Unknown",
            description:
              weatherCodes[res.data.current_weather.weathercode] || "Unknown",
          },
        ],
      });

      // Step 3: Forecast (next 5 entries = next 5 hours approx)
      setForecast(
        res.data.hourly.time.slice(0, 5).map((t, i) => ({
          dt_txt: t,
          main: { temp: res.data.hourly.temperature_2m[i] },
          weather: [
            {
              description:
                weatherCodes[res.data.hourly.weathercode[i]] || "Unknown",
            },
          ],
        }))
      );

      setQuote(getQuote(res.data.current_weather, res.data.hourly));
    } catch (error) {
      console.error(error);
      setWeather(null);
      setForecast(null);
      setQuote("Couldn't fetch weather... maybe the clouds ate the signal!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line
  }, []);

  const getWeatherIcon = () => {
    if (!weather) return <Cloud className="w-28 h-28 text-white/70" />;
    const main = weather.weather[0].main.toLowerCase();
    if (main.includes("cloud"))
      return <Cloud className="w-28 h-28 text-gray-300" />;
    if (main.includes("rain"))
      return <CloudRain className="w-28 h-28 text-blue-400" />;
    if (main.includes("clear"))
      return <Sun className="w-28 h-28 text-yellow-400" />;
    if (main.includes("night"))
      return <Moon className="w-28 h-28 text-indigo-400" />;
    return <Cloud className="w-28 h-28 text-white/70" />;
  };

  const gradientMap = {
    clear: "linear-gradient(to bottom right, #facc15, #f97316, #dc2626)",
    clouds: "linear-gradient(to bottom right, #6b7280, #111827, #000000)",
    rain: "linear-gradient(to bottom right, #1e40af, #1e3a8a, #000000)",
    fog: "linear-gradient(to bottom right, #e0f2fe, #ffffff, #bae6fd)",
    thunderstorm: "linear-gradient(to bottom right, #312e81, #4c1d95, #000000)",
    default: "linear-gradient(to bottom right, #111827, #1f2937, #000000)",
  };

  const bgStyle = {
    backgroundImage:
      gradientMap[weather ? weather.weather[0].main.toLowerCase() : "default"] ||
      gradientMap.default,
  };

  const getQuote = (current, hourly) => {
    if (!current) return "Loading vibes... 🌍";
    const temp = current.temperature.toFixed(1);
    const humidity = hourly.relative_humidity_2m[0];
    const main =
      weatherCodes[current.weathercode]?.toLowerCase() || "weather vibes";

    const rainyQuotes = [
      `☔ It's raining here with ${humidity}% humidity. Perfect time for chai & Ilaiyaraaja 🎶.`,
      "🌧️ Rainy mood today. Stay cozy, watch a movie, and let the rain do its ASMR job 📺.",
      "💦 It's wet out there! Great excuse to skip gym and call it “weather cardio” 😂.",
    ];
    const cloudyQuotes = [
      `☁️ Cloudy skies around ${temp}°C. Pretend you're in a Tamil love scene 🌸.`,
      "🌥️ Clouds everywhere. Go gossip with friends while sipping coffee ☕.",
      "😅 Cloudy mood = perfect time to take selfies with “moody filter”.",
    ];
    const clearQuotes = [
      `☀️ Clear skies at ${temp}°C. Hero entry mode: sunglasses ON 🕶️.`,
      "🌞 Sunny day! Perfect for laundry (your mom will approve 😏).",
      `🔥 ${temp}°C outside, don’t melt! Hydrate like it's your full-time job 💧.`,
    ];
    const thunderQuotes = [
      "⚡ Thunder outside! Nature’s rock concert for free 🤘.",
      "🌩️ Stormy vibes. Stay indoors & pretend you’re in a horror movie 🎬.",
      "💡 Thunderstorms are here. Good luck if you thought of charging your phone now 😂.",
    ];
    const snowQuotes = [
      `❄️ Snow time! ${temp}°C. Build a snowman or complain loudly, both valid ⛄.`,
      "🌨️ White everywhere. Insta reels incoming 🎥.",
      "🥶 Freezing? Perfect time for hot chocolate and blanket burrito mode 🍫.",
    ];

    if (main.includes("rain")) return rainyQuotes[Math.floor(Math.random() * rainyQuotes.length)];
    if (main.includes("cloud")) return cloudyQuotes[Math.floor(Math.random() * cloudyQuotes.length)];
    if (main.includes("clear")) return clearQuotes[Math.floor(Math.random() * clearQuotes.length)];
    if (main.includes("thunder")) return thunderQuotes[Math.floor(Math.random() * thunderQuotes.length)];
    if (main.includes("snow")) return snowQuotes[Math.floor(Math.random() * snowQuotes.length)];

    return `🌍 Weather looks like ${main} with ${temp}°C. Just roll with it! 😎.`;
  };

  const predictWeather = () => {
    if (!forecast) return "";
    const rainy = forecast.some((f) =>
      f.weather[0].description.toLowerCase().includes("rain")
    );
    if (rainy) return "Looks like it might rain for the next few hours 🌧️. Keep an umbrella handy!";
    const clear = forecast.some((f) =>
      f.weather[0].description.toLowerCase().includes("clear")
    );
    if (clear) return "The skies may clear up in the next few hours ☀️.";
    return "The weather is unpredictable! Stay ready for anything.";
  };

  return (
    <motion.div
      key={weather ? weather.weather[0].main : "default"}
      style={bgStyle}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="md:flex min-h-screen text-white transition-all duration-1000"
    >
      {/* Left Main Weather Panel */}
      <div className="flex-1 flex flex-col items-center justify-start px-10 ">
        <Hero />
        {/* Search Input */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-10 w-full max-w-md"
        >
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
            placeholder="Search city..."
            className="w-full bg-transparent border-b-2 border-white/40 text-2xl placeholder-gray-300 focus:outline-none focus:border-cyan-400 transition-all "
          />
        </motion.div>
        {loading && <p className="text-gray-300 text-2xl my-4">Fetching weather...</p>}

        {/* Weather Info */}
        {!weather ? (
          <p className="text-cyan-300 text-2xl">
            The sky has stories - just search to hear them.
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center gap-6"
          >
            {getWeatherIcon()}
            <h1 className="text-6xl font-extrabold tracking-wide drop-shadow-lg">
              {weather.main.temp.toFixed(1)}°C
            </h1>
            <h2 className="text-4xl font-bold">{weather.name}</h2>
            <p className="text-2xl text-gray-200 capitalize">
              {weather.weather[0].description}
            </p>
          </motion.div>
        )}
      </div>

      {/* Right Side Details Panel */}
      {weather && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="md:w-[40%] bg-black/30 backdrop-blur-xl p-10 flex flex-col gap-6 border-l border-white/10"
        >
          <h3 className="text-2xl font-semibold mb-4 text-cyan-300">Details</h3>
          <div className="grid grid-cols-2 gap-6 text-lg">
            <div className="flex items-center gap-3 hover:text-cyan-400 transition">
              <Droplets className="w-6 h-6" />
              <span>Humidity: {weather.main.humidity}%</span>
            </div>
            <div className="flex items-center gap-3 hover:text-cyan-400 transition">
              <Wind className="w-6 h-6" />
              <span>Wind: {weather.wind.speed} km/h</span>
            </div>
            <div className="flex items-center gap-3 hover:text-cyan-400 transition">
              <Gauge className="w-6 h-6" />
              <span>Pressure: {weather.main.pressure} hPa</span>
            </div>
            <div className="flex items-center gap-3 hover:text-cyan-400 transition">
              <Sun className="w-6 h-6" />
              <span>Feels Like: {weather.main.feels_like.toFixed(1)}°C</span>
            </div>
          </div>

          {/* Interactive Space */}
          <div className="mt-10 p-6 bg-white/5 rounded-xl border border-white/10 hover:scale-[1.02] transition">
            <h4 className="text-xl mb-4 text-cyan-300">What you can do</h4>
            {quote && (
              <motion.p
                key={quote}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-gray-200 leading-relaxed"
              >
                {quote}
              </motion.p>
            )}
            {forecast && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h2 className="text-lg text-left font-semibold text-cyan-300 my-2">
                  Take a look at the future!
                </h2>
                <p className="text-md">{predictWeather()}</p>
              </motion.div>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-4">Upcoming Forecast</h2>
          {forecast ? (
            <div className="space-y-4">
              {forecast.map((f, i) => (
                <motion.div
                  key={i}
                  className="flex justify-between items-center p-4 rounded-xl bg-white/5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="text-gray-300">
                    {new Date(f.dt_txt).toLocaleString()}
                  </span>
                  <span className="text-lg">{f.main.temp.toFixed(1)}°C</span>
                  <span className="capitalize">{f.weather[0].description}</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p>No forecast data yet...</p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default WeatherDisplay;
