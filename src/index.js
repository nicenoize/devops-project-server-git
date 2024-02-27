require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('./db/mongoose');
const todoRoutes = require('./routes/todo-routes');
const userRoutes = require('./routes/user-routes');
const errorRoutes = require('./routes/error-routes');
const cookieParser = require('cookie-parser');
const { setupMetricsMiddleware } = require('./routes/metrics');

const app = express();
const port = process.env.PORT || 5000;
console.log('testlog');
try {
    console.log('Start setting up metrics middleware...');
    setupMetricsMiddleware(app);}
catch (error) {
    console.error('Error setting up metrics middleware:', error);
}

const corsOptions = {
    origin: process.env.CLIENT,
    credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
    },
}));

// Setup Prometheus metrics middleware

// Use the routes
app.use(todoRoutes);
app.use(userRoutes);
app.use(errorRoutes);

app.listen(port, () => {
    console.log(`ToDo server is up on port ${port}`);
});

module.exports = app;