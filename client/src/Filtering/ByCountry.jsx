// ByCountry.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ByCountry({ setSelectedCountry }) {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    // Fetch list of unique countries from the API
    axios
      .get('http://localhost:5000/api/data')
      .then((response) => {
        const data = response.data;
        const uniqueCountries = [...new Set(data.map((item) => item.country))];
        setCountries(uniqueCountries);
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
      });
  }, []);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  return (
    <div>
      <h2>Filter By Country</h2>
      <div>
        <label htmlFor="country">Select a Country:</label>
        <select id="country" onChange={handleCountryChange}>
          <option value="">All Countries</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
     
    </div>
  );
}

export default ByCountry;
