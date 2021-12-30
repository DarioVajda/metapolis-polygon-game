
var money = 0;

function setMoneyValue(value) {
    money = value;
}

function getMoneyValue() {
    return money;
}

function changeMoneyValue(value) {
    money += value;
}

exports.getMoneyValue = getMoneyValue;
exports.setMoneyValue = setMoneyValue;
exports.changeMoneyValue = changeMoneyValue;