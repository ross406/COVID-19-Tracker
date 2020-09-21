import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Table from './Table';
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import { prettyPrintStat, sortData } from './util';
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  // https://disease.sh/v3/covid-19/countries

  // Useeffect = Runs a peice of code based on a given condition

  useEffect(() => {
    // runs when component loads
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    setCountry(countryCode);

    const url =
      countryCode === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    // https://disease.sh/v3/covid-19/all
    // https://disease.sh/v3/covid-19/countries

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCountry(countryCode);

        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className='app'>
      <div className='app__left'>
        <div className='app__header'>
          <h1>Covid-19 Tracker</h1>
          <FormControl className='app__dropdown'>
            <Select
              variant='outlined'
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}

              {/* <MenuItem value='worldwide'>Worldwide</MenuItem>
            <MenuItem value='worldwide'>Option 2</MenuItem>
            <MenuItem value='worldwide'>Worldwide</MenuItem>
            <MenuItem value='worldwide'>Worldwide</MenuItem> */}
            </Select>
          </FormControl>
        </div>

        <div className='app__stats'>
          {/* InfoBoxes title="coronavirus cases" */}
          <InfoBox
            isRed
            active={casesType === 'cases'}
            onClick={(e) => setCasesType('cases')}
            title='CoronaVirus Cases'
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === 'recovered'}
            onClick={(e) => setCasesType('recovered')}
            title='Recovered'
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === 'deaths'}
            onClick={(e) => setCasesType('deaths')}
            title='Deaths'
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
          {/* InfoBoxes title="coronavirus Recoveries" */}

          {/* InfoBoxes */}
        </div>

        {/* Table */}

        {/* Map */}
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className='app__right'>
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className='app__graphTitle'>Worldwide new {casesType}</h3>
          <LineGraph className='app__graph' casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
