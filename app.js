// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3000;
// Create an Express application

app.use(bodyParser.json());

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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});






