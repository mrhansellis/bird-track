import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import BirdTrackerService from './js/services/bird-track-service.js';
import GeoCall from './js/services/geoCall.js';
// Business Logic

//Business Logic

//Variables needed in more than one function
let birds = [];
let targetBirdInfo = [];
//let locationResult= [];
const birdNameInputElement = document.querySelector("#birdName-input");

/*function getGeoApiData( radioBtnVal, radioManualTxt){
  GeoCall.geoGrab(radioBtnVal,radioManualTxt)
    .then(function(geoCallResponse) {
      if(geoCallResponse instanceof Error){
        const errorMessage = `There was a problem accessing the location data from google's map API,
        Status Code: ${geoCallResponse.message}`;
        throw new Error(errorMessage);
      }
      geoCallResponse.forEach((element) => {
        console(element);
      });
    })
    .catch(function(error) {
      printError(error);
    });
}*/

function getAPIData(speciesCde = "", location = "") {

  BirdTrackerService.getSpeciescode(speciesCde, location)
    .then(function (birdTrackerResponse) {
      if (birdTrackerResponse instanceof Error) {
        clearResults();
        const errorMessage = `There was a problem accessing the bird data from eBird's API,
        Status Code: ${birdTrackerResponse.message}`;
        throw new Error(errorMessage);
      }
      if (speciesCde === "" && location == "") {
        birdTrackerResponse.forEach((bird, index) => {
          let birdObject = new Object();
          birdObject.comName = bird.comName;
          birdObject.speciesCode = bird.speciesCode;
          birds[index] = birdObject;
        });
      } else {
        if (!birdTrackerResponse.length) {
          clearResults();
          let targetBird = birds.find(birdObject => birdObject.speciesCode === `${speciesCde}`);
          const message = `There hasn't been any recent sighting of "${targetBird.comName}s". Maybe try another birdy.`;
          printError(message);
        } else {
          targetBirdInfo[0] = birdTrackerResponse[0].comName;
          targetBirdInfo[1] = birdTrackerResponse[0].sciName;

          birdTrackerResponse.forEach((bird, index) => {
            let birdObject = new Object();
            birdObject.lat = bird.lat;
            birdObject.lng = bird.lng;
            birdObject.locName = bird.locName;
            birdObject.obsDt = bird.obsDt;
            targetBirdInfo[index + 2] = birdObject;
          });
          console.log('running displayOutput');
          displayOutput(targetBirdInfo);
        }
      }
    })
    .catch(function (error) {
      printError(error);
    });
}

//UI Logic

function onKeyInputChange() {

  removeAutoDropDown();
  const filteredBirdNames = [];
  const value = birdNameInputElement.value.toLowerCase();

  if (value.lenght === 0) {
    return;
  }

  if (value.length > 2) {

    birds.forEach((bird, index) => {
      if (bird.comName.toLowerCase().includes(value)) {
        filteredBirdNames[index] = bird.comName;
      }
    });
  }

  createAutoCompleteDropDown(filteredBirdNames);
}

function createAutoCompleteDropDown(nameList) {
  const listElement = document.createElement("ul");
  listElement.className = "autocomplete-list";
  listElement.id = "autocomplete-list";

  nameList.forEach((birdName) => {
    const listItem = document.createElement("li");
    const birdNameBtn = document.createElement("button");
    birdNameBtn.innerHTML = birdName;
    birdNameBtn.addEventListener("click", onBirdButtonClick);
    listItem.appendChild(birdNameBtn);
    listElement.appendChild(listItem);
  });
  document.querySelector("#autocomplete-list-div").appendChild(listElement);
}

function removeAutoDropDown() {
  const listElement = document.querySelector("#autocomplete-list");
  const errorMessage = document.querySelector("#error");

  if (listElement) {
    listElement.remove();
  }
  errorMessage.setAttribute("class", "hide");
}

function onBirdButtonClick(e) {
  e.preventDefault();
  const buttonE1 = e.target;
  birdNameInputElement.value = buttonE1.innerHTML;
  removeAutoDropDown();
}

function displayOutput(birdOutputArray) {
  let bool = Boolean(document.querySelector('div#outputDisplay') === null)
  if (bool) {
    let outputDiv = document.createElement('div');
    outputDiv.setAttribute('id', 'outputDisplay');
    document.querySelector('div#map').append(outputDiv);
  }
  let oldOutputDiv = document.querySelector('div#outputDisplay');
  console.log(oldOutputDiv);
  (document.querySelector('p#error')).innerHTML = '';
  oldOutputDiv.innerText = '';
  let pTag = document.createElement('p');
  pTag.innerHTML = `<p>The species ${birdOutputArray[1]} commonly known as ${birdOutputArray[0]} has been found in the following locations:</p>`;
  let ulText = document.createElement('ul');
  //change this to change the number of birds
  for (let i = 2; i < 7; i++) {
    ulText.innerHTML = ulText.innerHTML +  `<li> Location: ${birdOutputArray[i]['locName']}</li> <li> Last Seen: ${birdOutputArray[i]['obsDt']}</li> <li> Latitude: ${birdOutputArray[i]['lat']}</li> <li> Longitude: ${birdOutputArray[i]['lng']}</li><br>`;
  }
  console.log('ul');
  console.log(ulText.innerHTML);
  oldOutputDiv.prepend(pTag);
  oldOutputDiv.append(ulText);
  let mapDiv = document.querySelector('div#map');
  mapDiv.append(oldOutputDiv);
}

function printError(error) {
  removeAutoDropDown();
  const errorMessage = document.querySelector('#error');
  errorMessage.removeAttribute("class");
  errorMessage.innerText = error;
}

function getSpeciesCode(birdNameInput) {
  let targetBird = birds.find(birdObject => birdObject.comName === `${birdNameInput}`);

  if (typeof targetBird === "undefined") {
    clearResults();
    const errorMessage = `Oops , we don't have "${birdNameInput}" as a common bird name. Please try again.`;
    printError(errorMessage);
  } else {
    return targetBird.speciesCode;
  }
}

function clearResults() {
    let element =  document.getElementById("outputDisplay");
  if (typeof(element) !== 'undefined' && element !== null) {
  let outputDiv = document.getElementById("outputDisplay");
  outputDiv.parentNode.removeChild(outputDiv);
    }
  }


function handleFormSubmission(event) {
  event.preventDefault();
  const birdNameInput = document.querySelector('#birdName-input').value;
  document.querySelector('#birdName-input').value = null;
  let speciesCode = getSpeciesCode(birdNameInput);
  if (typeof speciesCode !== "undefined") {
  GeoCall.geoGrab('ip', '')
    .then(function (location) {
      console.log('location')
      console.log(location);
      //console.log(locationResult['lat']);
      getAPIData(speciesCode, location);
    });
  }

  //This is where we will need to call google map and full eBird APIs
  //maybe we can make separate calls, one possible option is below
  // 1.latLang = getlanLat();
  // 2. birdlocation = getBirdInfo( speciesCode, latLang)
  // 3. display(birdLocation, Latlang)
  // 4. other stretch goals

}

birdNameInputElement.addEventListener("input", onKeyInputChange);

window.addEventListener("load", () => {
  document.getElementById('button').addEventListener("click", handleFormSubmission);
  getAPIData();
});


/*function getLatLong() {
  let radioBtnVal = 'manual';

  GeoCall.geoGrab(radioBtnVal, 'portland-oregon')
    .then(function(geoResponse) {
      if (geoResponse instanceof Error) {
        const errorMessage = `There was a problem accessing the geo data from google map API,
        Status code: ${geoResponse.message}`;
        throw new Error(errorMessage);
      }
        if (radioBtnVal === 'ip') {
          location = [geoResponse['location']['lat'], geoResponse['location']['lng']];
        } else if (radioBtnVal === 'manual') {
          location = geoResponse.results[0].geometry.location;
        }
    })
    .catch(function(error) {
      printError(error);
    });
}*/


/*function onKeyInputChange() {

  removeAutoDropDown ();
  const filteredBirdNames = [];
  const value = birdNameInputElement.value.toLowerCase();

  if(value.lenght === 0) {
    return;
  }

  if(value.length > 2) {

    birdNames.forEach((birdName) => {
      if(birdName.toLowerCase().includes(value)) {
        filteredBirdNames.push(birdName);
      }
    });
  }

  createAutoCompleteDropDown(filteredBirdNames);
}*/


//birdNameInputElement.addEventListener("input", onKeyInputChange);


/*function loadData(data,element) {
  if (data) {
    element.innerHTML = "";
    let innerElement = "";

    data.forEach((item)=> {
      innerElement +=
      `<li>${item}</li>`;
    });
    element.innerHTML = innerElement;
  }
}*/

/*
function filterData(data, searchText) { 
  const regExp = new RegExp(`${searchText.toLowerCase()}`);
  return data.filter((x) => x.toLowerCase().match(regExp));
}*/


/*
function getAPIData(comNameInput) {
  BirdTrackerService.getSpeciescode()
    .then(function(birdTrackerResponse) {
      if (birdTrackerResponse instanceof Error) {
        const errorMessage = `There was a problem accessing the bird data from eBird API,
        Status code: ${birdTrackerResponse.message}`;
        throw new Error(errorMessage);
      }
      let searchResultIndex= [] ;
      const regExp = new RegExp(`${comNameInput}`);

      //for loop to search 
      for (let i = 0; i < birdTrackerResponse.length; i++) {
        if(birdTrackerResponse[i].comName.toString().toLowerCase().match(regExp)) {
          searchResultIndex.push(i);
          }
        if(searchResultIndex.length === 11) {
            break;
        } 
      } // end of for loop

      // checking how matches has been found
      if(searchResultIndex.length === 1){
        console.log(birdTrackerResponse[searchResultIndex[0]].speciesCode);
        return birdTrackerResponse[searchResultIndex[0]].speciesCode ;

      } else if (searchResultIndex.length > 11) {
        console.log("Your search result was too broad,please provide a more specific common name.");
        return searchResultIndex.length;

      } else if (searchResultIndex.length <=11 && searchResultIndex.length !== 0) {
          for(const element of searchResultIndex) {
            console.log(birdTrackerResponse[element].comName +" "+ birdTrackerResponse[element].speciesCode);
          }
        return searchResultIndex[0];  

      } else {
        console.log( "SpeciesCode was not found for " + comNameInput + " " + searchResultIndex.length);
        return null;
      }                  
    })
    .catch(function(error) {
      console.log(error);
    });
}

let commonName = "Red-winged";*/





/*if(birdTrackerResponse[i].comName.toString().toLowerCase() === comNameInput.toLowerCase()) {
  console.log(birdTrackerResponse[i].speciesCode);
  return birdTrackerResponse[i].speciesCode;
}*/

/*function printWeather(description, city) {
  document.querySelector('#weather-description').innerText = `The weather in ${city} is ${description}.`;
}

function printError(error) {
  document.querySelector('#error').innerText = error;
}*/
/*
function getAPIDataII(speciesCode,location) {
  WeatherService.getbirInfo(speciesCode)
    .then(function(birdInfoResponse){
      if (birdInfoResponse instanceof Error) {
        const errorMessage = `There was a problem accessing the bird data from the ebird API for ${speciesCode}:
        status code: ${birdInfoResponse.message}`;
        throw new Error(errorMessage);
      }
      const birdInfo = birdInfoResponse;
      return GiphyService.getGif(description);
    })
    .then(function(giphyResponse) {
      if (giphyResponse instanceof Error) {
        const errorMessage = `there was a problem accessing the gif data from Giphy API:
        ${giphyResponse.response}.`;
        throw new Error(errorMessage);
      }
      displayGif(giphyResponse, city);
    })
    .catch(function(error) {
      printError(error);
    });
}*/
