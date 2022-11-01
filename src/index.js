import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import BirdTrackerService from './service/bird-track-service.js';
import  GeoCall from './service/geoCall.js';

//Business Logic

//Variables needed in more than one function
let birds = [];
let targetBirdInfo = [];
let locationResult= [];
const birdNameInputElement = document.querySelector("#birdName-input");

function getGeoApiData( radioBtnVal, radioManualTxt){
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
}

function getAPIData(speciesCde = "",location = "") {
  BirdTrackerService.getSpeciescode(speciesCde,location)
    .then(function(birdTrackerResponse) {
      if (birdTrackerResponse instanceof Error) {
        const errorMessage = `There was a problem accessing the bird data from eBird's API,
        Status Code: ${birdTrackerResponse.message}`;
        throw new Error(errorMessage);
      }
      if(speciesCde === "" && location == "") {
        birdTrackerResponse.forEach((bird,index) => {
          let birdObject = new Object();      
          birdObject.comName = bird.comName;
          birdObject.speciesCode = bird.speciesCode;
          birds[index] = birdObject;
        });
      } else {
        if(!birdTrackerResponse.length){
          let targetBird = birds.find(birdObject => birdObject.speciesCode ===`${speciesCde}`);
          const message = `There hasn't been any recent sighting of "${targetBird.comName}s". Maybe try another birdy.`;
          printError(message);
        } else {
          targetBirdInfo[0] = birdTrackerResponse[0].comName;
          targetBirdInfo[1] = birdTrackerResponse[0].sciName;

          birdTrackerResponse.forEach((bird,index) => {
            let birdObject = new Object();      
            birdObject.lat = bird.lat;
            birdObject.lng = bird.lng;
            targetBirdInfo[index + 2] = birdObject;
          });                
        } 
      }     
    })
    .catch(function(error) {
      printError(error);
    });
}


//UI Logic

function onKeyInputChange() {
  
  removeAutoDropDown ();
  const filteredBirdNames = [];
  const value = birdNameInputElement.value.toLowerCase();

  if(value.lenght === 0) {
    return;
  } 
  
  if(value.length > 2) {

    birds.forEach((bird,index) => {
      if(bird.comName.toLowerCase().includes(value)) {
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

function removeAutoDropDown () {
  const listElement = document.querySelector("#autocomplete-list");
  const errorMessage = document.querySelector("#error");

  if(listElement){
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

function printError(error) {
  removeAutoDropDown();
  const errorMessage = document.querySelector('#error');
  errorMessage.removeAttribute("class");
  errorMessage.innerText = error;
}

function getSpeciesCode(birdNameInput) {
  let targetBird = birds.find(birdObject => birdObject.comName ===`${birdNameInput}`);
  
  if (typeof targetBird === "undefined") {
    const errorMessage = `Oops , we don't have "${birdNameInput}" as a common bird name. Please try again.`;
    printError(errorMessage);
  } else {
  return targetBird.speciesCode;
  }
}

function handleFormSubmission(event) {
  
  event.preventDefault();
  const birdNameInput = document.querySelector('#birdName-input').value;
  document.querySelector('#birdName-input').value = null;
  let speciesCode = getSpeciesCode(birdNameInput);
  getGeoApiData('manual', 'Denver,CO');
  console.log(locationResult['lat']);
  getAPIData(speciesCode,locationResult);

  //This is where we will need to call google map and full eBird APIs
  //maybe we can make separate calls, one possible option is below
  // 1.latLang = getlanLat();
  // 2. birdlocation = getBirdInfo( speciesCode, latLang)
  // 3. display(birdLocation, Latlang)
  
}

birdNameInputElement.addEventListener("input", onKeyInputChange);

window.addEventListener("load", () => {
  document.querySelector('form').addEventListener("submit", handleFormSubmission);
  getAPIData();
});

/*import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
  apiKey: `${process.env.MAPS_KEY}`,
  version: "weekly"
});

/*loader.load().then(() => {
  //map = new google.maps.Map(document.getElementById('map'), {
  //center: { lat: -34.397, lng: 150.644 },
  zoom: 8,
  });
});*/