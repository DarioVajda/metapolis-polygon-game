const express = require('express');
const app = express();

app.set('view engine', 'ejs');

const index = require('./routes/index');
app.use('/', index);
const game = require('./routes/game');
app.use('/game', game);

app.listen(3000);