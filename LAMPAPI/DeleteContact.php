<?php

$inData = getRequestInfo(); // reading the JSON into variables

/* Sample JSON from frontend
{
  "userId": 17,
  "contactId": 123
}
*/
// php variables. inData is an PHP assocative array. keys come from frontend. Rename based on frontend naming accordingly
$userId = $inData["userId"];
$contactId = $inData["contactId"];

$conn = new mysqli("localhost", "team20", "team5Password", "COP4331"); // $conn = a MySQLi object, insert_id is a built in property

    // checking the connection
    if( $conn->connect_error ){
            returnWithError( $conn->connect_error );
    }
    else{ // deleting row from database.

        $stmt = $conn->prepare(
            "DELETE FROM Contacts WHERE ID = ? AND UserID = ?"
        );
        $stmt->bind_param("ii", $contactId, $userId); // this binds the variables to the placeholders
        $stmt->execute();

        if ($stmt->affected_rows == 0) {
            returnWithError("Contact not found");
            $stmt->close();
            $conn->close();
        } 
        else {
            returnWithInfo($contactId);
            $stmt->close();
            $conn->close();
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
		$retValue = '{"userId":0,"contactId":0, "error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $contactId )
	{
		$retValue = '{"contactId":' . $contactId . ', "error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>