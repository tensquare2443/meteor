const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../client');
var app = express();
var port = process.env.PORT || 3000;
var sass = require('node-sass');

app.use(express.static(publicPath));

// sass.render({
//   file: './../client/style.scss'
// }, function(err, result) {
//   console.log('sass done');
// });

app.listen(port, () => {
  console.log(`Server live on ${port}.`);
});
