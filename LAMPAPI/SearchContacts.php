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
        
        // Get pagination parameters
        $num_contacts = isset($inData["num_contacts"]) ? (int)$inData["num_contacts"] : 10;
        $num_page = isset($inData["num_page"]) ? (int)$inData["num_page"] : 1;
        
        // Calculate offset for pagination
        $offset = ($num_page - 1) * $num_contacts;
        
        // First, get total count for pagination metadata
        $countStmt = $conn->prepare(
            "SELECT COUNT(*) as total
            FROM Contacts 
            WHERE UserID = ?
            AND (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?)"
        );
        
        $countStmt->bind_param("issss", $userId, $searchTerm, $searchTerm, $searchTerm, $searchTerm);
        $countStmt->execute();
        $countResult = $countStmt->get_result();
        $totalCount = $countResult->fetch_assoc()["total"];
        $countStmt->close();
        
        // Calculate total pages
        $totalPages = ceil($totalCount / $num_contacts);
        
        // should be able to search by first Name, last name, email, and phone number with pagination
        $stmt = $conn->prepare(
            "SELECT ID, FirstName, LastName, Email, Phone
            FROM Contacts 
            WHERE UserID = ?
            AND (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?)
            ORDER BY FirstName, LastName
            LIMIT ? OFFSET ?"
        );

        $stmt->bind_param("issssii", $userId, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $num_contacts, $offset);
		$stmt->execute();
        $result = $stmt->get_result();

		while ($row = $result->fetch_assoc()) {

            if ($searchCount > 0) {
                $searchResults .= ",";
            }
            $searchCount++;
            $searchResults .= '{"contactId":"' . $row["ID"] . '","firstName":"' . $row["FirstName"] . '","lastName":"' . $row["LastName"] . '","email":"' . $row["Email"] . '","phoneNumber":"' . $row["Phone"] . '"}';
        }

        if ($totalCount == 0) {
            returnWithError("No Records Found");
        } else {
            // Return results with pagination metadata
            $response = '{
                "results":[' . $searchResults . '],
                "pagination":{
                    "currentPage":' . $num_page . ',
                    "totalPages":' . $totalPages . ',
                    "totalContacts":' . $totalCount . ',
                    "contactsPerPage":' . $num_contacts . '
                },
                "error":""
            }';
            sendResultInfoAsJson($response);
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
