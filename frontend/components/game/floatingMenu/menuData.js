const buildingMenuTypes = {
    // #region normal buildings
    house: {
        name: 'House',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        properties: [ 'people', 'boost' ],
    },
    building: {
        name: 'Building',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        properties: [ 'people' ],
    },
    factory: {
        name: 'Factory',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        properties: [ 'workplaces', 'decrease' ],
    },
    office: {
        name: 'Office',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        properties: [ 'workplaces' ],
    },
    restaurant: {
        name: 'Restaurant',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        properties: [ 'workplaces', 'boost', 'income' ],
    },
    parking: {
        name: 'Parking',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        properties: [ ],
    },
    store: {
        name: 'Store',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        properties: [ 'workplaces', 'decrease' ],
    },
    supermarket: {
        name: 'Supermarket',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        properties: [ 'workplaces', 'decrease' ],
    },
    park: {
        name: 'Park',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        properties: [ 'boost' ],
    },
    gym: {
        name: 'Gym',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        properties: [ 'workplaces', 'boost' ],
    },
    // #endregion

    // #region special buildings
    statue: {
        name: 'Statue',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        special: true,
    },
    fountain: {
        name: 'Fountain',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        special: true,
    },
    stadium: {
        name: 'Stadium',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        special: true,
    },
    school: {
        name: 'School',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        special: true,
    },
    shoppingmall: {
        name: 'Shoppingmall',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        special: true,
    },
    promenade: {
        name: 'Promenade',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        special: true,
    },
    townhall: {
        name: 'Townhall',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        special: true,
    },
    // #endregion
}

export { buildingMenuTypes };