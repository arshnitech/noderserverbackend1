// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;
// Create an Express application

app.use(bodyParser.json());
app.use(cors());

// Create a MySQL connection pool (replace with your database config)
const pool = mysql.createPool({
  host: 'reactnativeapp.cuceurst1z3t.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'aA123456',
  database: 'users',
  connectionLimit: 10,
});
console.log("Create Mysql pool is success!");
// Define a simple route
app.post('/register', (req, res) => {
    console.log("Entered register-user");
    const { name, mobileNumber, location } = req.body;
          res.json({ message: 'Registration successful' });
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to MySQL:', err);
        res.status(500).json({ message: 'Database error. Please try again later.' });
      } else {
          console.log("Connection Success");
        const insertQuery = 'INSERT INTO register (name, mobileNumber, location) VALUES (?, ?, ?)';
        connection.query(insertQuery, [name, mobileNumber, location], (queryErr) => {
          connection.release();
  
          if (queryErr) {
            console.error('Error executing SQL query:', queryErr);
            res.status(500).json({ message: 'Registration failed. Please try again later.' });
          } else {
            res.status(200).json({ message: 'Record inserted successful.' });
          }
        });
      }
    });
});
// Define a GET endpoint to retrieve phone numbers
app.get('/getPhoneNumber', (req, res) => {
    const { phoneNumber } = req.query.phoneNumber;
    console.log('Query Parameters:', req.query.phoneNumber);
    // Validate the phoneNumber format (you can use your validation logic)
   /* if (!validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }*/
  
    // Query the database to retrieve the phone number

    pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error connecting to MySQL:', err);
          res.status(500).json({ message: 'Database error. Please try again later.' });
        } else {
            console.log("Connection Success");
            const query = 'SELECT mobilenumber FROM register WHERE mobilenumber = ?';
    
            connection.query(query, [req.query.phoneNumber], (err, results) => {
      if (err) {
        console.error('Error executing query: ', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Phone number not found' });
      }
       console.log('results length = ' + results)
      const foundPhoneNumber = results[0].mobilenumber;
      console.log("foundPhoneNumber = "+ foundPhoneNumber);
      res.json({ phoneNumber: foundPhoneNumber });
    });
               
        } 
});
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


function validatePhoneNumber(phoneNumber) {
    // Implement your validation logic here
    return true; // Return true for demonstration purposes
  }



