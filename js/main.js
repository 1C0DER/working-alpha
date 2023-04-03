$(document).ready(function() {

    //Data from the registration form
    const firstName = document.getElementById('#first-name').val;
    const lastName = document.getElementById('#last-name').val;
    const password = document.getElementById('#password').val;
    const confirmPassword = document.getElementById('confirm-password');
    const gender = document.getElementById('gender').val;
    const phone = document.getElementById('#phone').val;
    const address = document.getElementById('#address').val;
    const postCode = document.getElementById('#postal-code').val;
    const dob = document.getElementById('#dob').val;

    //Data from the flight booking form
    const roundTrip = document.getElementById('#roundTrip').val;
    const oneWay = document.getElementById ('#oneWay').val;
    const multiCity = document.getElementById('#multiCity').val;
    const origin = document.getElementById('#flying-from').val;
    const destination = document.getElementById('#flying-to').val;
    const departureDate = document.getElementById('#departure-date').val;
    const returnDate = document.getElementById('#return-date').val;
    const Adult = document.getElementById('#adult').val;
    const children = document.getElementById('#children').val;
    const cabin = document.getElementById('#cabin').val;


    //Creating an expression for the password
    let pwdExpression = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/; //Chatgpt
    //Confirming password lenght
    if(password.lenght <8 || password.lenght >15){
        alert("password must be between 8 and 15 digits long");
    };

    //Check if password contains alphabet
    if(/[a-zA-Z]/.test(password)){
        return true;
    }else {
        alert ("password must contain atleast one alphabet");
    };

    //Matching the password and the confirm confirmPassword
    if (confirmPassword == password){
        return true;
    }else {
        alert ("passwords do not match")
        return false;
    };



    //this method will select the radio button one way
    $("body").css('background-image','url(/prototype/images/729131.jpg)');
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

    $('#check-flight').click(function(e) {
        e.preventDefault();

        //these variables will get the date and format it properly
        var date = new Date($('#departure-date').val());
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var departureDate = [year, month, day].join('-');

        var date2 = new Date($('#return-date').val());
        var day = date2.getDate();
        var month = date2.getMonth() + 1;
        var year = date2.getFullYear();
        var returnDate = [year, month, day].join('-');

        // These variables will get the other inputs by the user
        var departure = $('#flying-from').val();
        var destination = $('#flying-to').val();
        var adult = $('#adult').val();
        var travelClass = $('#cabin').val();
    });
});