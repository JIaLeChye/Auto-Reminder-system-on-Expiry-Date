document.addEventListener('DOMContentLoaded', () => {
  let latestScannedNUID = '';
  const productDataListElement = document.getElementById('productDataList');
  const serverIP = '35.208.206.13';

  const scanProduct = async () => {
    try {
      const response = await fetch(`http://${serverIP}:3000/aerims/latestRFIDNUID`);
      const data = await response.json();
      const latestRFIDNUID = data.latestRFIDNUID;
      latestScannedNUID = latestRFIDNUID;
    } catch (error) {
      console.error('Error fetching latest RFID NUID:', error);
    }
  };

  const fetchProductData = async () => {
    try {
      const response = await fetch(`http://${serverIP}:3000/aerims/allProductData`);
      const data = await response.json();

      console.log('Fetched product data:', data);

      if (productDataListElement) {
        if (data.productData && data.productData.length > 0) {
          const productListHTML = data.productData.map(product => {
            const isScannedProduct = product.NUID === latestScannedNUID;

            // Add expiry reminder
            const expiryDate = new Date(product.expiry_date);
            const expiryReminderClass = getExpiryReminderClass(expiryDate);

            return `
              <div class="product ${expiryReminderClass}${isScannedProduct ? ' scanned-product' : ''}">
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

  // Function to get class based on remaining days
  const getExpiryReminderClass = (expiryDate) => {
    const currentDate = new Date();
    const remainingDays = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));

    if (remainingDays > 30) {
      return 'long-life';
    } else if (remainingDays > 15) {
      return 'medium-life';
    } else if (remainingDays > 7) {
      return 'short-life';
    } else if (remainingDays >= 0) {
      return 'near-expiry';
    } else {
      return 'expired';
    }
  };

  // Initial fetch
  fetchProductData();
  // Set up periodic refresh for scanned NUIDs (every 5 seconds)
  setInterval(scanProduct, 5000);
  // Set up periodic refresh for product data (every 5 seconds)
  setInterval(fetchProductData, 5000);
});
