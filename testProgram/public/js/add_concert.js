// Get the objects we need to modify
let addConcertForm = document.getElementById('add-concert-form-ajax');

// Modify the objects we need
addConcertForm.addEventListener("submit", function (e) {
//function updateConcerts(){    
    // Prevent the form from submitting
    e.preventDefault();
    
    // Get form fields we need to get data from
   // let inputUserID = document.getElementById("input-userID");
    let inputArtist = document.getElementById("input-artist");
    let inputVenue = document.getElementById("input-venue");
    let inputDateAttended = document.getElementById("input-dateAttended");
    let inputNotes = document.getElementById("input-notes");

    // Get the values from the form fields
  //  let userIDValue = inputUserID.value;
    let artistValue = inputArtist.value;
    let venueValue = inputVenue.value;
    let dateAttendedValue = inputDateAttended.value;
    let notesValue = inputNotes.value;

    // Put our data we want to send in a javascript object
    let data = {
       // userID: userIDValue,
        artist: artistValue,
        venue: venueValue,
        dateAttended: dateAttendedValue,
        notes: notesValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-concert-form-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log('test3');
            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            //inputConcertID.value = '';
           // inputUserID.value = '';
            inputArtist.value = '';
            inputVenue.value = '';
            inputDateAttended.value = '';
            inputNotes.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    console.log(JSON.stringify(data));
    xhttp.send(JSON.stringify(data));

})

// Creates a single row from an Object representing a single record from 
addRowToTable = (data) => {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("concert-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
  //  let concertIDCell = document.createElement("TD");
  //  let userIDCell = document.createElement("TD")
    let artistCell = document.createElement("TD");
    let venueCell = document.createElement("TD");
    let dateAttendedCell = document.createElement("TD");
    let notesCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
  //  concertIDCell.innerText = newRow.concertID;
  //  userIDCell.innerText = newRow.userID;
    artistCell.innerText = newRow.artist;
    venueCell.innerText = newRow.venue;
    dateAttendedCell.innerText = newRow.dateAttended;
    notesCell.innerText = newRow.notes;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteConcert(newRow.concertID);
    };

    // Add the cells to the row 
   // row.appendChild(concertIDCell);
  //  row.appendChild(userIDCell);
    row.appendChild(artistCell);
    row.appendChild(venueCell);
    row.appendChild(dateAttendedCell);
    row.appendChild(notesCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.concertID);

    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.artist + ' on ' +  newRow.dateAttended;
    option.value = newRow.concertID;
    selectMenu.add(option);
    // End of new step 8 code.
}