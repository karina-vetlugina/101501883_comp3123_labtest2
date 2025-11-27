import React from 'react';
import './WeatherCard.css';

const WeatherCard = ({ weatherData }) => {
  if (!weatherData) return null;

  const currentData = weatherData.current || weatherData;
  const forecastData = weatherData.forecast;

  const {
    name,
    main,
    weather,
    wind,
    sys,
    visibility,
    clouds,
    coord
  } = currentData;

  const weatherIcon = weather[0]?.icon || '01d';
  const weatherDescription = weather[0]?.description || 'Clear sky';
  const temperature = Math.round(main?.temp || 0);
  const feelsLike = Math.round(main?.feels_like || 0);
  const humidity = main?.humidity || 0;
  const pressure = main?.pressure || 0;
  const tempMin = Math.round(main?.temp_min || 0);
  const tempMax = Math.round(main?.temp_max || 0);
  const windSpeed = wind?.speed || 0;
  const country = sys?.country || '';
  const visibilityKm = visibility ? (visibility / 1000).toFixed(1) : 'N/A';
  const cloudiness = clouds?.all || 0;

  const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

  const getTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWeeklyForecast = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (forecastData && forecastData.daily && Array.isArray(forecastData.daily)) {
      const dailyArray = forecastData.daily;
      
      const weeklyData = dailyArray.slice(0, 7).map((day) => {
        const date = new Date(day.dt * 1000);
        return {
          date: date,
          temp: Math.round(day.temp.day),
          maxTemp: Math.round(day.temp.max),
          minTemp: Math.round(day.temp.min),
          icon: day.weather[0].icon,
          description: day.weather[0].description
        };
      });

      if (weeklyData.length > 0) {
        weeklyData[0] = {
          ...weeklyData[0],
          temp: temperature,
          maxTemp: Math.max(weeklyData[0].maxTemp, tempMax),
          minTemp: Math.min(weeklyData[0].minTemp, tempMin),
          icon: weatherIcon,
          description: weatherDescription
        };
      }

      while (weeklyData.length < 7) {
        const lastDay = weeklyData[weeklyData.length - 1];
        const nextDate = new Date(lastDay.date);
        nextDate.setDate(nextDate.getDate() + 1);
        weeklyData.push({
          date: nextDate,
          temp: lastDay.temp,
          maxTemp: lastDay.maxTemp,
          minTemp: lastDay.minTemp,
          icon: lastDay.icon,
          description: lastDay.description
        });
      }

      return weeklyData.slice(0, 7);
    }

    if (forecastData && forecastData.list && Array.isArray(forecastData.list)) {
      const dailyForecasts = {};
      
      forecastData.list.forEach((item) => {
        const date = new Date(item.dt * 1000);
        const itemDate = new Date(date);
        itemDate.setHours(0, 0, 0, 0);
        const dateKey = itemDate.toDateString();
        
        if (!dailyForecasts[dateKey]) {
          dailyForecasts[dateKey] = {
            date: itemDate,
            temps: [],
            icons: [],
            descriptions: []
          };
        }
        
        dailyForecasts[dateKey].temps.push(item.main.temp);
        dailyForecasts[dateKey].icons.push(item.weather[0].icon);
        dailyForecasts[dateKey].descriptions.push(item.weather[0].description);
      });

      let weeklyData = Object.values(dailyForecasts)
        .map(day => {
          const avgTemp = Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length);
          const maxTemp = Math.round(Math.max(...day.temps));
          const minTemp = Math.round(Math.min(...day.temps));
          const icon = day.icons[Math.floor(day.icons.length / 2)];
          const description = day.descriptions[0];
          
          return {
            date: day.date,
            temp: avgTemp,
            maxTemp,
            minTemp,
            icon,
            description
          };
        })
        .sort((a, b) => a.date - b.date);

      const todayKey = today.toDateString();
      const hasToday = weeklyData.some(day => day.date.toDateString() === todayKey);
      
      if (!hasToday) {
        weeklyData.unshift({
          date: new Date(today),
          temp: temperature,
          maxTemp: tempMax,
          minTemp: tempMin,
          icon: weatherIcon,
          description: weatherDescription
        });
      } else {
        const todayIndex = weeklyData.findIndex(day => day.date.toDateString() === todayKey);
        if (todayIndex !== -1) {
          const todayData = {
            ...weeklyData[todayIndex],
            temp: temperature,
            maxTemp: Math.max(weeklyData[todayIndex].maxTemp, tempMax),
            minTemp: Math.min(weeklyData[todayIndex].minTemp, tempMin),
            icon: weatherIcon,
            description: weatherDescription
          };
          weeklyData.splice(todayIndex, 1);
          weeklyData.unshift(todayData);
        }
      }

      while (weeklyData.length < 7) {
        const lastDay = weeklyData[weeklyData.length - 1];
        const nextDate = new Date(lastDay.date);
        nextDate.setDate(nextDate.getDate() + 1);
        weeklyData.push({
          date: nextDate,
          temp: lastDay.temp,
          maxTemp: lastDay.maxTemp,
          minTemp: lastDay.minTemp,
          icon: lastDay.icon,
          description: lastDay.description
        });
      }

      return weeklyData.slice(0, 7);
    }

    const weeklyData = [{
      date: new Date(today),
      temp: temperature,
      maxTemp: tempMax,
      minTemp: tempMin,
      icon: weatherIcon,
      description: weatherDescription
    }];

    while (weeklyData.length < 7) {
      const lastDay = weeklyData[weeklyData.length - 1];
      const nextDate = new Date(lastDay.date);
      nextDate.setDate(nextDate.getDate() + 1);
      weeklyData.push({
        date: nextDate,
        temp: lastDay.temp,
        maxTemp: lastDay.maxTemp,
        minTemp: lastDay.minTemp,
        icon: lastDay.icon,
        description: lastDay.description
      });
    }

    return weeklyData;
  };

  const weeklyForecast = getWeeklyForecast();

  const getShortDayName = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  return (
    <div className="weather-card">
      <div className="weather-main">
        <div className="location-info">
          <h2 className="city-name">
            {name}, {country}
          </h2>
          <p className="coordinates">
            Lat: {coord?.lat?.toFixed(2)}, Lon: {coord?.lon?.toFixed(2)}
          </p>
        </div>

        <div className="weather-primary">
          <div className="temperature-section">
            <div className="temperature">
              {temperature}°C
            </div>
            <div className="feels-like">
              Feels like {feelsLike}°C
            </div>
          </div>

          <div className="weather-icon-section">
            <img
              src={iconUrl}
              alt={weatherDescription}
              className="weather-icon"
            />
            <p className="weather-description">
              {weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1)}
            </p>
          </div>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-grid">
          <div className="detail-item">
            <div className="detail-content">
              <div className="detail-label">Temperature Range</div>
              <div className="detail-value">
                {tempMin}°C / {tempMax}°C
              </div>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-content">
              <div className="detail-label">Humidity</div>
              <div className="detail-value">{humidity}%</div>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-content">
              <div className="detail-label">Wind Speed</div>
              <div className="detail-value">{windSpeed} m/s</div>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-content">
              <div className="detail-label">Pressure</div>
              <div className="detail-value">{pressure} hPa</div>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-content">
              <div className="detail-label">Visibility</div>
              <div className="detail-value">{visibilityKm} km</div>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-content">
              <div className="detail-label">Cloudiness</div>
              <div className="detail-value">{cloudiness}%</div>
            </div>
          </div>
        </div>

        <div className="additional-info">
          <p className="sunrise-sunset">
            Sunrise: {getTime(sys?.sunrise)} | 
            Sunset: {getTime(sys?.sunset)}
          </p>
        </div>
      </div>

      {weeklyForecast.length > 0 && (
        <div className="weekly-forecast">
          <h3 className="forecast-title">7-Day Forecast</h3>
          <div className="forecast-grid">
            {weeklyForecast.map((day, index) => (
              <div key={index} className="forecast-day">
                <div className="forecast-day-name">{getShortDayName(day.date)}</div>
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.description}
                  className="forecast-icon"
                />
                <div className="forecast-temp">{day.temp}°C</div>
                <div className="forecast-temp-range">
                  {day.maxTemp}° / {day.minTemp}°
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;

