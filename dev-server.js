require('babel-core/register');
require("babel-polyfill");

var path = require('path')
var express = require('express');
var webpack = require('webpack');

var config = require('./webpack.config.js');

var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static('dist'));
require('./server')(app);

// app.get('*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'src/index.dev.html'))
// });


var devPort = 9533;
app.listen(devPort, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:' + devPort);
});

