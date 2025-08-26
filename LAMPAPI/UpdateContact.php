<?php
    $inData = getRequestInfo(); 

    // getting json user, firstName, lastName, phoneNumber, and email from frontend
    $userId = $inData["userId"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phoneNumber = $inData["phoneNumber"];
    $email = $inData["email"];
    $contactId = $inData["contactID"];

    $conn = new mysqli("localhost", "team20", "team5Password", "COP4331");

	if ($conn->connect_error) {
         returnWithError( $conn->connect_error );
    } else {
        $stmt = $conn->prepare(
            "UPDATE Contacts 
            SET FirstName = ?, LastName = ?, Email = ?, Phone = ?
            WHERE UserID = ? AND ID = ?"
        );

        if ($stmt === false) {
            returnWithError($conn->error);
        } else {
            $stmt->bind_param("ssssii", $firstName, $lastName, $email, $phoneNumber, $userId, $contactId);
            
            if($stmt->execute()){
                $stmt->close();
                $conn->close();
                returnWithInfo($contactId, $firstName, $lastName, $phoneNumber, $email);
            } else {
                $stmt->close();
                $conn->close();
                returnWithError($stmt->error);
            }
        }
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
		$retValue = '{"contactId":0,"firstName":"","lastName":"", "phoneNumber": "", "email": "", "error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $contactId, $firstName, $lastName, $phoneNumber, $email )
	{
		$retValue = '{"contactId":' . $contactId . ', "firstName":"' . $firstName . '", "lastName":"' . $lastName . '", "phoneNumber":"' . $phoneNumber . '", "email":"' . $email . '", "error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>