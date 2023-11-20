// Function to fetch and display product data
const fetchProductData = async () => {
    try {
      const response = await fetch('http://localhost:3000/allProductData');
      const data = await response.json();
  
      const productDataListElement = document.getElementById('productDataList');
      if (productDataListElement) {
        if (data.productData && data.productData.length > 0) {
          const productListHTML = data.productData.map(product => `
            <div>
              <strong>NUID:</strong> ${product.NUID}<br>
              <strong>Product Name:</strong> ${product.Product_name}<br>
              <strong>Expiry Date:</strong> ${formatDate(product.expiry_date)}<br>
              <hr>
            </div>
          `).join('');
  
          productDataListElement.innerHTML = productListHTML;
        } else {
          productDataListElement.innerHTML = 'No product data available.';
        }
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };
  
  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };
  
  // Fetch product data on page load
  fetchProductData();
  
  // Set up periodic refresh (every 1 seconds)
  setInterval(fetchProductData, 1000);
