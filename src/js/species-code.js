export default class SpeciesCode {
  constructor(commonName)   {
    this.commonName = commonName;
    this.species = speciesCodeArray;
  }

  getSpeciesCode(commonName) {
    let codeFlag = "";

    for (let i = 0; i < this.species.length; i++) {
      if  (commonName === this.species[i].PRIMARY_COM_NAME) {
        codeFlag = this.species[i].SPECIES_CODE;
        return codeFlag;
      } else  return "No match";
    }
  }
}
