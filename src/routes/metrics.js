const express = require('express');
const client = require('prom-client');
const promBundle = require('express-prom-bundle');

const app = express();

// Create a Registry to register the metrics
const register = new client.Registry();

// Enable the collection of default metrics by prom-client
client.collectDefaultMetrics({ register });

// Define custom metrics
const signupCounter = new client.Counter({
  name: 'user_signups_total',
  help: 'Total number of user signups'
});
const loginCounter = new client.Counter({
  name: 'user_logins_total',
  help: 'Total number of user logins'
});
const todosCreatedCounter = new client.Counter({
  name: 'todos_created_total',
  help: 'Total number of todos created'
});
const todosCompletedCounter = new client.Counter({
  name: 'todos_completed_total',
  help: 'Total number of todos marked as completed'
});
const todosUpdatedCounter = new client.Counter({
  name: 'todos_updated_total',
  help: 'Total number of todos updated'
});
const todosDeletedCounter = new client.Counter({
  name: 'todos_deleted_total',
  help: 'Total number of todos deleted'
});

register.registerMetric(signupCounter);
register.registerMetric(loginCounter);
register.registerMetric(todosCreatedCounter);
register.registerMetric(todosCompletedCounter);
register.registerMetric(todosUpdatedCounter);
register.registerMetric(todosDeletedCounter);

const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

module.exports = {
  signupCounter,
  loginCounter,
  todosCreatedCounter,
  todosCompletedCounter,
  todosUpdatedCounter,
  todosDeletedCounter
};
