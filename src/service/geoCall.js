export default class GeoCall {
  static geoGrab() {
  const url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.MAPS_KEY}`
  fetch(url , {
    method: "POST"
    })
    .then((response) => {
      if(!response.ok) {
        const errorMessage = `${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      } else {
        return response.json();
      }
      })
      .catch((error) => {
        return error;
      })
      .then((location) => {
        console.log(location);
        return location;
      });
  }
}

