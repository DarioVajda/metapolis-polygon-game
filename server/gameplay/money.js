
var money = 0; // ovo ce trebati da se cuva u nekakvoj bazi podataka

function setMoneyValue(value) {
    money = value;
} // ova funkcija se nigde ne koristi ali postoji pa ako nekad bude trebala tu je

function getMoneyValue() {
    return money;
} // funkcija koja vraca kolicinu novca u igrici

function changeMoneyValue(value) {
    if(money + value < 0) {
        return false;
    }
  
    money += value;
    return true;
} // ako se ne oduzima veca kolicina novca od onoga koliko ima osoba onda se vrati "false" 
// da bi program znao da igrac ima dovoljno novca da uradi ono sto je hteo

exports.getMoneyValue = getMoneyValue;
exports.setMoneyValue = setMoneyValue;
exports.changeMoneyValue = changeMoneyValue;