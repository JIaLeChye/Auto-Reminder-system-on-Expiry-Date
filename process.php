<?php
$servername = "your_mysql_server";
$username = "your_mysql_username";
$password = "your_mysql_password";
$dbname = "AutoExpiryDB";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get data from the POST request
$rfidCode = $_POST['rfidCode'];
$expiryDate = $_POST['expiryDate'];

// Insert data into the database
$sql = "INSERT INTO RFIDData (rfid_code, expiry_date) VALUES ('$rfidCode', '$expiryDate')";

if ($conn->query($sql) === TRUE) {
    echo "RFID data added successfully!";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
