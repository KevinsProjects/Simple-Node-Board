/**
 * module dependencies for express configuration
 */
const passport = require('passport');
const morgan = require('morgan');
const compress = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');


const expressConfig = (app, serverConfigs) => {


  app.use(compress());

  // log server requests
  !serverConfigs.PRODUCTION && app.use(morgan('dev'));

  // get data from html forms
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // read cookies (should be above session)
  app.use(cookieParser());


  app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'secret',
    store: new mongoStore({
      url: serverConfigs.DBURL,
      collection : 'sessions',
    }),
  }));


  app.use(passport.initialize());
  app.use(passport.session());


  require('./passport')(app);


  app.use(flash());


  if (!serverConfigs.PRODUCTION) {
    require('./dev')(app);
  }


  require('./routes')(app);
};

module.exports = expressConfig;
