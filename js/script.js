document.addEventListener('DOMContentLoaded', () => {
    const latestRFIDNUIDElement = document.getElementById('latestRFIDNUID');
    const productNameInput = document.getElementById('productName');
    const expiryDateInput = document.getElementById('expiryDate');
  
    // Function to fetch the latest RFID NUID from the server
    const fetchLatestRFIDNUID = async () => {
      try {
        const response = await fetch('http://localhost:3000/latestRFIDNUID');
        const data = await response.json();
  
        const latestRFIDNUID = data.latestRFIDNUID;
  
        if (latestRFIDNUIDElement) {
          latestRFIDNUIDElement.textContent = `Latest RFID NUID: ${latestRFIDNUID}`;
        } else {
          console.error('Element with id "latestRFIDNUID" not found.');
        }
      } catch (error) {
        console.error('Error fetching latest RFID NUID:', error);
      }
    };
  
    // Fetch the latest RFID NUID on page load
    fetchLatestRFIDNUID();
  
    // Set up periodic refresh (every 1 second)
    setInterval(fetchLatestRFIDNUID, 1000);
  });
  
  const modifyProduct = async () => {
    const rfidCode = prompt('Enter RFID NUID:');
  
    // Display RFID code on the website
    document.getElementById('rfidCodeDisplay').innerText = `RFID Code: ${rfidCode}`;
  
    const productName = document.getElementById('productName').value;
    const expiryDate = document.getElementById('expiryDate').value;
  
    // Check if product name and expiry date are not empty
    if (!productName || !expiryDate) {
      alert('Product name and expiry date are required.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/modifyProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rfidCode, productName, expiryDate }),
      });
  
      if (!response.ok) {
        // Check for HTTP error response
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.success) {
        alert('Product modified successfully!');
      } else {
        alert('Failed to modify product. Please try again.');
      }
    } catch (error) {
      console.error('Error modifying product:', error);
      alert('An error occurred while modifying the product.');
    }
  };
  
  