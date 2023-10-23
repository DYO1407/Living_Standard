//const addressesArray = [];
//const coordinatesArray = [];
const filePaths = [
  "../factors/KRANKENHAUSOGD.json",
  "../factors/UNIVERSITAETOGD.json",
  "../factors/POLIZEIOGD.json",
  "../factors/SCHULEOGD.json",
  "../factors/PARKINFOOGD.json",
];
const hospitalFeaturesMap = new Map(); // to store hospital features
const unisFeaturesMap = new Map();
const police_StationsFeaturesMap = new Map();
const SchoolsFeaturesMap = new Map();
const ParksFeaturesMap = new Map();

function handleFile() {
  filePaths.forEach(async (filePath) => {
    try {
      const jsonData = await fetchAndParseFile(filePath);

      if (filePath.includes("KRANKENHAUS")) {
        processHospitalData(jsonData);
      } else if (filePath.includes("UNIVERSITAET")) {
        processUniData(jsonData);
      } else if (filePath.includes("POLIZEIOGD")) {
        processPoliceData(jsonData);
      } else if (filePath.includes("SCHULEOGD")) {
        processSchoolsData(jsonData);
      } else if (filePath.includes("PARKINFOOGD")) {
        processParksData(jsonData);
      }
    } catch (error) {
      console.error("Failed to load file:", error);
    }
  });
}

async function fetchAndParseFile(filePath) {
  const response = await fetch(filePath);
  const content = await response.text();
  return JSON.parse(content);
}

function processParksData(data) {
  data.features.forEach((feature) => {
    const coordinates = feature.geometry.coordinates;
    const address = feature.properties.ADRESSE;
    const name = feature.properties.ANL_NAME;

    const featureData = {
      coordinates: coordinates,
      address: address,
      name: name,
    };

    ParksFeaturesMap.set(name, featureData);
  });
  //displaySchoolsAddresses();
}

function processSchoolsData(data) {
  data.features.forEach((feature) => {
    const coordinates = feature.geometry.coordinates;
    const address = feature.properties.ADRESSE;
    const name = feature.properties.NAME;

    const featureData = {
      coordinates: coordinates,
      address: address,
      name: name,
    };

    SchoolsFeaturesMap.set(name, featureData);
  });
  //displaySchoolsAddresses();
}

function processPoliceData(data) {
  data.features.forEach((feature) => {
    const coordinates = feature.geometry.coordinates;
    const address = feature.properties.ADRESSE;
    const name = feature.properties.NAME;

    const featureData = {
      coordinates: coordinates,
      address: address,
      name: name,
    };

    police_StationsFeaturesMap.set(name, featureData);
  });
  //displaypoliceStationsAddresses();
}

function processHospitalData(data) {
  data.features.forEach((feature) => {
    const coordinates = feature.geometry.coordinates;
    const address = feature.properties.ADRESSE;
    const description = feature.properties.BEZEICHNUNG;

    const featureData = {
      coordinates: coordinates,
      address: address,
      description: description,
    };

    hospitalFeaturesMap.set(address, featureData);
  });
  //displayHospitalAddresses();
}

function processUniData(data) {
  data.features.forEach((feature) => {
    const coordinates = feature.geometry.coordinates;
    const address = feature.properties.ADRESSE;
    const name = feature.properties.NAME;

    const featureData = {
      coordinates: coordinates,
      address: address,
      name: name,
    };

    unisFeaturesMap.set(name, featureData);
  });
  //displayUniAddresses();
}

function calculateDistances() {
  const userAddress = document.getElementById("userAddress").value;

  const hospitalCoordinates = [];
  hospitalFeaturesMap.forEach((feature) => {
    hospitalCoordinates.push(feature.coordinates);
  });

  const unisCoordinates = [];
  unisFeaturesMap.forEach((feature) => {
    unisCoordinates.push(feature.coordinates);
  });

  const StationCoordinates = [];
  police_StationsFeaturesMap.forEach((feature) => {
    StationCoordinates.push(feature.coordinates);
  });

  const SchoolsCoordinates = [];
  SchoolsFeaturesMap.forEach((feature) => {
    SchoolsCoordinates.push(feature.coordinates);
  });

  const ParksCoordinates = [];
  ParksFeaturesMap.forEach((feature) => {
    ParksCoordinates.push(feature.coordinates);
  });

  if (
    hospitalCoordinates.length === 0 &&
    unisCoordinates.length === 0 &&
    StationCoordinates.length === 0 &&
    SchoolsCoordinates.length === 0 &&
    ParksCoordinatessCoordinates.length === 0
  ) {
    console.error("No addresses available.");
    return;
  }

  fetch("/calculateDistances", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userAddress,
      hospitalCoordinates,
      unisCoordinates,
      StationCoordinates,
      SchoolsCoordinates,
      ParksCoordinates
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      //const counterDisplay = document.getElementById("counter_of_hospitals");
      //counterDisplay.textContent = `Number of addresses within 4 Km: ${data.counterOfHospitals}`;
      displayHospitalDistances(data.hospitalDistances);
      //const counterDisplay1 = document.getElementById("counter_of_unis");
      //counterDisplay1.textContent = `Number of addresses within 4 Km: ${data.counterOfUnis}`;
      displayUniDistances(data.uniDistances);
      //const counterDisplay2 = document.getElementById("counter_of_station");
      //counterDisplay2.textContent = `Number of addresses within 4 Km: ${data.counterOfStations}`;
      displayPoliceStationsDistances(data.StationsDistances);
      //const counterDisplay3 = document.getElementById("counter_of_schools");
      //counterDisplay3.textContent = `Number of addresses within 4 Km: ${data.counterOfSchools}`;
      displaySchoolsDistances(data.SchoolsDistances);

      displayParksDistances(data.ParksDistances);
    })
    .catch((error) => console.error("Error:", error));
}

function getUserInput() {
  const userAddress = document.getElementById("userAddress").value;
  const userType = document.getElementById("userType").value;
  return { userAddress, userType };
}

function getCoordinates() {
  const hospitalCoordinates = [];
  hospitalFeaturesMap.forEach((feature) => {
    hospitalCoordinates.push(feature.coordinates);
  });

  const unisCoordinates = [];
  unisFeaturesMap.forEach((feature) => {
    unisCoordinates.push(feature.coordinates);
  });

  const StationCoordinates = [];
  police_StationsFeaturesMap.forEach((feature) => {
    StationCoordinates.push(feature.coordinates);
  });

  const SchoolsCoordinates = [];
  SchoolsFeaturesMap.forEach((feature) => {
    SchoolsCoordinates.push(feature.coordinates);
  });

  const ParksCoordinates = [];
  ParksFeaturesMap.forEach((feature) => {
    ParksCoordinates.push(feature.coordinates);
  });

  return {
    hospitalCoordinates,
    unisCoordinates,
    StationCoordinates,
    SchoolsCoordinates,
    ParksCoordinates,
  };
}

function calculateScore(userType, data) {
    const weights = {
      student: {
        hospital: 0.6,
        university: 0.8,
        Police_Station: 0.4,
        school: 0.3,
        park: 0.6
      },
      family: {
        hospital: 0.8,
        university: 0.5,
        Police_Station: 0.6,
        school: 0.7,
        park: 0.7
      },
      pensionist: {
        hospital: 0.7,
        university: 0.1,
        Police_Station: 0.6,
        school: 0.4,
        park: 0.8
      },
    };
  
    let score = (
      weights[userType].hospital * data.counterOfHospitals +
      weights[userType].university * data.counterOfUnis +
      weights[userType].Police_Station * data.counterOfStations +
      weights[userType].school * data.counterOfSchools +
      weights[userType].park * data.counterOfParks
    );
  
    // Normalize the score to ensure it's always below or equal to 6
    const maxPossibleScore = 10 * 5; // considering max weight is 1
    score = (score / maxPossibleScore);
  
    return score;
  }

function generateQualityMessage(score) {
  if (score >= 3) {
    return "Excellent living quality!";
  } else if (score >= 2) {
    return "Good living quality.";
  } else if (score >= 1.5) {
    return "Average living quality.";
  } else {
    return "Below average living quality.";
  }
}

function calculateLivingQuality() {
  const { userAddress, userType } = getUserInput();
  const {
    hospitalCoordinates,
    unisCoordinates,
    StationCoordinates,
    SchoolsCoordinates,
    ParksCoordinates
  } = getCoordinates();

  fetch("/calculateDistances", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userAddress,
      hospitalCoordinates,
      unisCoordinates,
      StationCoordinates,
      SchoolsCoordinates,
      ParksCoordinates
    }),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch distances");
      return response.json();
    })
    .then((data) => {
      const score = calculateScore(userType, data);
      const qualityMessage = generateQualityMessage(score);

      // Displaying the score alongside the quality message
      document.getElementById(
        "livingQualityResult"
      ).innerText = `${qualityMessage} Score: ${score.toFixed(2)}`;
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("livingQualityResult").innerText =
        "Error calculating living quality.";
    });
}

/*function displaypoliceStationsAddresses() {
    const addressList = document.getElementById("policeAddressList");
  
    // Clear the list before appending new addresses
    addressList.innerHTML = "";
  
    let index = 0;
    // Display University Addresses with a title
    addressList.innerHTML += "<h2>Police Stations</h2>";
  
    police_StationsFeaturesMap.forEach((feature, address) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${index + 1}. ${address} - [${
        feature.coordinates
      }]`;
      addressList.appendChild(listItem);
      index++;
    });
  }



function displayHospitalAddresses() {
  const addressList = document.getElementById("hospitalAddressList");

  // Clear the list before appending new addresses
  addressList.innerHTML = "";

  let index = 0;
  // Display Hospital Addresses with a title
  addressList.innerHTML += "<h2>Hospitals</h2>";

  hospitalFeaturesMap.forEach((feature, address) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${index + 1}. ${address} - [${
      feature.coordinates
    }]`;
    addressList.appendChild(listItem);
    index++;
  });
}

function displayUniAddresses() {
  const addressList = document.getElementById("uniAddressList");

  // Clear the list before appending new addresses
  addressList.innerHTML = "";

  let index = 0;
  // Display University Addresses with a title
  addressList.innerHTML += "<h2>Universities</h2>";

  unisFeaturesMap.forEach((feature, address) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${index + 1}. ${address} - [${
      feature.coordinates
    }]`;
    addressList.appendChild(listItem);
    index++;
  });
}*/

function displayHospitalDistances(distances) {
  const distanceList = document.getElementById("hospitals");

  // Clear the list before appending new distances
  distanceList.innerHTML = "";

  distances.forEach(({ index, distance }) => {
    const listItem = document.createElement("li");

    // Retrieve the appropriate address for hospitals
    const actualAddress = Array.from(hospitalFeaturesMap.keys())[index];

    listItem.textContent = `${
      index + 1
    }. Distance to Hospital: ${actualAddress} - ${distance.toFixed(2)} KM`;
    distanceList.appendChild(listItem);
  });
}

function displayUniDistances(distances) {
  const distanceList = document.getElementById("universities");

  // Clear the list before appending new distances
  distanceList.innerHTML = "";

  distances.forEach(({ index, distance }) => {
    const listItem = document.createElement("li");

    // Retrieve the appropriate address for universities
    const actualAddress = Array.from(unisFeaturesMap.keys())[index];

    listItem.textContent = `${
      index + 1
    }. Distance to University: ${actualAddress} - ${distance.toFixed(2)} KM`;
    distanceList.appendChild(listItem);
  });
}

function displaySchoolsDistances(distances) {
  const distanceList = document.getElementById("schools");

  // Clear the list before appending new distances
  distanceList.innerHTML = "";

  distances.forEach(({ index, distance }) => {
    const listItem = document.createElement("li");

    // Retrieve the appropriate address for universities
    const actualAddress = Array.from(SchoolsFeaturesMap.keys())[index];

    listItem.textContent = `${
      index + 1
    }. Distance to school: ${actualAddress} - ${distance.toFixed(2)} KM`;
    distanceList.appendChild(listItem);
  });
}


function displayParksDistances(distances) {
    const distanceList = document.getElementById("parks");
  
    // Clear the list before appending new distances
    distanceList.innerHTML = "";
  
    distances.forEach(({ index, distance }) => {
      const listItem = document.createElement("li");
  
      // Retrieve the appropriate address for universities
      const actualAddress = Array.from(ParksFeaturesMap.keys())[index];
  
      listItem.textContent = `${
        index + 1
      }. Distance to Park: ${actualAddress} - ${distance.toFixed(2)} KM`;
      distanceList.appendChild(listItem);
    });
  }

function displayPoliceStationsDistances(distances) {
  const distanceList = document.getElementById("police");

  // Clear the list before appending new distances
  distanceList.innerHTML = "";

  distances.forEach(({ index, distance }) => {
    const listItem = document.createElement("li");

    // Retrieve the appropriate address for universities
    const actualAddress = Array.from(police_StationsFeaturesMap.keys())[index];

    listItem.textContent = `${
      index + 1
    }. Distance to Police Station: ${actualAddress} - ${distance.toFixed(
      2
    )} KM`;
    distanceList.appendChild(listItem);
  });
}
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");
  handleFile();
});
