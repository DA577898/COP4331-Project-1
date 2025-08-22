<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$raw = file_get_contents('php://input');
if ($raw === false || $raw === '') {
    returnWithError("Empty request body");
    exit;
}

$inData = json_decode($raw, true);
if ($inData === null) {
    returnWithError("Invalid JSON: " . json_last_error_msg());
    exit;
}

foreach (["userId","firstName","lastName","email","phoneNumber"] as $k) {
    if (!array_key_exists($k, $inData)) {
        returnWithError("Missing field: $k");
        exit;
    }
}

$userId      = (int)$inData["userId"];
$firstName   = $inData["firstName"];
$lastName    = $inData["lastName"];
$phoneNumber = $inData["phoneNumber"];
$email       = $inData["email"];

$conn = new mysqli("localhost", "root", "team5Password", "COP4331");
if ($conn->connect_error) {
    returnWithError("DB connect failed: " . $conn->connect_error);
    exit;
}

$stmt = $conn->prepare(
    "INSERT INTO Contacts (FirstName, LastName, Email, Phone, UserID)
     VALUES (?, ?, ?, ?, ?)"
);
if (!$stmt) {
    returnWithError("Prepare failed: " . $conn->error);
    $conn->close();
    exit;
}

if (!$stmt->bind_param("ssssi", $firstName, $lastName, $email, $phoneNumber, $userId)) {
    returnWithError("Bind failed: " . $stmt->error);
    $stmt->close();
    $conn->close();
    exit;
}

if (!$stmt->execute()) {

    returnWithError("Execute failed: " . $stmt->error);
    $stmt->close();
    $conn->close();
    exit;
}

$contactId = $conn->insert_id;

$stmt->close();
$conn->close();

returnWithInfo($contactId, $firstName, $lastName, $phoneNumber, $email);



function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err) {
    sendResultInfoAsJson(json_encode([
        "userId" => 0,
        "firstName" => "",
        "lastName" => "",
        "phoneNumber" => "",
        "email" => "",
        "error" => $err
    ]));
}

function returnWithInfo($contactId, $firstName, $lastName, $phoneNumber, $email) {
    sendResultInfoAsJson(json_encode([
        "contactId" => (int)$contactId,
        "firstName" => $firstName,
        "lastName" => $lastName,
        "phoneNumber" => $phoneNumber,
        "email" => $email,
        "error" => ""
    ]));
}
?>