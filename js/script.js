document.addEventListener('DOMContentLoaded', () => {
  const rfidList = document.getElementById('rfidList');

  // Fetch RFID NUIDs from the backend
  fetch('/rfidNUIDs')
    .then(response => response.json())
    .then(data => {
      const rfidNUIDs = data.rfidNUIDs;
      rfidNUIDs.forEach(rfidNUID => {
        const listItem = document.createElement('li');
        listItem.textContent = rfidNUID;
        rfidList.appendChild(listItem);
      });
    })
    .catch(error => console.error('Error fetching RFID NUIDs:', error));
});
