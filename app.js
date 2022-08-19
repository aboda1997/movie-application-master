const express = require('express')
const dateFormat = require('date-format');
const morgan = require('morgan');
const config = require("./config");
const app = express();
const moviesRouter = require("./src");

const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDoc = YAML.load('./api-docs/swagger.yaml');

const logger = (req,res  , next )=>{
  console.log(`logger ${req.url} -- ${req.method} -- ${new Date()} `);
  next()  
} 
app.use(logger ) 

morgan.token('time', () => dateFormat.asString(dateFormat.ISO8601_FORMAT, new Date())); // Both morgan and log4js are configured to same date format, so that log reading is meaningful and not confusing due to different date formats
app.use(morgan('[:time] :remote-addr :method :url :status :res[content-length] :response-time ms'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/movies", moviesRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use((req,  res ,  next)=>{
   res.status(400).send('Resources Not found')
}) 
const server = app.listen(config.PORT, () => {
  console.log('Listening on port', config.PORT);
});

module.exports = server;