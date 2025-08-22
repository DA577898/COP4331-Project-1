<?php
    $inData = getRequestInfo(); 

    $userID = $inData["userId"]
    $firstName = $inData["firstName"]
    $lastName = $inData["lastName"]
    $phoneNumber = $inData["phoneNumber"]
    $email = $inData["email"]

    $conn = new sqli("localhost", "team20", "team5Password", "COP4331");

	if ($conn->connect_error) {
         returnWithError( $conn->connect_error );
    } else {
        $stmt->$conn->prepare(
            "SELECT ID, FirstName, LastName, Email, Phone
            FROM Contacts
            WHERE UserID = ?"
        );

        $stmt->bind_param("issss", $userID, )



    }

?>