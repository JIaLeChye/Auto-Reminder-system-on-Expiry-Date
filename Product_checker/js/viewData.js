document.addEventListener('DOMContentLoaded', () => {
  let latestScannedNUID = null; // Variable to store the latest scanned NUID
  const productDataListElement = document.getElementById('productDataList');
  const serverIP = '35.208.206.13'; // Replace with your server's external IP

  // const pingServer = async () => {
  //   try {
  //     const response = await fetch(`http://${serverIP}:3000/aerims/ping`);
  //     if (response.ok) {
  //       const result = await response.text();
  //       console.log('Ping successful:', result);
  //     } else {
  //       console.error('Ping failed:', response.status);
  //     }
  //   } catch (error) {
  //     console.error('Error pinging server:', error);
  //   }
  // };

  // // Periodically ping the server (every 5 seconds)
  // setInterval(pingServer, 1000);

  // // Initial ping
  // pingServer();

  const scanProduct = async () => {
    try {
      const response = await fetch(`http://${serverIP}:3000/aerims/latestRFIDNUID`);
      if (!response.ok) {
        throw new Error('Failed to fetch latest RFID NUID');
      }
      const data = await response.json();
      const latestRFIDNUID = data.latestRFIDNUID;
      latestScannedNUID = latestRFIDNUID; // Update the latest scanned NUID
    } catch (error) {
      console.error('Error fetching latest RFID NUID:', error);
    }
  };

  const fetchProductData = async () => {
    try {
      const response = await fetch(`http://${serverIP}:3000/aerims/allProductData`);
      if (!response.ok) {
        throw new Error('Failed to fetch product data');
      }
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
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
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