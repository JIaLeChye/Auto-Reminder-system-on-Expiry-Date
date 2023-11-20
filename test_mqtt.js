const express = require('express');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 3000;

const dbConfig = {
  // Specify your MySQL database details
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'AERIMS',
  insecureAuth: true, 
};

const connection = mysql.createConnection(dbConfig);


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
