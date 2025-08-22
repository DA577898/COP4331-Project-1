
<?php

	$inData = getRequestInfo(); // opening up json
	
	$id = 0;
	$firstName = "";
	$lastName = "";

	// mysql server = local host, mySQl username = root, Password = team5Password, database = COP4331
	// connecting to mysql
	$conn = new mysqli("localhost", "team20", "team5Password", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=? AND Password =?");
		$stmt->bind_param("ss", $inData["login"], $inData["password"]); // ss = both parameters are strings
		$stmt->execute();
		$result = $stmt->get_result();

		// handling results
		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'] ); // if row is found, returning as JSOn
		}
		else
		{
			returnWithError("No Records Found"); // if not found, then return an error
		}

		$stmt->close();
		$conn->close();
	}
	
	function getRequestInfo() // decoding the json with this function
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
