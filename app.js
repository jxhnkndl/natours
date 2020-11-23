// Require core and third-party modules
const fs = require('fs');
const express = require('express');

// Init Express
const app = express();

// Init Middleware 
app.use(express.json());

// Top Level: Extract data from JSON, read it, and parse it into a JS object
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// GET Request Route Handler: Get all tours
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours
    }
  });
});

// POST Request Route Handler: Post a new tour
app.post('/api/v1/tours', (req, res) => {

  // Create ID for new resource
  const newId = tours[tours.length -1].id + 1;

  const newTour = Object.assign({id: newId}, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`, 
    JSON.stringify(tours), 
    err => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  });
});


// Start the server and listen for requests on port 3000
const port = 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

