document.addEventListener('DOMContentLoaded', () => {
    const latestRFIDNUIDElement = document.getElementById('latestRFIDNUID');
    const rfidCodeDisplayElement = document.getElementById('rfidCodeDisplay');

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

        if (rfidCodeDisplayElement) {
          rfidCodeDisplayElement.innerText = `RFID Code: ${latestRFIDNUID}`;
        } else {
          console.error('Element with id "rfidCodeDisplay" not found.');
        }
      } catch (error) {
        console.error('Error fetching latest RFID NUID:', error);
      }
    };

    fetchLatestRFIDNUID();
    setInterval(fetchLatestRFIDNUID, 1000);
  });

  const modifyProduct = async () => {
    const rfidCode = document.getElementById('rfidCodeDisplay').innerText.split(': ')[1];
    const productName = document.getElementById('productName').value;
    const expiryDate = document.getElementById('expiryDate').value;

    try {
      const response = await fetch('http://localhost:3000/modifyProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rfidCode, productName, expiryDate }),
      });

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