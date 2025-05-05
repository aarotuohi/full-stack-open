const mongoose = require('mongoose');


if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];



const url = `mongodb+srv://aaro:<password>@cluster0.0gmbs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);


if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:');
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}

// Jos komentorivillä on nimi ja numero, lisätään uusi henkilö tietokantaan
else if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name,
    number,
  });

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}

// Jos parametreja on väärä määrä, näytetään ohjeistus
else {
  console.log('Usage: node mongo.js <password> <name> <number>');
  process.exit(1);
}


