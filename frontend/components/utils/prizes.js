const price = 0.1;

const prizes = [
    {
        min: 100,
        list: [
            { start: 1, end: 1, prize: 10 },
            { start: 2, end: 10, prize: 3 },
            { start: 11, end: 20, prize: 1 }
        ]
    },
    {
        min: 500,
        list: [
            { start: 1, end: 1, prize: 20 },
            { start: 2, end: 5, prize: 10 },
            { start: 6, end: 20, prize: 5 },
            { start: 21, end: 50, prize: 3 },
            { start: 51, end: 150, prize: 1 }
        ]
    },
    {
        min: 2500,
        list: [
            { start: 1, end: 1, prize: 40 },
            { start: 2, end: 50, prize: 8 },
            { start: 51, end: 100, prize: 5 },
            { start: 101, end: 200, prize: 3 },
            { start: 201, end: 750, prize: 1 }
        ]
    },
    {
        min: 5000,
        list: [
            { start: 1, end: 1, prize: 60 },
            { start: 2, end: 50, prize: 10 },
            { start: 51, end: 100, prize: 5 },
            { start: 101, end: 200, prize: 2 },
            { start: 201, end: 1500, prize: 1 },
        ]
    },
    {
        min: 10000,
        list: [
            { start: 1, end: 1, prize: 100 },
            { start: 2, end: 50, prize: 20 },
            { start: 51, end: 100, prize: 8 },
            { start: 101, end: 200, prize: 5 },
            { start: 201, end: 1000, prize: 2 },
            { start: 1001, end: 2500, prize: 1 },
        ]
    },
];

function getRange(nfts, index) {
    nfts *= 100; // ovo treba kasnije da se ukloni!!!
    
    if(nfts < prizes[0].min) return { start: 0, end: 0, prize: 0 }

    let stage = 0;
    for(let i = 0; i < prizes.length; i++) {
        if(prizes[stage].min <= nfts) {
            stage += 1;
        }
        else {
            break;
        }
    }
    stage -= 1;
    if(stage === -1) return { start: 0, end: 0, prize: 0 }
    
    let list = prizes[stage].list;
    let res = 0;
    for(let i = 0; i < list.length; i++) {
        if(list[res].start <= index) {
            res += 1;
        }
        else {
            break;
        }
    }
    return list[res-1];
}

export {
    price,
    prizes,
    getRange
};