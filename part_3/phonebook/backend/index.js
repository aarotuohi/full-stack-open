// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('morgan');
const Person = require('./models/person');

// Middleware setup
app.use(express.static('dist'));
app.use(express.json());
app.use(cors());

// Custom morgan token for logging POST request bodies
logger.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

logger.token('logFormat', (tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req),
  ].join(' ');
});

app.use(logger('logFormat'));

// Error handling middleware
const handleError = (err, req, res, next) => {
  console.error(err.message);
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  next(err);
};

// Register error handler
app.use(handleError);

// Define API endpoints

// Root API endpoint
app.get('/api', (req, res) => {
  res.send('<h2>API is working</h2>');
});

// Helper function to format current date and time
const getFormattedDateTime = () => {
  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
  const monthName = now.toLocaleDateString('en-US', { month: 'long' });
  const dayNumber = now.getDate();
  const year = now.getFullYear();
  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
  const time = now.toLocaleTimeString('en-US', timeOptions);

  return `${dayName} ${monthName} ${dayNumber} ${year}, ${time}`;
};

// Get phonebook info
app.get('/info', (req, res, next) => {
  Person.find({})
    .then(people => {
      const infoMessage = `<p>Phonebook has info for ${people.length} people</p><p>${getFormattedDateTime()}</p>`;
      res.send(infoMessage);
    })
    .catch(err => next(err));
});

// Fetch all persons
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(people => res.json(people))
    .catch(err => next(err));
});

// Fetch a specific person
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => person ? res.json(person) : res.status(404).end())
    .catch(err => next(err));
});

// Delete a person
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => next(err));
});

// Add a new person
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'The name or number is missing' });
  }

  const newPerson = new Person({ name, number });

  newPerson.save()
    .then(savedPerson => res.status(201).json(savedPerson))
    .catch(err => next(err));
});

// Update a person's details
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(req.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => res.json(updatedPerson))
    .catch(err => next(err));
});

// Middleware for handling unknown endpoints
const unknownEndpointHandler = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' });
};

// Register unknown endpoint middleware
app.use(unknownEndpointHandler);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
