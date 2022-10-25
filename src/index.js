import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './js/species-code.js';
import SpeciesCode from './js/species-code.js';

let commonName = "common ostrich";
let species1 = new SpeciesCode();
console.log(species1.getSpeciesCode(commonName.toUpperCase()));