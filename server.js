const express = require('express'); // importing a CommonJS module
const helmet = require('helmet'); // importing helmet security middlware
const morgan = require('morgan')

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

const dateLogger = (req, res, next) => {
  console.log(new Date().toISOString());
 
  next()
}

const loggerMethod = (req, res, next) => {
  console.log(`[${req.method} and ${req.url}]` );
  next()
}

const gateKeeper = (req, res, next) => {
  const password = req.headers.password;
  
  if(password === '') {
    res.status(400).json({message: 'please provide a password'})
  }
  else if(password.toLowerCase() === 'mellon') {
    next();

  } else {
    res.status(401).json({you: 'cannot pass!!'})
  
 }
}

//global middleware

server.use(helmet()) //third-party middleware
server.use(express.json());
server.use(gateKeeper);
server.use(dateLogger) //custom middleware
server.use(loggerMethod) //custom middleware
server.use(morgan('dev'));
server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

module.exports = server;
