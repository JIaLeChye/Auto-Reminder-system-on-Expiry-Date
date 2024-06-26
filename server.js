const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;
const serverIP = '0.0.0.0';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const username = 'AERIMS_WEB';
const password = 'aerims_web';
const topic = 'aerims/nuid';
const qos = 2;
const mqtt_url = 'mqtts://bc26983f.ala.us-east-1.emqxsl.com:8883/mqtt';

const option = {
  clientId,
  username,
  password,
};

const client = mqtt.connect(mqtt_url, option);

  const dbConfig = {
    host: '127.0.0.1',
    user: 'aerims',
    password: '123',
    database: 'aerims',
    insecureAuth: true,
  };

  let connection; // Declare the connection variable outside the function

  async function startServer() {
    try {
      connection = await checkDatabaseConnection();
    } catch (error) {
      console.error('Error connecting to MySQL database:', error);
    }
    client.on('connect', () => {
      console.log('Connected to MQTT server');
      // You can perform additional tasks here after the MQTT connection is established
      client.subscribe(topic, { qos });
    });

    client.on('error', (error) => {
      console.error('MQTT client error:', error);
      // Handle reconnection or other strategies as needed
    });
  }
  
  async function checkDatabaseConnection() {
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);
      await connection.ping();
      console.log('Connected to MySQL database');
      return connection;
    } catch (error) {
      console.error('Error connecting to MySQL database:', error);
      throw error;
    }
  }
  let latestRFIDNUID = null;
  let isrfidExist = false;
// Handle MQTT messages
client.on('message', async (topic, payload) => {
  try {
    console.log('Message received on topic:', topic, payload.toString());
    const rfidNUID = payload.toString();
    latestRFIDNUID = rfidNUID; // Update the latest RFID NUID
    const checkQuery = 'SELECT NUID FROM Product_data WHERE NUID = ?';
    const [rows] = await connection.execute(checkQuery, [rfidNUID]);
    if (rows.length > 0) {
      isrfidExist = true;
      console.log('RFID NUID exists in the database', rfidNUID);
    } else {
      isrfidExist = false;
      console.log('RFID NUID does not exist in the database', rfidNUID);
    }
  } catch (error) {
    console.error('Error handling MQTT message:', error);
  }
});


  app.use(cors());
  app.use(express.json());
  app.get('/aerims/ping', (req,res) =>{
   console.log('Pinrecoved from the webpage side');
   res.send('server is up and running');
  });

  app.get('/aerims/latestRFIDNUID', async (req, res) => {
    try {
      if (isrfidExist === true )
        {
        const [rows] = await connection.execute('SELECT * FROM Product_data WHERE NUID = ?', [latestRFIDNUID]);
        const rfidCode = rows[0].NUID;
        const productName = rows[0].Product_name; 
        const expiryDate = rows[0].expiry_date; 
        res.json({ latestRFIDNUID, productName, expiryDate });
        } else { 
        res.json({ latestRFIDNUID });
        } 
  //      console.log('NUID send to the Webpage')
    } catch (error) {
      console.error('Error fetching latest RFID NUID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  const selectAllProductDataQuery =
    'SELECT NUID, Product_name, DATE_FORMAT(expiry_date, "%Y-%m-%d") AS expiry_date FROM Product_data ORDER BY expiry_date';

  app.get('/aerims/allProductData', async (req, res) => {
    try {
      const [results] = await connection.query(selectAllProductDataQuery);
      const productData = results.map((result) => ({
        NUID: result.NUID,
        Product_name: result.Product_name,
        expiry_date: result.expiry_date,
      }));
      res.json({ productData });
    } catch (error) {
      console.error('Error fetching all product data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.post('/aerims/modifyProduct', async (req, res) => {
    try {
      const { rfidCode, productName, expiryDate } = req.body;

      if (!productName || !expiryDate) {
        return res.status(400).json({ success: false, message: 'Product name and expiry date are required.' });
      }
    if (isrfidExist === false)
      {
      const insertQuery = 'INSERT INTO Product_data (NUID, Product_name, expiry_date) VALUES (?, ?, ?)';
      console.log(`Insert Request: NUID: ${rfidCode} Product_name: ${productName} Expiry_date: ${expiryDate}`)
      await connection.execute(insertQuery, [rfidCode, productName, expiryDate]);
      //console.log(`Insert Request: NUID: ${rfidCode} Product_name: ${productName} Expiry_date: ${expiryDate}`)
      } else {
      const updateQuery = 'UPDATE Product_data SET Product_name = ?, expiry_date = ?  WHERE NUID = ?';
      console.log(`Modify Request: NUID: ${rfidCode} Product_name: ${productName} Expiry_date: ${expiryDate}`)
      await connection.execute(updateQuery, [productName, expiryDate, rfidCode]);
      }
      res.json({ success: true, message: 'Product modified successfully' });
    } catch (error) {
      console.error('Error modifying product:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } 
  });
  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
  
  
   
  app.listen(port,serverIP, () => {
    console.log(`Server is running ${serverIP} on port ${port}`);
  });
  
  startServer();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    try {
      await connection.end();
      console.log('MySQL connection closed.');
      client.end(); // Close the MQTT connection
      console.log('MQTT connection closed.');
      process.exit();
    } catch (error) {
      console.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  }); 