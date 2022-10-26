export class BirdTrackerService {
  static getSpeciescode() {
    return fetch(`https://api.ebird.org/v2/ref/taxonomy/ebird?fmt=json`)
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