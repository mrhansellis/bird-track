export default class BirdTrackerService {
  static getSpeciescode(speciesCde= "",location = "") {
    let url;
    if(speciesCde === "" && location === "" ) {
     url = "https://api.ebird.org/v2/ref/taxonomy/ebird?fmt=json";
    } else {
      url = `https://api.ebird.org/v2/data/obs/geo/recent/${speciesCde}?lat=${location[0]}&lng=${location[1]}&key=${process.env.EBIRD_KEY}&back=30`;
    }

    return fetch(`${url}`)
      .then(function(response) {
        if (!response.ok) {
          const errorMessage = `${response.status} ${response.statusText}`;
          throw new Error(errorMessage);
        } else {
          return response.json();
        }
      })
      .catch(function(error) {
        return error; 
      });
  }
}