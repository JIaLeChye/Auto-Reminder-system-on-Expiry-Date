
const serverURL =  'http://xxx.xxx.xxx.xxx:3000/aerims' ; // Replace to your pubilc IP Address 

document.addEventListener('DOMContentLoaded', () => {
  // const latestRFIDNUIDElement = document.getElementById('latestRFIDNUID');
  const rfidCodeDisplayElement = document.getElementById('rfidCodeDisplay');
  const productNameElement = document.getElementById('productName');
  const expiryDateElement = document.getElementById('expiryDate');
  
  const fetchLatestRFIDNUID = async () => {
    try {
      const response = await fetch(`${serverURL}/latestRFIDNUID`);
      const data = await response.json();

      const {latestRFIDNUID, productName,expiryDate} = data; 
      //new Date(expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      //const storedRFIDNUID = localStorage.getItem('latestRFIDNUID');
      const currentRFID = rfidCodeDisplayElement.innerText.split(': ')[1];


      if (latestRFIDNUID !== currentRFID) {
        if (rfidCodeDisplayElement) {
          rfidCodeDisplayElement.innerText = `RFID Code: ${latestRFIDNUID}`;
          if (productName === undefined){
            console.log(`NOT FOUND: NUID: ${latestRFIDNUID} Product_name: ${productName} Expiry_date: ${expiryDate}`)
            productNameElement.value = '';
            expiryDateElement.value = '';
            //consoe.log('NUID: ${rfidCode} Product_name: ${productName} Expiry_date: ${expiryDate}')
          } else {
            console.log(`FOUND: NUID: ${latestRFIDNUID} Product_name: ${productName} Expiry_date: ${expiryDate}`)
            productNameElement.value = productName;
            expiryDateElement.value = new Date(expiryDate).toISOString().split('T')[0];
            
          }
         
  
          localStorage.setItem('latestRFIDNUID', latestRFIDNUID); 
        } else {
          console.error('Element with id "rfidCodeDisplay" not found.');
        }
      } 
    } catch (error) {
      console.error('Error fetching latest RFID NUID:',error);
    }
  };

//   // Check if the element exists before adding the event listener
//   if (document.getElementById('modifyProductForm')) {
//     document.getElementById('modifyProductForm').addEventListener('submit', (event) => {
//       event.preventDefault();
//       modifyProduct();
//     });
//   } else {
//     console.error('Element with id "modifyProductForm" not found.');
//   }

//   fetchLatestRFIDNUID();
//   setInterval(fetchLatestRFIDNUID, 1000);
// });
document.getElementById('modifyProductForm').addEventListener('submit', (event) => {
  event.preventDefault();
  modifyProduct();

});
fetchLatestRFIDNUID();
setInterval(fetchLatestRFIDNUID, 1000);

const modifyProduct = async () => {
  const rfidCode = document.getElementById('rfidCodeDisplay').innerText.split(': ')[1];
  const productName = productNameElement.value;
  const expiryDateInput = expiryDateElement;
  const expiryDate = expiryDateInput.value;

  // Validate expiry date
  const currentDate = new Date();
  const selectedDate = new Date(expiryDate);
  selectedDate.setMinutes(selectedDate.getMinutes() - selectedDate.getTimezoneOffset());


  if (selectedDate < currentDate) {
    alert('Expiry date cannot be earlier than today.');
    console.log('expiryDate:', expiryDate);
    console.log('selectedDate.toISOString():', selectedDate.toISOString());
    return;
  }

  try {
    const response = await fetch(`${serverURL}/modifyProduct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rfidCode, productName, expiryDate: selectedDate.toISOString().split('T')[0] }),
    });

    const data = await response.json();

    if (data.success) {
      alert('Product modified successfully!');
      // Clear input fields after successful modification
      document.getElementById('productName').value = '';
      expiryDateInput.value = '';
      // Reload the page to reflect changes immediately
      //location.reload();
    } else {
      alert('Failed to modify product. Please try again.');
    }
  } catch (error) {
    console.error('Error modifying product:', error);
    alert('An error occurred while modifying the product.');
  }
  };
  window.modifyProduct = modifyProduct;
}); 