// js/mainPageScript.js

document.addEventListener('DOMContentLoaded', () => {
    const aerimsButton = document.getElementById('aerimsButton');
    const productDataButton = document.getElementById('productDataButton');
  
    aerimsButton.addEventListener('click', () => {
      // Navigate to AERIMS WEB page (replace 'aerimsPage.html' with the actual page)
      window.location.href = 'AERIMS_WEB/index.html';
    });
  
    productDataButton.addEventListener('click', () => {
      // Navigate to Product Data Viewer page (replace 'productDataPage.html' with the actual page)
      window.location.href = 'Product_checker/index.html';
    });
  });
  