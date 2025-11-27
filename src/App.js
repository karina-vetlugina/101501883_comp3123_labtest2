import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('Toronto');

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || '2636df0abfa2f2bba6f517eb9647f681';
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
  const ONECALL_API_URL_3 = 'https://api.openweathermap.org/data/3.0/onecall';
  const ONECALL_API_URL_25 = 'https://api.openweathermap.org/data/2.5/onecall';

  useEffect(() => {
    fetchWeatherData(city);
  }, []);

  const fetchWeatherData = async (cityName) => {
    if (!cityName || cityName.trim() === '') {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const currentResponse = await axios.get(API_URL, {
        params: {
          q: cityName,
          appid: API_KEY,
          units: 'metric'
        }
      });

      const { lat, lon } = currentResponse.data.coord;

      let forecastResponse = null;
      try {
        forecastResponse = await axios.get(ONECALL_API_URL_3, {
          params: {
            lat: lat,
            lon: lon,
            exclude: 'current,minutely,hourly,alerts',
            appid: API_KEY,
            units: 'metric'
          }
        });
      } catch (err) {
        try {
          forecastResponse = await axios.get(ONECALL_API_URL_25, {
            params: {
              lat: lat,
              lon: lon,
              exclude: 'current,minutely,hourly,alerts',
              appid: API_KEY,
              units: 'metric'
            }
          });
        } catch (err2) {
          const fallbackForecast = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
            params: {
              q: cityName,
              appid: API_KEY,
              units: 'metric'
            }
          });
          forecastResponse = { data: fallbackForecast.data };
        }
      }

      setWeatherData({
        current: currentResponse.data,
        forecast: forecastResponse.data
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response) {
        if (err.response.status === 404) {
          setError('City not found. Please check the city name and try again.');
        } else if (err.response.status === 401) {
          setError('Invalid API key. Please check your OpenWeatherMap API key.');
        } else {
          setError(`Error: ${err.response.data.message || 'Failed to fetch weather data'}`);
        }
      } else {
        setError('Network error. Please check your internet connection.');
      }
      setWeatherData(null);
    }
  };

  const handleSearch = (searchCity) => {
    setCity(searchCity);
    fetchWeatherData(searchCity);
  };

  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <h1 className="app-title">Weather App</h1>
          <p className="app-subtitle">Get real-time weather information for any city</p>
        </header>

        <SearchBar onSearch={handleSearch} loading={loading} />

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading weather data...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
          </div>
        )}

        {weatherData && !loading && !error && (
          <WeatherCard weatherData={weatherData} />
        )}

        {!weatherData && !loading && !error && (
          <div className="welcome-message">
            <p>Enter a city name above to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
