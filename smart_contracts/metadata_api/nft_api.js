const express = require("express");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/players/:id/", (req, res) => {
    res.json({
        name: `City ${req.params.id}`,
        description: "This is an image of a city that it's owners built",
        image: `http://localhost:3000/players/${req.params.id}/city-image.jpg`,
        external_url: `https://docs.openzeppelin.com/contracts/4.x/erc721`
    });
});

app.get("/players/:id/city-image.jpg", (req, res) => {
    res.sendFile('C:/Users/Dario Vajda/OneDrive/Desktop/nft project/nft/smart_contracts/metadata_api/cityImage.jpeg');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`)); 