// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
var axios = require('axios');
PORT        = 9126;                 // Set a port number at the top so it's easy to change in the future
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public/js'))

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

//jsdom
//const jsdom = require('jsdom');


//const {concertID} = require('./public/js/main');
/*
    ROUTES
*/

/*------------------------------------------------------------------------------------------------------
Display data on the homepage
------------------------------------------------------------------------------------------------------*/
getData();
postData();

app.get('/', function(req, res)
    {  
        
        res.render('index', {data: concertData});                                                        
    });

/*------------------------------------------------------------------------------------------------------
Request and receive concert data from the server
------------------------------------------------------------------------------------------------------*/
let concertData;
let newConcertData;
let concertID;

async function getData() {
    try {
        const response = await axios.get('http://localhost:9125/data');
        concertData = response.data;
        console.log('GET response:', response.data);

    } catch (error) {
        console.error('Error during GET request:', error);
    }
}

async function postData() {
    try {
        const dataToSend = {"userID":1};
        const response = await axios.post('http://localhost:9125/submit', dataToSend);
        console.log('POST response:', response.data);
    } catch (error) {
        console.error('Error during POST request:', error);
    }
}

// Capture add new concert form data
app.post('/add-concert-form', function(req, res){
    newConcertData = req.body;
    console.log(newConcertData);

    postNewData(newConcertData);
    getData();

    setTimeout(() => {
        res.redirect('/');
    }, 1000);
})

// Send add new concert form data to microservice
async function postNewData(formData) {
    await axios.post('http://localhost:9125/submitNewData', formData)
        .then(response => {
            console.log('Form submitted successfully:', response.data);
        })
        .catch(error => {
            console.error('Error submitting form:', error);
        });
    
    await axios.get('http://localhost:9125/data')
        .then(response => {
            console.log('GET response:', response.data);
        })
        .catch(error => {
            console.error('Error during GET request:', error);
        })
}

// Capture concertID to be deleted
app.post('/delete-concert-form', function(req, res){
    let deleteConcertData = req.body;

    console.log(deleteConcertData);
    postDeleteData(deleteConcertData);

    getData();

    setTimeout(() => {
        res.redirect('/');
    }, 1000);

})


// Send concertID to delete to microservice
async function postDeleteData(deleteID) {
    await axios.post('http://localhost:9125/deleteConcertData', deleteID)
        .then(response => {
            console.log('Form submitted successfully:', response.data);
        })
        .catch(error => {
            console.error('Error submitting form:', error);
        });

    await axios.get('http://localhost:9125/data')
    .then(response => {
        console.log('GET response:', response.data);
    })
    .catch(error => {
        console.error('Error during GET request:', error);
    })
}
/*
async function postUpdateData(concertID) {
    try {
        const response = await axios.post('http://localhost:9125/updateData', concertID);
        concertData = response.data;
        console.log('POST response:', response.data);

    } catch (error) {
        console.error('Error during POST request:', error);
    }
}

// Capture concertID to be updated
app.post('/update-concert-form-select', function(req, res){
    updateConcertData = req.body;

    console.log(updateConcertData);
    postUpdateData(updateConcertData);
  //  getData();
  //  postData();
  //  res.redirect('/');
})*/


// Capture concertID and data to be updated
app.post('/update-concert-form', function(req, res){
    updateConcertData = req.body;

    let concertID = updateConcertData["input-artist-date"];
    let artist = updateConcertData["input-artist-update"];
    let venue = updateConcertData["input-venue-update"];
    let dateAttended = updateConcertData["input-dateAttended-update"];
    let notes = updateConcertData["input-notes-update"];

    if (artist == ''){
        artist = 'NULL';
    }

    if (venue == ''){
        venue = 'NULL';
    }

    /*PROGRESS:
    dateAttended and notes update don't work if fields are emtpy. app.post
    is sending '' instead of 'NULL' */
    if (dateAttended == ''){
        dateAttended = 'NULL';
    }

    if (notes == ''){
        notes = 'NULL';
    }

    postUpdateData({"concertID": concertID, "artist": artist, "venue": venue, "dateAttended": dateAttended, "notes": notes});

    setTimeout(() => {
        getData();
    }, 1000);
     
    setTimeout(() => {
        res.redirect('/');
    }, 1500);
  
})

// Send concertID to update to microservice
async function postUpdateData(updateID) {
    console.log('data sent', updateID);
    await axios.put('http://localhost:9125/updateConcertData', updateID)
        .then(response => {
            console.log('Form submitted successfully:', response.data);
        })
        .catch(error => {
            console.error('Error submitting form:', error);
        });

 /*   await axios.get('http://localhost:9125/data')
        .then(response => {
            console.log('GET response:', response.data);
        })
        .catch(error => {
            console.error('Error during GET request:', error);
        })*/
}

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
