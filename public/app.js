const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
const port = 7200;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));


app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

// MapQuest API Key
const apiKey = 'HQ9oTsCzbmNw5r2dLdfffdIbrTKHy1qZ';

function geocodeAddress(address) {
  const url = `https://www.mapquestapi.com/geocoding/v1/address?key=${apiKey}&location=${address}`;

  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) {
        reject('Error from MapQuest API');
        return;
      }

      const data = JSON.parse(body);
      const coordinates = data.results[0].locations[0].latLng;
      resolve(coordinates);
    });
  });
}

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
  
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceInKm = R * c;
    return distanceInKm;                  //* 0.621371; // Convert distance to miles
  }
  

  async function calculateHospitalDistances(userCoords, hospitalCoordinates) {
    const hospitalDistances = [];
    let counter_of_hospitals = 0;

    hospitalCoordinates.forEach((coords, index) => {
        const distance = haversineDistance(userCoords.lat, userCoords.lng, coords[1], coords[0]);
        if(distance < 5.0) {
            hospitalDistances.push({ index, distance });
            counter_of_hospitals++;
        }
    });

    return { hospitalDistances, counter_of_hospitals };
}

async function calculateUniDistances(userCoords, unisCoordinates) {
  const uniDistances = [];
  let counter_of_unis = 0;

  unisCoordinates.forEach((coords, index) => {
      const distance = haversineDistance(userCoords.lat, userCoords.lng, coords[1], coords[0]);
      if(distance < 4.0) {
          uniDistances.push({ index, distance });
          counter_of_unis++;
      }
  });

  return { uniDistances, counter_of_unis };
}

async function calculateSchoolDistances(userCoords, SchoolsCoordinates) {
  const SchoolsDistances = [];
  let counter_of_schools = 0;

  SchoolsCoordinates.forEach((coords, index) => {
      const distance = haversineDistance(userCoords.lat, userCoords.lng, coords[1], coords[0]);
      if(distance < 3.0) {
        SchoolsDistances.push({ index, distance });
        counter_of_schools++;
      }
  });

  return { SchoolsDistances, counter_of_schools };
}

async function calculateParkDistances(userCoords, ParksCoordinates) {
  const ParksDistances = [];
  let counter_of_parks = 0;

  ParksCoordinates.forEach((coords, index) => {
      const distance = haversineDistance(userCoords.lat, userCoords.lng, coords[1], coords[0]);
      if(distance < 2.0) {
        ParksDistances.push({ index, distance });
        counter_of_parks++;
      }
  });

  return { ParksDistances, counter_of_parks };
}




async function calculateStationsDistances(userCoords, StationCoordinates ) {
  const StationsDistances = [];
  let counter_of_stations = 0;

  StationCoordinates.forEach((coords, index) => {
      const distance = haversineDistance(userCoords.lat, userCoords.lng, coords[1], coords[0]);
      if(distance < 2.5) {
          StationsDistances.push({ index, distance });
          counter_of_stations++;
      }
  });

  return { StationsDistances, counter_of_stations  };
}

app.post('/calculateDistances', async (req, res) => {
  const userAddress = req.body.userAddress;
  const hospitalCoordinates = req.body.hospitalCoordinates;
  const unisCoordinates = req.body.unisCoordinates;
  const SchoolsCoordinates = req.body.SchoolsCoordinates;
  const StationCoordinates= req.body.StationCoordinates;
  const ParksCoordinates= req.body.ParksCoordinates;


  try {
      const userCoords = await geocodeAddress(userAddress);

      const { hospitalDistances, counter_of_hospitals } = await calculateHospitalDistances(userCoords, hospitalCoordinates);
      const { uniDistances, counter_of_unis } = await calculateUniDistances(userCoords, unisCoordinates);
      const { SchoolsDistances, counter_of_schools } = await calculateSchoolDistances(userCoords, SchoolsCoordinates);
      const { StationsDistances, counter_of_stations } = await calculateStationsDistances(userCoords, StationCoordinates);
      const { ParksDistances, counter_of_parks } = await calculateParkDistances(userCoords, ParksCoordinates);

      res.json({ 
          hospitalDistances, 
          uniDistances, 
          StationsDistances,
          SchoolsDistances,
          ParksDistances,
          counterOfHospitals: counter_of_hospitals, 
          counterOfUnis: counter_of_unis ,
          counterOfStations:counter_of_stations,
          counterOfSchools:counter_of_schools,
          counterOfParks:counter_of_parks 
      });

  } catch (error) {
      res.status(500).json({ error: 'An error occurred while calculating distances.' });
  }
});







app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
