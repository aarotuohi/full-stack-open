import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiBaseUrl = 'https://studies.cs.helsinki.fi/restcountries/';

const fetchCountryData = async (countryName) => {
  if (countryName) {
    const response = await axios.get(`${apiBaseUrl}/api/name/${countryName}`);
    return { found: true, ...response.data };
  }
  return { found: false };
};

const useInput = (type) => {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange: handleChange,
  };
};

const useFetchCountry = (countryName) => {
  const [countryInfo, setCountryInfo] = useState(null);

  const retrieveCountry = async () => {
    const data = await fetchCountryData(countryName);
    setCountryInfo(data);
  };

  useEffect(() => {
    if (countryName) {
      retrieveCountry();
    }
  }, [countryName]);

  return countryInfo;
};

const CountryDetails = ({ country }) => {
  if (!country) {
    return null;
  }

  if (!country.found) {
    return <div>Country not found...</div>;
  }

  return (
    <div>
      <h3>{country.name.common}</h3>
      <div>Capital: {country.capital}</div>
      <div>Population: {country.population}</div>
      <img src={country.flags.png} height='100' alt={`Flag of ${country.name.common}`} />
    </div>
  );
};

const App = () => {
  const countryInput = useInput('text');
  const [countryName, setCountryName] = useState('');
  const country = useFetchCountry(countryName);

  const handleSearch = (event) => {
    event.preventDefault();
    setCountryName(countryInput.value);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input {...countryInput} />
        <button>Search</button>
      </form>

      <CountryDetails country={country} />
    </div>
  );
};

export default App;
