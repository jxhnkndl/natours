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

// GET Request Route Handler: Get All Tours
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours
    }
  });
}

// GET Request Route Handler: Get Tour by ID
const getTour = (req, res) => {
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
}

// POST Request Route Handler: Create Tour
const createTour = (req, res) => {

  // Create new ID and new object for added tour resource; push it into the tours array
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({id: newId}, req.body);
  tours.push(newTour);

  // Persist the new tour resource into the tours-simple.json data object
  // Send back resource created response to the client
  fs.writeFile(
    // Where to write it
    `${__dirname}/dev-data/data/tours-simple.json`, 
    // The data to write
    JSON.stringify(tours), 
    // What to do when the operation is complete
    err => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  });
}

// PATCH Request Route Handler: Update Tour
const updateTour = (req, res) => {

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
}

// DELETE Request Route Handler: Delete Tour
const deleteTour = (req, res) => {

  // Check whether the id is valid; if it's greater than tours.length, then it is invalid
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  // If id is valid, return 204: No Content response with data: null
  res.status(204).json({
    status: 'success',
    data: null
  });
}

// Endpoint Routes: Part I
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// Endpoint Routes: Part II
// Using the .route() method allows for chaining different http methods and their route handlers
// This way, if something about the endpoint needs to change, it can be changed in a single location

app.route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

app.route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// Start the server and listen for requests on port 3000
const port = 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

