export default class GeoCall {
  static geoGrab(radioBtnVal, radioManualTxt) {
//in HMTL set up radio buttons for 'automatically grab location from IP' and 'manually enter location'
// radioBtnVal is the users selection gathered in index.js via a css selector on the radio button portion of the form
//when the button is checked to manual, a text input field appears and whatever is entered is passed here as radioManualTxt
// in HTML radio
//in geograb call on index.js pass this checked radio button value as either 'ip' or 'manual'
    let url;
    if (radioBtnVal === 'ip') {
      url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.MAPS_KEY}`;
    } else if (radioBtnVal === 'manual') {
      const userAddressApiArg = radioManualTxt.split(' ').join('-');
      url = `https://maps.googleapis.com/maps/api/geocode/json?address=${userAddressApiArg}&key=${process.env.MAPS_KEY}`;
    } else {
      //an error if the user manages to break the radio button binary choice
    }

    return fetch(url, {
      method: "POST"
    })
    .then((response) => {
      if (!response.ok) {
        const errorMessage = `${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      } else {
        const jsonResponse = response.json();
        return jsonResponse;
      }
    })
      
    .then((jsonResponse) => {
    let location;
    if (radioBtnVal === 'ip') {
      location = [jsonResponse['location']['lat'], jsonResponse['location']['lng']];
    } else if (radioBtnVal === 'manual') {
      location = [jsonResponse.results[0].geometry.location.lat, jsonResponse.results[0].geometry.location.lng];
    }
    return location;
  })

    .catch((error) => {
      return error;
    })
    .then((location) => {
      return location;
    });
  }
}