/**
 * module dependencies for routes configuration
 */
const path = require('path');
const express = require('express');

const userAPI = require('./entities/user/api');
const forumAPI = require('./entities/forum/api');
const discussionAPI = require('./entities/discussion/api');
const opinionAPI = require('./entities/opinion/api');
const adminAPI = require('./entities/admin/api');


const routesConfig = (app) => {
  // serves static files from public directory
  const publicPath = path.resolve(__dirname, '../public');
  app.use(express.static(publicPath));

  
  app.get('/api', (req, res) => {
    res.send('Hello from API endpoint');
  });


  userAPI(app);


  forumAPI(app);


  discussionAPI(app);


  opinionAPI(app);


  adminAPI(app);

  // all get request will send index.html for react-router
  // to handle the route request
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
  });
};

module.exports = routesConfig;
