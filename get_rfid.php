<?php
$servername = "localhost";
$username = "";
$password = "your_mysql_password";
$dbname = "AutoExpiryDB";  // Change this to your actual database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to select RFID NUIDs
$sql = "SELECT rfid_code FROM RFIDData";

$result = $conn->query($sql);

$rfidNUIDs = array();

if ($result->num_rows > 0) {
    // Output data of each row
    while($row = $result->fetch_assoc()) {
        $rfidNUIDs[] = $row["rfid_code"];
    }
}

echo json_encode($rfidNUIDs);

$conn->close();
?>
