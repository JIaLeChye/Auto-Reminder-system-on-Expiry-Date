const express = require('express');
const mqtt = require('mqtt');
const mysql = require('mysql');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const username = 'Web';
const password = 'web123';
const topic = 'aerims/nuid';
const qos = 2; 
const mqtt_url = 'mqtts://j6ee141d.ala.us-east-1.emqxsl.com:8883/mqtt'

const option = {
  clientId,
  username, 
  password, 
}

const client = mqtt.connect(mqtt_url, option);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
});

client.subscribe(topic, (qos), (error) => {
  if (error) {
    console.log('subscribe error:', error)
    return
  }
  console.log(`Subscribe to topic '${topic}'`)
}); 



const dbConfig = {
  // Specify your MySQL database details
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'AERIMS',
  insecureAuth: true, 
};

const connection = mysql.createConnection(dbConfig);

// Function to check the database connection
const checkDatabaseConnection = () => {
  connection.ping((error) => {
    if (error) {
      console.error('Error connecting to MySQL database:', error);
    } else {
      console.log('Connected to MySQL database');
    }
  });
};

// Check the database connection on application startup
checkDatabaseConnection();



client.on('message', (topic , payload) => {

  console.log('message received on topic:', topic, payload.toString());
  const rfidNUID = payload.toString();
  const insertQuery = `INSERT INTO Product_data (NUID) VALUES ('${rfidNUID}')`;

  connection.query(insertQuery, (error, results) => {
    if (error) {
      console.error('Error inserting RFID NUID:', error);
    } else {
      console.log('RFID NUID inserted successfully:', rfidNUID);
    }
  });
});


app.get('/rfidNUIDs', (req, res) => {
  const selectQuery = 'SELECT Product_data FROM NUID';

  connection.query(selectQuery, (error, results) => {
    if (error) {
      console.error('Error fetching RFID NUIDs:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const rfidNUIDs = results.map((result) => result.rfid_code);
      res.json({ rfidNUIDs });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
