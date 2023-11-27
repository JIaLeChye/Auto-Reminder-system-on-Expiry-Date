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

  // Check if the element exists before adding the event listener
  if (document.getElementById('modifyProductForm')) {
    document.getElementById('modifyProductForm').addEventListener('submit', (event) => {
      event.preventDefault();
      modifyProduct();
    });
  } else {
    console.error('Element with id "modifyProductForm" not found.');
  }

  fetchLatestRFIDNUID();
  setInterval(fetchLatestRFIDNUID, 1000);
});

const modifyProduct = async () => {
  const rfidCode = document.getElementById('rfidCodeDisplay').innerText.split(': ')[1];
  const productName = document.getElementById('productName').value;
  const expiryDateInput = document.getElementById('expiryDate');
  const expiryDate = expiryDateInput.value;

  // Validate expiry date
  const currentDate = new Date();
  const selectedDate = new Date(expiryDate);

  if (selectedDate < currentDate) {
    alert('Expiry date cannot be earlier than today.');
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

    const data = await response.json();

    if (data.success) {
      alert('Product modified successfully!');
      // Clear input fields after successful modification
      document.getElementById('productName').value = '';
      expiryDateInput.value = '';
      // Reload the page to reflect changes immediately
      location.reload();
    } else {
      alert('Failed to modify product. Please try again.');
    }
  } catch (error) {
    console.error('Error modifying product:', error);
    alert('An error occurred while modifying the product.');
  }
};
