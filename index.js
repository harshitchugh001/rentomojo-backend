const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
require('dotenv').config();

const app = express();

// connect to db
mongoose.set('strictQuery', true);
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB Connected"));



mongoose.connection.on("error", err => {
    console.log(`DB connection error: ${err.message}`);
});

// import routes
const authRoutes = require('./routes/auth');
const commentRoutes = require('./routes/comment');
const nestedCommentRoutes = require('./routes/nestedcomments');

const allowSpecificOrigin = (req, res, next) => {
  const allowedOrigin = 'https://glistening-manatee-1be664.netlify.app/';
  const requestOrigin = req.headers.origin;

  if (requestOrigin === allowedOrigin) {
    
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Access denied for this origin' });
  }
};


app.get('/', (req, res) => {
    res.send('Hello from Node API');
});

// app middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
// app.use(allowSpecificOrigin);
app.use(cors(allowSpecifiedOrigin)); 


// middleware
app.use('/api', authRoutes);
app.use('/api', commentRoutes);
app.use('/api', nestedCommentRoutes);


const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`API is running on port ${port}`);
});

module.exports = app

