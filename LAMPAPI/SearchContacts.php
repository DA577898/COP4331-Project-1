<?php

	$inData = getRequestInfo();
    $searchResults = "";
    $searchCount   = 0;

    $conn = new mysqli("localhost", "team20", "team5Password", "COP4331");
    if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else{
        $searchTerm = "%" . $inData["search"] . "%"; // search term matches anything passed in. and $inData["search"] = what the user types in % . "J" . % = %j% 
        $userId = (int)$inData["userId"]; // we only want to search the contacts of the user who is logged in, and casting to an int
        
        // should be able to search by first Name, last name, email, and phone number
        $stmt = $conn->prepare(
            "SELECT ID, FirstName, LastName, Email, Phone
            FROM Contacts 
            WHERE UserID = ?
            AND (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?)"
        );

        $stmt->bind_param("issss", $userId, $searchTerm, $searchTerm, $searchTerm, $searchTerm);
		$stmt->execute();
        $result = $stmt->get_result();

		while ($row = $result->fetch_assoc()) {

            if ($searchCount > 0) {
                $searchResults .= ",";
            }
            $searchCount++;
            $searchResults .= '{"contactId":"' . $row["ID"] . '","firstName":"' . $row["FirstName"] . '","lastName":"' . $row["LastName"] . '","email":"' . $row["Email"] . '","phoneNumber":"' . $row["Phone"] . '"}';
        }

        if ($searchCount == 0) {
            returnWithError("No Records Found");
        } else {
            sendResultInfoAsJson('{"results":[' . $searchResults . '],"error":""}');
        }
        $stmt->close();
        $conn->close();
    }

    function getRequestInfo(){
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj ){
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}	
?>
