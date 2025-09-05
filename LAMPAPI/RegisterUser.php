<?php
  

$inData = getRequestInfo(); // reading the JSON into variables

// $required_fields = ["FirstName", "LastName", "Login", "Password"];
// $missing_fields = [];

// foreach ($required_fields as $field) {
//     if ((!isset($inData[$field])) || (trim($inData[$field]) === '' && is_string($inData[$field]))) {
//         $missing_fields[] = $field;
//     }

//     if (count($missing_fields) > 0) {
//         returnWithError("Missing or empty fields: " . implode(", ", $missing_fields));
//         exit();
//     }
// }
    // Extract and sanitize input data
$Firstname = trim($inData["firstName"]);
$Lastname = trim($inData["lastName"]);
$Login = trim($inData["login"]);
$Password = trim($inData["password"]);

// checking length constraints and other error handling 


// constraints on login like special symbols?? 

if (strlen($Firstname) < 1 || strlen($Firstname) > 50) {
    returnWithError("First name must be between 1 and 50 characters");
    exit;
}

if (strlen($Lastname) < 1 || strlen($Lastname) > 50) {
    returnWithError("Last name must be between 1 and 50 characters");
    exit;
}

if (strlen($Login) < 3 || strlen($Login) > 50) {
    returnWithError("Login must be between 3 and 50 characters");
    exit;
}

if (strlen($Password) < 8 || strlen($Password) > 50) {
    returnWithError("Password must be between 8 and 50characters");
    exit;
}



$conn = new mysqli("localhost", "team20", "team5Password", "COP4331"); 

    // checking the connection
    if( $conn->connect_error ){
            returnWithError( $conn->connect_error );
    }
    

$duplicateCheck = $conn->prepare("SELECT ID FROM Users WHERE Login = ?");
if (!$duplicateCheck) {
    returnWithError("Database error: Failed to prepare statement");
    exit();
}

$duplicateCheck->bind_param("s", $Login);
$duplicateCheck->execute();
$result = $duplicateCheck->get_result();

if ($result->num_rows > 0) {
    returnWithError("User already exists with this login");
    $duplicateCheck->close();
    $conn->close();
    exit();
}
$duplicateCheck->close();

// Insert new user
$stmt = $conn->prepare("INSERT INTO Users (Firstname, Lastname, Login, Password) VALUES (?, ?, ?, ?)");
if (!$stmt) {
    returnWithError("Database error: Failed to prepare insert statement");
    $conn->close();
    exit();
}

$stmt->bind_param("ssss", $Firstname, $Lastname, $Login, $Password);

if ($stmt->execute()) {
    // Get the newly created user ID
    $userId = $stmt->insert_id;
    returnWithInfo($userId, $Firstname, $Lastname);
} else {
    returnWithError("Failed to create user: " . $stmt->error);
}

$stmt->close();
$conn->close();

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"userId":0,"Firstname":"","Lastname":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($userId, $Firstname, $Lastname)
{
    $retValue = '{"userId":' . $userId . ',"Firstname":"' . $Firstname . '","Lastname":"' . $Lastname . '","error":""}';
    sendResultInfoAsJson($retValue);
}

?>
