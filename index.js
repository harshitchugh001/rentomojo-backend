const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
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

// Middleware to allow specific origin
const allowSpecificOrigin = (origin, callback) => {
  const allowedOrigin = 'https://glistening-manatee-1be664.netlify.app';

  if (!origin || origin === allowedOrigin) {
    callback(null, { origin: true });
  } else {
    callback(new Error('Forbidden: Access denied for this origin'));
  }
};

// app middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors({ origin: allowSpecificOrigin }));

// routes
app.use('/api', (req, res, next) => {
  // For authenticated routes
  // Check for specific URL origin before allowing access
  allowSpecificOrigin(req.headers.origin, (err, options) => {
    if (err || !options.origin) {
      res.status(403).json({ error: 'Forbidden: Access denied for this origin' });
    } else {
      // Move to the next middleware
      next();
    }
  });
}, authRoutes);

app.use('/api', (req, res, next) => {
  // For comment routes
  // Check for specific URL origin before allowing access
  allowSpecificOrigin(req.headers.origin, (err, options) => {
    if (err || !options.origin) {
      res.status(403).json({ error: 'Forbidden: Access denied for this origin' });
    } else {
      // Move to the next middleware
      next();
    }
  });
}, commentRoutes);

app.use('/api', (req, res, next) => {
  // For nested comment routes
  // Check for specific URL origin before allowing access
  allowSpecificOrigin(req.headers.origin, (err, options) => {
    if (err || !options.origin) {
      res.status(403).json({ error: 'Forbidden: Access denied for this origin' });
    } else {
      // Move to the next middleware
      next();
    }
  });
}, nestedCommentRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});

module.exports = app;

