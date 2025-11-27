# Weather App - COMP3123 Lab Test 2

**Student Name:** Karina Vetlugina  
**Student ID:** 101501883  
**Course:** COMP 3123 - Full Stack Development I

## Project Description

A React weather application that displays real-time weather information for any city worldwide. The app fetches data from the OpenWeatherMap API and displays current weather conditions, 7-day forecast, and detailed weather metrics.

## Features

- Real-time weather data for any city
- 7-day weather forecast
- Current temperature, feels like, min/max temperatures
- Weather icons from OpenWeatherMap API
- Detailed metrics: humidity, pressure, wind speed, visibility, cloudiness
- Sunrise and sunset times
- Search functionality
- Responsive design for mobile and desktop
- Error handling for invalid cities

## Technology Stack

- React 19.2.0
- Axios 1.13.2
- OpenWeatherMap API
- CSS3

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/karina-vetlugina/101501883_comp3123_labtest2.git
   cd 101501883_comp3123_labtest2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Add your OpenWeatherMap API key:
     ```
     REACT_APP_WEATHER_API_KEY=your_api_key_here
     ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`

## API Integration

**OpenWeatherMap API** - Current Weather Data and Forecast endpoints

- **Current Weather**: `https://api.openweathermap.org/data/2.5/weather`
- **Forecast**: `https://api.openweathermap.org/data/2.5/forecast`
- **One Call API**: `https://api.openweathermap.org/data/2.5/onecall`
- **Documentation**: [OpenWeatherMap API Docs](https://openweathermap.org/api)

## React Features

- **useState**: Managing component state (weather data, loading, error, city)
- **useEffect**: Fetching weather data on component mount
- **Props**: Component communication (WeatherCard, SearchBar)
- **Function Components**: All components use functional component syntax

## Component Structure

```
App.js (Main Component)
├── SearchBar.js (Search functionality)
└── WeatherCard.js (Weather display with 7-day forecast)
```

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Add environment variable: `REACT_APP_WEATHER_API_KEY`
3. Deploy automatically

## Postman Testing

Test the API endpoint:
- **Request Type**: GET
- **URL**: `https://api.openweathermap.org/data/2.5/weather`
- **Query Parameters**: `q` (city name), `appid` (API key), `units` (metric)

## Screenshots

Add screenshots to the `screenshots/` folder:
- Main weather display
- 7-day forecast
- Search functionality
- Mobile responsive view
- Error handling

## Author

**Name:** Karina Vetlugina  
**Student ID:** 101501883  
**Course:** COMP 3123 - Full Stack Development I

---

**GitHub Repository:** [https://github.com/karina-vetlugina/101501883_comp3123_labtest2](https://github.com/karina-vetlugina/101501883_comp3123_labtest2)  
**Live Demo:** [Your Deployment Link Here]
