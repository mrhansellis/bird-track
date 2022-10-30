import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/styles.css";
import { getAPIData } from "./js/get-apidata";
getAPIData();
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