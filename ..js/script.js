function addData() {
    var rfidCode = document.getElementById("rfidCode").value;
    var expiryDate = document.getElementById("expiryDate").value;

    // Perform validation if needed

    // AJAX request to send data to the server
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Handle the response from the server
            alert(this.responseText);
        }
    };
    xhttp.open("POST", "process.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("rfidCode=" + rfidCode + "&expiryDate=" + expiryDate);
}
