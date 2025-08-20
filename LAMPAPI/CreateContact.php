<?php

$inData = getRequestInfo(); // reading the JSON into variables

/* Sample JSON from frontend
{
  "userId": 17,
  "firstName": "Anju",
  "lastName": "Thomas",
  "email": "anju@gmail.com",
  "phone": "555555555"
}
*/
// php variables
$userId = 0;
$firstName = "";
$lastName = "";
$phoneNumber = "";
$email = "";

$conn = new mysqli("localhost", "root", "team5Password", "COP4331");

if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
else{ // inserting new row into database. Database schema is not completed yet, so change Column names accordingly once that's finished. VALUES (?, ?, ?, ?, ?) are placeholders
    $stmt = $conn->prepare(
        "INSERT INTO Contacts (UserID, FirstName, LastName, Email, PhoneNumber) VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->bind-param("issss", $userID, $firstName, $lastName, $email, $phoneNumber) // this binds the variables to the placeholders
    $stmt->execute();
}
?>
