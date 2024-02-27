require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('./db/mongoose');
const todoRoutes = require('./routes/todo-routes');
const userRoutes = require('./routes/user-routes');
const errorRoutes = require('./routes/error-routes');
const cookieParser = require('cookie-parser');
const { setupMetricsMiddleware } = require('./metrics'); // Assuming your metrics setup is in a file named 'metrics.js'

const app = express();
const port = process.env.PORT || 5000;

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
setupMetricsMiddleware(app);

// Use the routes
app.use(todoRoutes);
app.use(userRoutes);
app.use(errorRoutes);

app.listen(port, () => {
    console.log(`ToDo server is up on port ${port}`);
});

module.exports = app;