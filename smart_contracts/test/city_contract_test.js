const CityContract = artifacts.require("CityContract");

contract("CityContract", accounts => {
    if(true) it("uspesno mintovano nekoliko tokena", async () => {
        let minting = 5;
        let instance = await CityContract.deployed();
        await instance.flipSaleState();
        await instance.safeMint(minting, {value: minting * web3.utils.toWei('0.1', 'ether'), from: accounts[1]});

        let supply = await instance.tokenSupply();
        assert.equal(minting == supply, true);
    })

    if(false) it("uspesno izvucene adrese igraca", async () => {
        let instance = await CityContract.deployed();

        await instance.safeMint(2, {value: web3.utils.toWei('0.2', 'ether'), from: accounts[2]});
        await instance.safeMint(5, {value: web3.utils.toWei('0.5', 'ether'), from: accounts[3]});

        let owners = await instance.getOwners();
        let expectedOwners = [
            accounts[1],
            accounts[1],
            accounts[1],
            accounts[1],
            accounts[1],
            accounts[2],
            accounts[2],
            accounts[3],
            accounts[3],
            accounts[3],
            accounts[3],
            accounts[3],
        ];

        let success = true;
        for(let i = 0; i < 10; i++) {
            if(owners[i] != expectedOwners[i]) {
                success = false;
            }
        }
        assert.equal(success, true);
    })

    if(false) it("uspesno izvuceni podaci o zaradi", async () => {
        let instance = await CityContract.deployed();
        let income = await instance.cityIncome(0);
        assert.equal(income, 1);
    })
})