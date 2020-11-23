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

// GET Request Route Handler: Get specific tour by identifier
app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);

  // Convert endpoint variable to number and locate the requested resource
  const id = req.params.id * 1;
  const tour = tours.find(item => item.id === id)

  // Verify that requested resource exists; if not, return 404 response
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  // If requested resource is located, return 200 response
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour
    }
  });
});

// POST Request Route Handler: Post a new tour
app.post('/api/v1/tours', (req, res) => {

  // Create new ID and new object for added tour resource; push it into the tours array
  const newId = tours[tours.length -1].id + 1;
  const newTour = Object.assign({id: newId}, req.body);
  tours.push(newTour);

  // Persist the new tour resource into the tours-simple.json data object
  // Send back resource created response to the client
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

// PATCH Request Route Handler: Update a tour resource
app.patch('/api/v1/tours/:id', (req, res) => {

  // Check whether the id is valid; if it's greater than tours.length, then it is invalid
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  // If id is valid, return 200 response
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
});

// Start the server and listen for requests on port 3000
const port = 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

