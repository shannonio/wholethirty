var gzippo = require('gzippo');
var express = require('express');
var morgan = require('morgan');
var logger = morgan('combined')
var app = express();

// app.use(logger('dev'));
app.use(gzippo.staticGzip("" + __dirname + "/dist"));
app.listen(process.env.PORT || 5000);
