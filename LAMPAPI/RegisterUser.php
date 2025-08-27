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
$required_fields = ["FirstName", "LastName", "Login", "Password"];
$missing_fields = [];

foreach ($required_fields as $field) {
    if ((!isset($inData[$field])) || (trim($inData[$field]) === '' && is_string($inData[$field]))) {
        $missing_fields[] = $field;
    }

    if (count($missing_fields) > 0) {
        returnWithError("Missing or empty fields: " . implode(", ", $missing_fields));
        exit();
    }
}
    // Extract and sanitize input data
$FirstName = trim($inData["FirstName"]);
$LastName = trim($inData["LastName"]);
$Login = trim($inData["Login"]);
$Password = trim($inData["Password"]);

// checking length constraints and other error handling 


// constraints on login like special symbols?? 

if (strlen($firstName) < 1 || strlen($firstName) > 50) {
    returnWithError("First name must be between 1 and 50 characters");
    exit;
}

if (strlen($lastName) < 1 || strlen($lastName) > 50) {
    returnWithError("Last name must be between 1 and 50 characters");
    exit;
}

if (strlen($login) < 3 || strlen($login) > 50) {
    returnWithError("Login must be between 3 and 50 characters");
    exit;
}

if (strlen($password) < 8 || strlen($password) > 50) {
    returnWithError("Password must be between 8 and 50characters");
    exit;
}





$conn = new mysqli("localhost", "team20", "team5Password", "COP4331"); // $conn = a MySQLi object, insert_id is a built in property

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
$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
if (!$stmt) {
    returnWithError("Database error: Failed to prepare insert statement");
    $conn->close();
    exit();
}

$stmt->bind_param("ssss", $FirstName, $LastName, $Login, $Password);

if ($stmt->execute()) {
    // Get the newly created user ID
    $userId = $stmt->insert_id;
    returnWithInfo($userId, $FirstName, $LastName);
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
    $retValue = '{"userId":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($userId, $firstName, $lastName)
{
    $retValue = '{"userId":' . $userId . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
    sendResultInfoAsJson($retValue);
}

?>