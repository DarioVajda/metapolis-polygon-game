const puppeteer = require('puppeteer');

const delay = async (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
}

const saveImage = async (data, id, { resolution } = {}) => {
    resolution = resolution || 800;
    data = JSON.stringify(data);

    console.log({resolution});
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({
        height: resolution,
        width: resolution
    });

    await page.goto(`http://localhost:3000/preview?data=${data}`);

    // page.focus('input');
    // await page.type('input', 'Ovo sam ukucao koristeci node.js program');

    await delay(5000);

    const res = await page.screenshot({path: `../test/images/city_${id}.png`});
    console.log(res);

    await browser.close();

    return res;
}

// const resolution = 1000;
// let dataStr = '{"buildings":[{"start":{"x":2,"y":8},"end":{"x":2,"y":8},"type":"house","level":0,"orientation":2,"id":0},{"start":{"x":8,"y":9},"end":{"x":8,"y":9},"type":"house","level":0,"orientation":2,"id":1},{"start":{"x":18,"y":16},"end":{"x":18,"y":16},"type":"house","level":0,"orientation":4,"id":2},{"start":{"x":0,"y":1},"end":{"x":1,"y":2},"type":"building","level":0,"orientation":1,"id":3},{"start":{"x":11,"y":1},"end":{"x":12,"y":4},"type":"factory","level":0,"orientation":1,"id":4},{"start":{"x":13,"y":11},"end":{"x":14,"y":12},"type":"office","level":0,"orientation":3,"id":5},{"start":{"x":10,"y":12},"end":{"x":10,"y":12},"type":"store","level":0,"orientation":2,"id":6},{"start":{"x":10,"y":17},"end":{"x":10,"y":17},"type":"store","level":0,"orientation":2,"id":7},{"start":{"x":0,"y":0},"end":{"x":0,"y":0},"type":"house","level":0,"orientation":3,"id":10},{"start":{"x":11,"y":14},"end":{"x":14,"y":17},"type":"park","level":0,"orientation":4,"id":9}],"specialBuildings":[{"start":{"x":17,"y":1},"end":{"x":17,"y":1},"type":"statue","orientation":4,"id":0},{"start":{"x":12,"y":6},"end":{"x":12,"y":7},"type":"fountain","orientation":3,"id":1}],"specialBuildingCash":[],"money":130000,"owner":"0x764cDA7eccc6a94C157742e369b3533D15d047c0","incomesReceived":0,"created":true,"initialized":true,"theme":0,"buildingId":{"type":"BigNumber","hex":"0x0b"},"specialBuildingId":{"type":"BigNumber","hex":"0x02"},"normal":16,"educated":14,"normalWorkers":70,"educatedWorkers":40,"achievementList":[{"key":"greenCity","count":0,"completed":false},{"key":"educatedCity","count":0,"completed":false},{"key":"skyCity","count":0,"completed":false},{"key":"highEducation","count":0,"completed":false},{"key":"check4","count":0,"completed":false}],"income":394256,"score":2889792}'
// let dataObj = JSON.parse(dataStr);
// console.log(dataObj);
// saveImage(dataObj, { resolution });

exports.saveImage = saveImage;