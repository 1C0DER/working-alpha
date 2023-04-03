
$( () => {

    $('#submit').on("click", () => { 
        //Data from the registration form
        let firstName = document.getElementById('first-name').value;
        let lastName = document.getElementById('last-name').value;
        let password = document.getElementById('password').value;
        let confirmPassword = document.getElementById('confirm-password').value;
        let gender = document.getElementById('gender').value;
        let phone = document.getElementById('phone').value;
        let address = document.getElementById('address').value;
        let postCode = document.getElementById('postal-code').value;
        let dob = document.getElementById('dob').value;
      
        // Making an AJAX request to the server-side script
        $.ajax({
          type: 'POST',
          url: '/register', // This is the url of the server side script
          data: {
            firstName: firstName,
            lastName: lastName,
            password: password,
            confirmPassword: confirmPassword,
            gender: gender,
            phone: phone,
            address: address,
            postCode: postCode,
            dob: dob
          },
          success: function (response) {
            // Handle the response from the server
            alert("registration successful")
            console.log(response);
          },
          error: function (xhr, status, error) {
            // Handle errors
            alert("failed to register this user")
            console.log(xhr.responseText);
          }
        });
      });
      
    

    $('#check-flight').on("click", () => { 
        //Data from the flight booking form
        let roundTrip = document.getElementById('roundTrip');
        let oneWay = document.getElementById ('oneWay');
        let multiCity = document.getElementById('multiCity');
        let origin = document.getElementById('flying-from');
        let destination = document.getElementById('flying-to');
        let departureDate = moment(document.getElementById('departure-date').value, 'YYYY-MM-DD').format('YYYY-MM-DD');
        let returnDate = moment(document.getElementById('return-date').value, 'YYYY-MM-DD').format('YYYY-MM-DD');
        let adults = document.getElementById('adult');
        let children = document.getElementById('children');
        let cabin = document.getElementById('cabin');
    
        $.ajax({
            type: "POST",
            url: "/flight",
            data: {
                roundTrip: roundTrip,
                oneWay: oneWay,
                multiCity: multiCity,
                origin: origin,
                destination: destination,
                departureDate: departureDate,
                returnDate: returnDate,
                adults: adults,
                children: children,
                cabin: cabin
            },
            success:  (response) => {
                // Parse the JSON response
                let results = JSON.parse(response);
    
                // Display the flight search results on the page
                let resultsContainer = document.getElementsByClassName('.result');
                let html = "";
    
                // Use the for loop to go through the results and display
                for (let i = 0; i < results.length; i++) {
                    html += '<div>';
                    html += '<h2>' + results[i].flightNumber + '</h2>';
                    html += '<p>' + results[i].departureTime + ' - ' + results[i].arrivalTime + '</p>';
                    html += '<p>' + results[i].originAirport + ' - ' + results[i].destinationAirport + '</p>';
                    html += '<p>' + results[i].price + '</p>';
                    html += '</div>';
                }
    
                resultsContainer.innerHTML = html;
            },
            error: (xhr, status, error)=>{
                console.log(error);
            }
        });
    });
    


    //this method will select the radio button one way
    $("body").css('background-image','url(729131.jpg)');
    $ ("body").css('.background-size','cover');
    $ ("body").css('.background-repeat', 'no-repeat');

    // This will hide some elements when the one way radio button is selected
    $('#oneWay').click(function() {
        $('#return-date').hide();
        $('#returning').hide();
        $('#addFlight').hide();
    });

    // This will hide/show some elements when the round trip radio button is selected
    $('#roundTrip').click(function() {

        $('#return-date').show();
        $('#returning').show();
        $('#addFlight').hide();
    })

    // This will hide/show some elements when the multi city radio button is selected
    // The add flight input is already checked in the html
    $('#multiCity').click(function() {
        $('#addFlight').show();
        $('#arrival-date').show();
        $('#returning').show();
    });

    // This will add more return and depart elements to the webpage when the add flight button is clicked
    $('#addFlight').click(function() {
        $('#return').append('<input type="date" class="form-control select-date" >');
        $('#depart').append('<input type="date" class="form-control select-date" >');

    });
});