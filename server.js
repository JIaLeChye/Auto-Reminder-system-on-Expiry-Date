const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;

const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const username = 'Web';
const password = 'web123';
const topic = 'aerims/nuid';
const qos = 2;
const mqtt_url = 'mqtts://j6ee141d.ala.us-east-1.emqxsl.com:8883/mqtt';

const option = {
  clientId,
  username,
  password,
};

const client = mqtt.connect(mqtt_url, option);

  const dbConfig = {
    host: '192.168.85.214',
    user: 'AERIMS',
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

// Handle MQTT messages
client.on('message', async (topic, payload) => {
  try {
    console.log('message received on topic:', topic, payload.toString());
    const rfidNUID = payload.toString();
    const insertQuery = 'INSERT INTO Product_data (NUID) VALUES (?)';
    await connection.execute(insertQuery, [rfidNUID]);
    console.log('RFID NUID inserted successfully:', rfidNUID);
  } catch (error) {
    console.error('Error inserting RFID NUID:', error);
  }
});



  app.use(cors());
  app.use(express.json());

  app.get('/latestRFIDNUID', async (req, res) => {
    try {
      const [latestRFIDNUIDRow] = await connection.query(
        'SELECT * FROM Product_data ORDER BY timestamp_column DESC LIMIT 1'
      );
  
      // Access the first (and only) row
      const latestRFIDNUIDRowData = latestRFIDNUIDRow[0];
  
      // Access individual fields and handle null values
      const latestRFIDNUID = latestRFIDNUIDRowData?.NUID || null;
      const productName = latestRFIDNUIDRowData?.Product_name || null;
      const expiryDate = latestRFIDNUIDRowData?.expiry_date || null;
  
      //console.log('Latest RFID NUID:', latestRFIDNUID);
      //console.log('Product Name:', productName);
      //console.log('Expiry Date:', expiryDate);
  
      res.json({ latestRFIDNUID, productName, expiryDate });
    } catch (error) {
      console.error('Error fetching latest RFID NUID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  const selectAllProductDataQuery =
    'SELECT NUID, Product_name, DATE_FORMAT(expiry_date, "%Y-%m-%d %H:%i:%s") AS expiry_date FROM Product_data';

  app.get('/allProductData', async (req, res) => {
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

  app.post('/modifyProduct', async (req, res) => {
    try {
      const { rfidCode, productName, expiryDate } = req.body;

      if (!productName || !expiryDate) {
        return res.status(400).json({ success: false, message: 'Product name and expiry date are required.' });
      }

      const updateQuery = 'UPDATE Product_data SET Product_name = ?, expiry_date = ? WHERE NUID = ?';

      await connection.execute(updateQuery, [productName, expiryDate, rfidCode]);
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
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