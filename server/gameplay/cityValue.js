const buildingStats = require('./building_stats.js');


/**
 * @dev Function that calculates the total value of the city
 * @param {{ buildings: Building[], specialBuildings: SpecialBuilding[], money: Number }} city data about the city (can send the response from the /data endpoint)
 * @param {{ type: { offer: {}[], count: Number, soldOut: Boolean, rarity: Number }}} specialTypeData data about all the special buildings, offers, etc.
 * @returns {Number} total value of the city
 */
function cityValue(city, specialTypeData) {
    if(!city) return 0;

    let value = 0;

    city.buildings.forEach((element) => {
        let elementValue = buildingStats.buildingStats
            .get(element.type) // dobija se lista levela i podataka o levelima
            .slice(0, element.level+1) // u obzir se uzimaju trenutni level i svi manji
            .reduce((sum, curr) => sum + curr.cost, 0) // sabira se cena svih dosadasnjih levela zajedno
        
        if(element.type == buildingStats.buildingTypes.Building) {
            elementValue *= (element.end.x - element.start.x + 1) * (element.end.y - element.start.y + 1);
        }

        value += elementValue;
    })

    city.specialBuildings.forEach((element) => {
        let tempValue;
        let offerIndex = -1;
        if(specialTypeData && specialTypeData[element.type].soldOut === true) {
            specialTypeData[element.type].offers.forEach((offer, index) => {
                if(offer.filled === false) {
                    if(offerIndex === -1 || offer.value > specialTypeData[element.type].offers[offerIndex].value) {
                        offerIndex = index;
                    }
                }
            })
            tempValue = specialTypeData[element.type].offers[offerIndex].value;
        }
        if(offerIndex === -1) {
            tempValue = buildingStats.specialPrices.get(element.type);
        }
        value += tempValue;
    })

    return value + city.money;
}

// console.log(cityValue({ buildings: JSON.parse('[{"start":{"x":2,"y":8},"end":{"x":2,"y":8},"type":"house","level":0,"orientation":2,"id":0},{"start":{"x":8,"y":9},"end":{"x":8,"y":9},"type":"house","level":0,"orientation":2,"id":1},{"start":{"x":18,"y":16},"end":{"x":18,"y":16},"type":"house","level":0,"orientation":4,"id":2},{"start":{"x":0,"y":1},"end":{"x":1,"y":2},"type":"building","level":0,"orientation":1,"id":3},{"start":{"x":11,"y":1},"end":{"x":12,"y":4},"type":"factory","level":0,"orientation":1,"id":4},{"start":{"x":13,"y":11},"end":{"x":14,"y":12},"type":"office","level":0,"orientation":3,"id":5},{"start":{"x":10,"y":12},"end":{"x":10,"y":12},"type":"store","level":0,"orientation":2,"id":6},{"start":{"x":10,"y":17},"end":{"x":10,"y":17},"type":"store","level":0,"orientation":2,"id":7},{"start":{"x":0,"y":0},"end":{"x":0,"y":0},"type":"house","level":0,"orientation":3,"id":10},{"start":{"x":11,"y":14},"end":{"x":14,"y":17},"type":"park","level":0,"orientation":4,"id":9}]') }))

exports.cityValue = cityValue