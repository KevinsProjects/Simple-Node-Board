
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');


const serverConfigs = require('./config/serverConfig');


mongoose.connect(serverConfigs.DBURL);


const app = express();


require('./backend/express')(app, serverConfigs);


app.listen(serverConfigs.PORT, (error) => {
  if (error) throw error;
  console.log('Server running on port: ' + serverConfigs.PORT);
});
