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
import Hero from "./components/Hero";


const WeatherDisplay = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState(null);
    const [error, setError] = useState(null);

  const apiKey = "a757c39e8e217005febda17e34f4f716";

  const fetchWeather = async () => {
     if (!location) return;
    setLoading(true);
    try {
    
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`
      );
      setWeather(response.data);
       setQuote(getQuote(response.data));
         setError(null); 
  

      // Fetch forecast as well
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}`
      );
      setForecast(forecastRes.data);
      
    } catch (error) {
       if (error.response && error.response.status === 404) {
    setError("City not found. Please try again.");
  } else {
    setError("Something went wrong. Please try later.");
  }
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
    snow: "linear-gradient(to bottom right, #e0f2fe, #ffffff, #bae6fd)",
    night: "linear-gradient(to bottom right, #312e81, #4c1d95, #000000)",
    default: "linear-gradient(to bottom right, #111827, #1f2937, #000000)",
  };

  const bgStyle = {
    backgroundImage:
      gradientMap[weather ? weather.weather[0].main.toLowerCase() : "default"] ||
      gradientMap.default,
  };

  const getQuote = (weatherData) => {
  if (!weatherData) return "Loading vibes... 🌍";

  const main = weatherData.weather[0].main.toLowerCase();
  const temp = (weatherData.main.temp - 273.15).toFixed(1);
  const humidity = weatherData.main.humidity;

  const rainyQuotes = [
    `☔ It's raining here with ${humidity}% humidity. Perfect time for chai & Ilaiyaraaja 🎶.`,
    `🌧️ Rainy mood today. Stay cozy, watch a movie, and let the rain do its ASMR job 📺.`,
    `💦 It's wet out there! Great excuse to skip gym and call it “weather cardio” 😂.`,
  ];

  const cloudyQuotes = [
    `☁️ Cloudy skies around ${temp}°C. Pretend you're in a Tamil love scene 🌸.`,
    `🌥️ Clouds everywhere. Go gossip with friends while sipping coffee ☕.`,
    `😅 Cloudy mood = perfect time to take selfies with “moody filter”.`,
  ];

  const clearQuotes = [
    `☀️ Clear skies at ${temp}°C. Hero entry mode: sunglasses ON 🕶️.`,
    `🌞 Sunny day! Perfect for laundry (your mom will approve 😏).`,
    `🔥 ${temp}°C outside, don’t melt! Hydrate like it's your full-time job 💧.`,
  ];

  const thunderQuotes = [
    `⚡ Thunder outside! Nature’s rock concert for free 🤘.`,
    `🌩️ Stormy vibes. Stay indoors & pretend you’re in a horror movie 🎬.`,
    `💡 Thunderstorms are here. Good luck if you thought of charging your phone now 😂.`,
  ];

  const snowQuotes = [
    `❄️ Snow time! ${temp}°C. Build a snowman or complain loudly, both valid ⛄.`,
    `🌨️ White everywhere. Insta reels incoming 🎥.`,
    `🥶 Freezing? Perfect time for hot chocolate and blanket burrito mode 🍫.`,
  ];

  const nightQuotes = [
    `🌙 Cool night at ${temp}°C. Ideal for long drives with retro songs 🎶.`,
    `🌌 Night sky looks great. Go stargazing if your WiFi is slow 🌠.`,
    `🍿 Chill night = binge-watch excuse unlocked!`,
  ];

  let selectedQuotes;

  if (main.includes("rain")) selectedQuotes = rainyQuotes;
  else if (main.includes("cloud")) selectedQuotes = cloudyQuotes;
  else if (main.includes("clear")) selectedQuotes = clearQuotes;
  else if (main.includes("thunder")) selectedQuotes = thunderQuotes;
  else if (main.includes("snow")) selectedQuotes = snowQuotes;
  else if (main.includes("night")) selectedQuotes = nightQuotes;
  else
    selectedQuotes = [
      `🌍 Weather looks like ${weatherData.weather[0].description} with ${temp}°C. Just roll with it! 😎.`,
    ];

  return selectedQuotes[Math.floor(Math.random() * selectedQuotes.length)];
};


   const predictWeather = () => {
    if (!forecast) return "";
    const nextFewHours = forecast.list.slice(0, 4); // next 12 hours
    const rainy = nextFewHours.some((f) => f.weather[0].main.toLowerCase().includes("rain"));
    if (rainy) return "Looks like it might rain for the next few hours. Keep an umbrella handy!";
    const clear = nextFewHours.some((f) => f.weather[0].main.toLowerCase().includes("clear"));
    if (clear) return "The skies may clear up in the next few hours.";
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
      className={`md:flex min-h-screen text-white transition-all duration-1000 `}
    >
      
      {/* Left Main Weather Panel */}
      <div className="flex-1 flex flex-col items-center justify-start  px-10 ">
        {/* Search Input */}
          <Hero/>
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
            className="w-full bg-transparent border-b-2 border-white/40 text-2xl 
                       placeholder-gray-300 focus:outline-none focus:border-cyan-400 
                       transition-all "
          />
        </motion.div>
        {error && <p className="text-red-500 my-2">{error}</p>}
        

        {/* Weather Info */}
        {!weather ? (
          <p className="text-cyan-300 text-2xl">The sky has stories - just search to hear them.”</p>
        ) : weather ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center gap-6"
          >
            {getWeatherIcon()}
            <h1 className="text-6xl font-extrabold tracking-wide drop-shadow-lg">
              {(weather.main.temp - 273.15).toFixed(1)}°C
            </h1>
            <h2 className="text-4xl font-bold">{weather.name}</h2>
            <p className="text-2xl text-gray-200 capitalize">
              {weather.weather[0].description}
            </p>
          </motion.div>
        ) : (
          <p className="text-red-400 text-xl">City not found.</p>
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
        {weather && (
          <div className="grid grid-cols-2 gap-6 text-lg">
            <div className="flex items-center gap-3 hover:text-cyan-400 transition">
              <Droplets className="w-6 h-6" />
              <span>Humidity: {weather.main.humidity}%</span>
            </div>
            <div className="flex items-center gap-3 hover:text-cyan-400 transition">
              <Wind className="w-6 h-6" />
              <span>Wind: {weather.wind.speed} m/s</span>
            </div>
            <div className="flex items-center gap-3 hover:text-cyan-400 transition">
              <Gauge className="w-6 h-6" />
              <span>Pressure: {weather.main.pressure} hPa</span>
            </div>
            <div className="flex items-center gap-3 hover:text-cyan-400 transition">
              <Sun className="w-6 h-6" />
              <span>
                Feels Like: {(weather.main.feels_like - 273.15).toFixed(1)}°C
              </span>
            </div>
          </div>
        )}

        {/* Interactive Space */}
        <div className="mt-10 p-6 bg-white/5 rounded-xl border border-white/10 hover:scale-[1.02] transition">
          <h4 className="text-xl mb-4 text-cyan-300">What you can do?</h4>
          {quote && (<motion.p
            key={quote}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gray-200 leading-relaxed text-lg"
          >
            {quote}
          </motion.p>)}
          
        {forecast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-lg text-left font-semibold text-cyan-300 my-2">Take a look at the future!</h2>
            <p className="text-md">{predictWeather()}</p>
          </motion.div>
        )}
        </div>
           <h2 className="text-2xl font-bold mb-4">Upcoming Forecast</h2>
        {forecast ? (
          <div className="space-y-4">
            {forecast.list.slice(0, 5).map((f, i) => (
              <motion.div
                key={i}
                className="flex justify-between items-center p-4 rounded-xl  bg-white/5 "
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-gray-300">
                  {new Date(f.dt_txt).toLocaleString()}
                </span>
                <span className="text-lg">
                  {(f.main.temp - 273.15).toFixed(1)}°C
                </span>
                <span className="capitalize">{f.weather[0].description}</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <p>No forecast data yet...</p>
        )}
      </motion.div>)}
    </motion.div>
  );
};

export default WeatherDisplay;
