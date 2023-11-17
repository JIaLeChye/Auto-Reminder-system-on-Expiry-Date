const express = require('express');
const mqtt = require('mqtt');
const mysql = require('mysql');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const username = 'Web';
const password = 'web123';
const topic = 'areims/nuid';
const client = mqtt.connect('mqtts://j6ee141d.ala.us-east-1.emqxsl.com:8883/mqtt', {
  clientId,
  username, 
  password, 
})

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


client.on('connect', () => {
  console.log('Connected to MQTT broker');
  //client.subscribe('aerims/nuid');
  //const topic = 'areims/nuid'
  const qos = 0
  client.subscribe(topic, {qos}, (error) => {
    if(error)
    {
      console.log('subscrbe error:', error)
    return
    }
  
    console.log(`subscribe to '${topic}'`)
  })
});






client.on('message', (topic , payload) => {
  //const topic = receivedTopic.toString();
  //const topic = 'aerims/nuid'; 
  //const sub_topic = topic.toString();
  console.log('message received on topic:', topic);
  const rfidNUID = payload.toString();
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
