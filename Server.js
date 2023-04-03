// Authors @Alpha team

const express = require('express');
const session = require ('express-session')
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const Amadeus = require('amadeus');
const amadeus = new Amadeus({
  clientId: 'g2qNx4VNbsou6k0Yc51ikagxv7aAjWif',
  clientSecret: 'XSpdhJve67GrPGJK'
});

//connection url
const url = 'mongodb://localhost:27017/flyjeje';

//variable for database
let db;

//connecting to the mongo client
MongoClient.connect(url, function (err, database){
    if (err){
        console.log("Error while connecting to MongoDb:",err);
        return;
    }
    db = database;
    app.listen(8080, ()=> console.log("listening on port 8080"));
    console.log("Connected successfully to MongoDb server");
  }

)
// Setting up middleware to parse request body telling express we want it to read forms
app.use(bodyParser.urlencoded({
    extended:true
}));

//Setting up the middleware to serve static files
app.use(express.static('public'));

// set the view engine to ejs
app.set('view engine', 'ejs');


//creating the route for the registration form
app.post('/register', async(req, res) => {
  // Create a new url
  console.log(url);
  const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Connect to the MongoDB server
    await client.connect();
    // Get the users collection
    const db = client.db('flyjeje');
    const collection = db.collection('clients')
    //Extract data from the request body
    const {firstName, lastName, dob, phone, gender, postCode,address, password, confirmPassword} = req.body;

    //Validating the password
    const pwdExpression = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
    if (!pwdExpression.test(password)) {
      return res.status(400).json({ message: "Password must contain at least one digit, one lowercase letter, one uppercase letter, and be between 8 and 15 characters long" });
    }

    //Confirm password
    if (confirmPassword !== password) {
      return res.status(400).json({ message: "Password and confirm password do not match" });
    }

    //Creating the schema for a new user
    const clientObj = {
        firstName,
        lastName,
        dob:new Date(dob),
        phone,
        gender,
        postCode,
        address,
        password
    };

    //Adding the client's details to the clients collection
    const result = await collection.insertOne(clientObj);
    console.log(result.ops[0]);
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while registering the user" });
  }finally{
    await client.close();
  }
});


//This method will get the registration page
app.get('/register', (req, res) => {
  res.render('pages/register');
});


//This method will get the login page
app.get('/login', (req, res) => {
  res.render('pages/login');
});

// This method is for the user sign in. it will use data stored in the database
app.post('/login', async(req, res) => {
  try {
    const db = await MongoClient.connect(flyjeje);
    // Get the users collection
    const collection = db.collection('clients');
  
    //First check if user exists in the database
    const user = await collection.findOne({"phone": req.body.phone})
    if (user) {
      //Check if the password is the same as the users stored in the database
      const result = req.body.password === user.password;
      if (result) {
        res.render('pages/flights')
      }else{
        res.status(400).json({error: "password does not match"})
      }
    }else{
      res.status(400).json({error: "This user is not yet on the jeje platform. Please register"})
      res.redirect('register');
    }
  } catch (error) {
    res.status(400).json({error})
  }
});

// Route for flight booking

app.post('/flight', async (req, res) => {
  try {
    const { origin, destination, departureDate, returnDate, cabin, adults, children } = req.body;

    // Create a flight order
    const flightOrder = {
      type: 'flight-order',
      flightOffers: [
        {
          originDestinations: [
            {
              id: '1',
              originLocationCode: origin,
              destinationLocationCode: destination,
              departureDateTime: departureDate
            },
            {
              id: '2',
              originLocationCode: destination,
              destinationLocationCode: origin,
              departureDateTime: returnDate
            }
          ],
          travelers: [
            {
              id: '1',
              travelerType: 'ADULT',
              fareOptions: [cabin]
            },
            {
              id: '2',
              travelerType: 'CHILD',
              fareOptions: [cabin]
            }
          ]
        }
      ]
    };

    // Book the flight order
    const response = await amadeus.booking.flightOrders.post(flightOrder);

    const bookingReference = response.data.booking.reference; // Get the booking reference from the response

    // Adding this flight to the database
    const client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('flyjeje');
    const collection = db.collection('flights');
    const flight = {
      bookingReference,
      origin,
      destination,
      departureDate,
      returnDate,
      cabin,
      adults,
      children
    };

    // Processing and inserting the database
    const result = await collection.insertOne(flight);
    client.close(); // Close the database connection
    res.status(200).send(`Flight booked with booking reference ${bookingReference}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing your request');
  }
});

 
//This method will render the flight
app.get('/flight', (req, res) => {
  res.render('pages/flight');
})


// This method will get the stored flight reference information that is in the database
app.get('/flight/:id', async (req, res) => {
  try {
    const db = await MongoClient.db(flyjeje);
    const collection = db.collection('flights');
    const id = req.params.id;

    //Trying to find the reference id in the database
    const result = await collection.findOne({ _id: ObjectId(id) });

    if (!result) {
      res.status(404).send('Flight booking not found');
    }else{
      res.send(result);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error retrieving flight booking');
  }
});