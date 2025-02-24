// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public/js'))
var bodyParser = require('body-parser');
app.use(bodyParser.json());
PORT        = 9125;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./database/db-connector')

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/

let recievedData;
let userID;
let artist;
let venue;
let dateAttended;
let notes;

// Send concert information for the specified user back to the client
app.post('/submit', (req, res) => {
    recievedData = req.body;
    console.log('Recieved data:', recievedData);
    userID = recievedData["userID"];
    res.json({data: userID});
});

app.get('/data', (req, res) =>{  
        let query1 = `SELECT * FROM Concerts WHERE userID = ${userID}`;
        db.pool.query(query1, function(error, results, fields){    // Execute the query
            res.send(JSON.stringify(results));
            
        })                                                      
    }); 

// Add new data to Concert table
app.post('/submitNewData', (req, res) => {
    recievedData = req.body;
    console.log('Recieved data:', recievedData);

    // Assign new data to variables
    userID = recievedData["input-userID"];
    artist = recievedData["input-artist"];
    venue = recievedData["input-venue"];
    dateAttended = recievedData["input-dateAttended"];
    notes = recievedData["input-notes"];

    // Capture null value
    if (isNaN(notes))
        {
            notes = 'NULL'
        }

    let query1 = `INSERT INTO Concerts (userID, artist, venue, dateAttended) VALUES (${userID}, '${artist}', '${venue}', '${dateAttended}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log('Error adding data:', error)
            res.sendStatus(400);
        }
        else{
            console.log('successfully added data:', rows)
            res.sendStatus(200);
        }
    })
});

// Delete data from Concert table
app.post('/deleteConcertData', (req, res) => {
    recievedData = req.body;
    console.log('Recieved data:', recievedData);

    let concertID = recievedData["input-concertID"];
    let numConcertID = parseInt(concertID);
    
    let query1 = `DELETE ROW FROM Concerts AS ROW WHERE concertID = ?`;
    db.pool.query(query1, [numConcertID], function(error, rows, fields){
        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log('Error deleting data:', error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            //res.send('Successfully deleted ', concertID);
            res.sendStatus(200);
        }
    })
});

// Get update data from Concert table
app.put('/updateConcertData', (req, res) => {
    recievedData = req.body;

    let updateConcertID = recievedData["concertID"];
    let updateArtist = recievedData["artist"];
    let updateVenue = recievedData["venue"];
    let updateDateAttended = recievedData["dateAttended"];
    let updateNotes = recievedData["notes"];

    let numConcertID = parseInt(updateConcertID);

    let query1;
    let query2;
    let query3;
    let query4;

    if (updateArtist == 'NULL'){
        query1 = `SELECT artist AS originalArtist FROM Concerts WHERE concertID = ?`;
        db.pool.query(query1, [numConcertID], function(error, rows, fields){
            if (error){
                console.log(error);
                res.sendStatus(400);
            } else {
                updateArtist = rows[0].originalArtist;
            }
        })
    }

    if (updateVenue == 'NULL'){
        query2 = `SELECT venue AS originalVenue FROM Concerts WHERE concertID = ?`;
        db.pool.query(query2, [numConcertID], function(error, rows, fields){
            if (error){
                console.log(error);
                res.sendStatus(400);
            } else {
                updateVenue = rows[0].originalVenue;
            }
        })
    }

    if (updateDateAttended == 'NULL'){
        query3 = `SELECT dateAttended AS originalDateAttended FROM Concerts WHERE concertID = ?`;
        db.pool.query(query3, [numConcertID], function(error, rows, fields){
            if (error){
                console.log(error);
                res.sendStatus(400);
            } else {
                updateDateAttended = rows[0].originalDateAttended;
                console.log('original date:', updateDateAttended);
            }
        })
    }

    if (updateNotes == 'NULL'){
        query4 = `SELECT notes AS originalNotes FROM Concerts WHERE concertID = ?`;
        db.pool.query(query4, [numConcertID], function(error, rows, fields){
            if (error){
                console.log(error);
                res.sendStatus(400);
            } else {
                updateNotes = rows[0].originalNotes;
            }
        })
    }
    let query5 = `UPDATE Concerts SET artist = ?, venue = ?, dateAttended = ?, notes = ? WHERE Concerts.concertID = ?`;

    setTimeout(() => {
        db.pool.query(query5, [updateArtist, updateVenue, updateDateAttended, updateNotes, numConcertID], function(error, rows, fields){
            if (error){
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(200);
            }
        })
    }, 500);
    
});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});