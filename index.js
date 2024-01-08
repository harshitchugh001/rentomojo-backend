const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// connect to db
mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch(err => console.error('DB Connection Error:', err));

mongoose.connection.on("error", err => {
  console.error(`DB connection error: ${err.message}`);
});

// import routes
const authRoutes = require('./routes/auth');
const commentRoutes = require('./routes/comment');
const nestedCommentRoutes = require('./routes/nestedcomments');

// app middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

// Middleware to allow specific origin
const allowSpecificOrigin = (req, res, next) => {
  const allowedOrigin = 'https://glistening-manatee-1be664.netlify.app';
  const requestOrigin = req.headers.origin;

  if (requestOrigin === allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST'); // Add other allowed methods here
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Access denied for this origin' });
  }
};

// routes
app.get('/', (req, res) => {
  res.send('Hello from Node API');
});

app.use('/api', allowSpecificOrigin, authRoutes);
app.use('/api', allowSpecificOrigin, commentRoutes);
app.use('/api', allowSpecificOrigin, nestedCommentRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});

module.exports = app;
