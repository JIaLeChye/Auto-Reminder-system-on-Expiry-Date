// Function to fetch and display product data
const fetchProductData = async () => {
  try {
    const response = await fetch('http://localhost:3000/allProductData');
    const { productData } = await response.json();

    const productDataListElement = document.getElementById('productDataList');
    if (productDataListElement) {
      if (productData && productData.length > 0) {
        renderProductData(productDataListElement, productData);
      } else {
        productDataListElement.innerHTML = 'No product data available.';
      }
    }
  } catch (error) {
    console.error('Error fetching product data:', error);
  }
};

// Function to render product data in HTML
const renderProductData = (element, productData) => {
  const productListHTML = productData
    .map(
      (product) => `
        <div>
          <strong>NUID:</strong> ${product.NUID}<br>
          <strong>Product Name:</strong> ${product.Product_name}<br>
          <strong>Expiry Date:</strong> ${formatDate(product.expiry_date)}<br>
          <hr>
        </div>
      `
    )
    .join('');

  element.innerHTML = productListHTML;
};

// Function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

// Fetch product data on page load
fetchProductData();

// Set up periodic refresh (every 1 minute)
setInterval(fetchProductData, 60000);
