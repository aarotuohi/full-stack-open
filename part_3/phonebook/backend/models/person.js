const mongooseLib = require('mongoose');

// Disable strict mode for queries
mongooseLib.set('strictQuery', false);

// Database connection URL
const dbURL = process.env.MONGODB_URI;

// Log connection attempt
console.log('Attempting to connect to', dbURL);

// Connect to MongoDB
mongooseLib.connect(dbURL)
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
  });

// Define schema for Person collection
const schemaForPerson = new mongooseLib.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function (val) {
        return /\d{2,3}-\d{6}/.test(val);
      },
      message: (props) => `${props.value} is not a valid number format`,
    },
    minLength: 8,
    required: true,
  },
});

// Transform the schema's toJSON method
schemaForPerson.set('toJSON', {
  transform: (doc, objReturned) => {
    objReturned.id = objReturned._id.toString();
    delete objReturned._id;
    delete objReturned.__v;
  },
});

// Export the Person model based on the schema
module.exports = mongooseLib.model('Person', schemaForPerson);
