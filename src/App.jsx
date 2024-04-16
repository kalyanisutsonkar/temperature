import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);
  const [cities, setCities] = useState(() => {
    const storedCities = localStorage.getItem('cities');
    return storedCities ? JSON.parse(storedCities) : [];
  });
  const [allCities, setAllCities] = useState([]);
  
  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await fetch('https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=5');
        const jsonData = await response.json();
        setAllCities(jsonData?.results || []);
      } catch (error) {
        console.error('Error fetching city data:', error);
      }
    }
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchCitiesWeather = async () => {
      const tempCitiesWithTemp = [];
      for (const city of allCities) {
        try {
          const response = await fetchWeather(city.fields.name);
          if (response) {
            const data = await response.json();
            tempCitiesWithTemp.push({ name: city.fields.name, weather: data });
          } else {
            console.error('Error fetching weather data for:', city.fields.name);
          }
        } catch (error) {
          console.error('Error fetching weather data for:', city.fields.name, error);
        }
      }
      setCities(tempCitiesWithTemp);
    };
    fetchCitiesWeather();
  }, [allCities]);

  const API_KEY = 'cec0c6efe515e6ee9375257469f52e32';

  const fetchWeather = async (cityName) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`);
      return response;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  };

  const saveCityToLocalStorage = (cityName) => {
    const updatedCities = [...cities, cityName];
    setCities(updatedCities);
    localStorage.setItem('cities', JSON.stringify(updatedCities));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetchWeather(city);
    if (response && response.status === 200) {
      const data = await response.json();
      saveCityToLocalStorage(city);
      setCity('');
      setCities([...cities, { name: city, weather: data }]);
    } else {
      setError('City not found. Please enter a valid city name.');
    }
  };
  const handleSortByTemperature = () => {
    const sortedCities = [...cities].sort((a, b) => {
      const tempA = a.weather ? a.weather.main.temp : null;
      const tempB = b.weather ? b.weather.main.temp : null;
      return tempA - tempB;
    });
    setCities(sortedCities);
  };
  const handleSortByCity = () => {
    const sortedCities = [...cities].sort((a, b) => a.name.localeCompare(b.name));
    setCities(sortedCities);
  };

  const getWeatherEmoji = (description) => {
    const lowerCaseDescription = description.toLowerCase();
    if (lowerCaseDescription.includes('clear')) {
      return '☀️';
    } else if (lowerCaseDescription.includes('cloud')) {
      return '☁️';
    } else if (lowerCaseDescription.includes('rain')) {
      return '🌧️';
    } else if (lowerCaseDescription.includes('snow')) {
      return '❄️';
    } else {
      return '❓';
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Weather Report</h1>
      <div className="search-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="cities-container">
        <h2>All Cities</h2>
        <table>
          <thead>
            <tr>
              <th>City</th>
              <th>Temperature (°C)</th>
              <th>Humidity (%)</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city, index) => (
              <tr key={index}>
                <td>{city.name}</td>
                <td>{city.weather ? city.weather.main.temp : ''}{city.weather ? '°C' : ''}</td>
                <td>{city.weather ? city.weather.main.humidity : ''}{city.weather ? '%' : ''}</td>
                <td>
                  {city.weather ? (
                    <span>
                      {city.weather.weather[0].description} {getWeatherEmoji(city.weather.weather[0].description)}
                    </span>
                  ) : (
                    ''
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleSortByTemperature} className="sort-button">
          Sort by temperrature
        </button>
        <button onClick={handleSortByCity} className="sort-button">
          Sort by City
        </button>
      </div>
    </div>
  );
};

export default App;