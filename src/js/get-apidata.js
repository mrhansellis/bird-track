import { BirdTrackerService } from '../service/bird-track-service.js';
//import { BirdLocationService } from './services/bird-location-service.js';
import GeoCall  from './js/services/geoCall.js';

let birdNames = [];
const birdNameInputElement = document.querySelector("#birdName-input");

export default function getAPIData(url) {
  BirdTrackerService.getSpeciescode(url)
    .then(function(birdTrackerResponse) {
      if (birdTrackerResponse instanceof Error) {
        const errorMessage = `There was a problem accessing the bird data from eBird API,
        Status code: ${birdTrackerResponse.message}`;
        throw new Error(errorMessage);
      }
      birdNames = birdTrackerResponse.map((bird) => {
        return bird.comName;
      });
      birdNames.sort();            
    })
    .catch(function(error) {
      printError(error);
    });
}

function onKeyInputChange() {
  
  removeAutoDropDown ();
  const filteredBirdNames = [];
  const value = birdNameInputElement.value.toLowerCase();

  if(value.length === 0) {
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
  if(listElement) listElement.remove();
}

function onBirdButtonClick(e) {
  e.preventDefault();
  const buttonE1 = e.target;
  birdNameInputElement.value = buttonE1.innerHTML;
  removeAutoDropDown();
}

function printError(error) {
  document.querySelector('#error').innerText = error;
}

birdNameInputElement.addEventListener("input", onKeyInputChange);

getAPIData();
GeoCall.geoGrab('manual', 'portland-oregon');

/*export function getAPIData(comNameInput) {
  return BirdTrackerService.getSpeciescode()
    .then(function(birdTrackerResponse) {
      if (birdTrackerResponse instanceof Error) {
        const errorMessage = `There was a problem accessing the bird data from eBird API,
        Status code: ${birdTrackerResponse.message}`;
        throw new Error(errorMessage);
      }
      
      let searchResultIndex= [] ;
      const regExp = new RegExp(`${comNameInput}`);
      
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
        return birdTrackerResponse[searchResultIndex[0]].speciesCode;

      } else if (searchResultIndex.length > 11) {
        return "Your search result was too broad, please provide a more specific common name.";

      } else if (searchResultIndex.length <=11 && searchResultIndex.length !== 0) {
          const results = searchResultIndex.map((index) => {
            return `${birdTrackerResponse[index].comName} ${birdTrackerResponse[index].speciesCode}`;
          });
          return  Promise.resolve(results);
        }

       else {
        console.log( "SpeciesCode was not found for " + comNameInput + " " + searchResultIndex.length);
        return null;
      }                  
    })
    .catch(function(error) {
      console.log(error);
    });
}

export function getBirdLocation(speciesCodeConv)  {
  BirdLocationService.getBirdLocation(speciesCodeConv)
  .then(function(birdTrackerResponse) {
    if (birdTrackerResponse instanceof Error) {
      const errorMessage = `There was a problem accessing the bird data from eBird API,
      Status code: ${birdTrackerResponse.message}`;
      throw new Error(errorMessage);
    }
  })
  .catch(function(error)  {
    console.log(error);
  });
}*/