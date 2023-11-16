const express = require('express');
const mqtt = require('mqtt');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3000;

const mqttOptions = {
  // Specify your MQTT broker details
  host: 'j6ee141d.ala.us-east-1.emqxsl.com',
  port: 8883,
  clientId: 'Terminal',
  usernam: 'Haos',
  password: 'null',
};

const mqttClient = mqtt.connect(mqttOptions);

const dbConfig = {
  // Specify your MySQL database details
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'AERIMS',
};

const connection = mysql.createConnection(dbConfig);

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe('rfid/nuids');
});

mqttClient.on('message', (topic, message) => {
  const rfidNUID = message.toString();
  const insertQuery = `INSERT INTO RFIDData (rfid_code) VALUES ('${rfidNUID}')`;

  connection.query(insertQuery, (error, results) => {
    if (error) {
      console.error('Error inserting RFID NUID:', error);
    } else {
      console.log('RFID NUID inserted successfully:', rfidNUID);
    }
  });
});

app.get('/rfidNUIDs', (req, res) => {
  const selectQuery = 'SELECT rfid_code FROM RFIDData';

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
