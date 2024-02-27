const client = require('prom-client');

// Create a Registry to register the metrics
const register = new client.Registry();

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Custom metrics
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

// Function to setup metrics endpoint
function setupMetrics(app) {
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });
}

module.exports = {
  setupMetrics,
  signupCounter,
  loginCounter,
  todosCreatedCounter,
  todosCompletedCounter,
  todosUpdatedCounter,
  todosDeletedCounter
};
