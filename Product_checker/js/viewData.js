// js/viewData.js

document.addEventListener('DOMContentLoaded', () => {
  let latestScannedNUID = ''; // Add this variable to store the latest scanned NUID
  const productDataListElement = document.getElementById('productDataList');

  const scanProduct = async () => {
    const latestRFIDNUIDElement = document.getElementById('latestRFIDNUID');
    const rfidCodeDisplayElement = document.getElementById('rfidCodeDisplay');

    try {
      const response = await fetch('http://192.168.85.214:3000/latestRFIDNUID');
      const data = await response.json();

      const latestRFIDNUID = data.latestRFIDNUID;
      
      latestScannedNUID = latestRFIDNUID; // Update the latest scanned NUID
    } catch (error) {
      console.error('Error fetching latest RFID NUID:', error);
    }
  };

  const fetchProductData = async () => {
    try {
      const response = await fetch('http://192.168.85.214:3000/allProductData');
      const data = await response.json();

      if (productDataListElement) {
        if (data.productData && data.productData.length > 0) {
          const productListHTML = data.productData.map(product => {
            const isScannedProduct = product.NUID === latestScannedNUID;
            return `
              <div class="${isScannedProduct ? 'scanned-product' : ''}">
                <strong>NUID:</strong> ${product.NUID}<br>
                <strong>Product Name:</strong> ${product.Product_name}<br>
                <strong>Expiry Date:</strong> ${formatDate(product.expiry_date)}<br>
                <hr>
              </div>
            `;
          }).join('');

          productDataListElement.innerHTML = productListHTML;
        } else {
          productDataListElement.innerHTML = 'No product data available.';
        }
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
  
    // Get the date part in the format YYYY-MM-DD
    return date.toISOString().split('T')[0];
  };
  

  // Set up periodic refresh for product data (every 5 seconds)
  setInterval(fetchProductData, 1000);

  // Initial fetch
  fetchProductData();
  // Set up periodic refresh for scanned NUIDs (every 5 seconds)
  setInterval(scanProduct, 1000);
  // Initial scan
  scanProduct(); // Call the scanProduct function to fetch the latest scanned NUID
});
