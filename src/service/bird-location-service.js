export class BirdLocationService {
  static getBirdLocation(speciesCodeConv) {
    return fetch(`https://api.ebird.org/v2/data/obs/recent/${speciesCodeConv}?lat=45&lng=122&${process.env.API_KEY}&back=30`)
    .then(function(response)  {
      if (!response.ok) {
        const errorMessage = `${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      } else {
        return response.json();
      }
    })
    .catch(function(error)  {
      return error;
    })
  }
}