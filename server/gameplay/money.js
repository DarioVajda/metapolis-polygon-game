
var money = 100000000000;

function setMoneyValue(value) {
    money = value;
}

function getMoneyValue() {
    return money;
}

function changeMoneyValue(value) {
    if(money + value < 0) {
        return false;
    }
  
    money += value;
    return true;
} // ako se ne oduzima veca kolicina novda od onoga koliko ima osoba onda se vrati "false" da bi program znao da je doslo do greske

exports.getMoneyValue = getMoneyValue;
exports.setMoneyValue = setMoneyValue;
exports.changeMoneyValue = changeMoneyValue;