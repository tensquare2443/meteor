const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../client');
var app = express();
var port = process.env.PORT || 3000;
var sass = require('node-sass');

app.use(express.static(publicPath));

app.listen(port, () => {
  console.log(`Server live on ${port}.`);
});
