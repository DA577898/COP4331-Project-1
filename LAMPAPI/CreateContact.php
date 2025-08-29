<?php

    $inData = getRequestInfo(); // reading the JSON into variables

    /* Sample JSON from frontend
    {
    "userId": 17,
    "firstName": "Anju",
    "lastName": "Thomas",
    "email": "anju@gmail.com",
    "phoneNumber": "555555555"
    }
    */
    // php variables. inData is an PHP assocative array. keys come from frontend. Rename based on frontend naming accordingly
    $userId = $inData["userId"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phoneNumber = $inData["phoneNumber"];
    $email = $inData["email"];

    $conn = new mysqli("localhost", "team20", "team5Password", "COP4331"); // $conn = a MySQLi object, insert_id is a built in property

        // checking the connection
    if( $conn->connect_error ){
            returnWithError( $conn->connect_error );
    }
    else{ // inserting new row into database. Database schema is not completed yet, so change Column names accordingly once that's finished. VALUES (?, ?, ?, ?, ?) are placeholders

        $stmt = $conn->prepare(
            "INSERT INTO Contacts (FirstName, LastName, Email, Phone, UserID) VALUES (?, ?, ?, ?, ?)"
        );
        $stmt->bind_param("ssssi", $firstName, $lastName, $email, $phoneNumber, $userId); // this binds the variables to the placeholders
        $stmt->execute();

        // to return the value generated for an AUTO_INCREMENT column (https://www.php.net/manual/en/mysqli.insert-id.php)
        $contactId = $conn->insert_id;

        $stmt->close();
        $conn->close();

        // building a JSON response string,
        // example
        /* 
        {
            "id": 12,
            "firstName": "Jane",
            "lastName": "Smith",
            "phoneNumber": "5555555555",
            "email": "testing123@gmail.com"
            "error": ""
        }
        */
        returnWithInfo($contactId, $firstName, $lastName, $phoneNumber, $email);

    }

    function getRequestInfo() // decoding the json with this function. converts JSON string into a PHP associative array
	{
		return json_decode(file_get_contents('php://input'), true);
	}
    // getReqestInfo and sendResultInfoAsJson should be present in every api endpoint
    function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

    function returnWithError( $err )
	{
		$retValue = '{"userId":0,"firstName":"","lastName":"", "phoneNumber": "", "email": "", "error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $contactId, $firstName, $lastName, $phoneNumber, $email )
	{
		$retValue = '{"contactId":' . $contactId . ', "firstName":"' . $firstName . '", "lastName":"' . $lastName . '", "phoneNumber":"' . $phoneNumber . '", "email":"' . $email . '", "error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>