const buildingMenuTypes = {
    // #region normal buildings
    house: {
        name: 'House',
        description: 'House is a home for a smaller number of people. Higher percentage of them are educated and everyone gets a significant productivity boost from living in a house.',
        properties: [ 'people', 'boost' ],
    },
    building: {
        name: 'Building',
        description: 'A building is home for a large number of people. Most of the people are not educated and seek easier jobs with a lower pay.',
        properties: [ 'people' ],
    },
    factory: {
        name: 'Factory',
        description: 'Factories offer a large number of workplaces, mostly physical jobs for uneducated people and also has place for some educated office workers. Big factories cause air polution which has a noticable effect on the productivity of people who live nearby.',
        properties: [ 'workplaces', 'decrease' ],
    },
    office: {
        name: 'Office',
        description: 'Most of the educated people work in offices. They are eco-conscious and do not negatively affect the quality of life for the people nearby.',
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
        description: 'Stores are necessary in every city. If people do not have a store nearby, that will have an negative effect on their productivity. A normal store can satisfy everyone in a 2 square radius. There are also a few people who work in every normal store',
        properties: [ 'workplaces', 'decrease' ],
    },
    supermarket: {
        name: 'Supermarket',
        description: 'Stores are necessary in every city. If people do not have a store nearby, that will have an negative effect on their productivity. A supermarket can satisfy everyone in a 3 square radius. There are also a few people who work in every supermarket',
        properties: [ 'workplaces', 'decrease' ],
    },
    park: {
        name: 'Park',
        description: 'People love living near parks, they also produce oxygen and this results in a significant productivity boost. The range in which a park has an effect is determined by its size.',
        properties: [ 'boost' ],
    },
    gym: {
        name: 'Gym',
        description: 'People have to stay in shape and that is why gyms exist. Their presence boosts the productivity of people nearby. There are also a few people who work in every gym.',
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