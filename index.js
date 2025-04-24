const db = require('./db')
const express = require('express');
const getDistance = require('./utils');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
require('dotenv').config()

function init() {
    const createTable = `
    CREATE TABLE IF NOT EXISTS schools(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        address VARCHAR(1000),
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL
        )
        `
    db.query(createTable, (err, result) => {
        if (err) throw err;
        console.log('Table created or already exists')
    })
}

init()

app.post('/addSchool', (req, res) => {
    const { name, address, latitude, longitude } = req.body
    db.query(`INSERT INTO schools (name, address, latitude, longitude) VALUES(?,?,?,?)`, [name, address, latitude, longitude], (err, results) => {
        if (err) {
            return res.status(500).json({
                msg: err
            })
        }
        res.json({
            id: results.insertId,
            name,
            address,
            latitude,
            longitude
        })
    })
})

app.get('/listSchools', (req, res) => {
    const { lat, lng } = req.query;  
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and Longitude are required' });
    }
  
    db.query('SELECT id, name, address, latitude, longitude FROM schools', (err, results) => {
      if (err) throw err;
  
      const schoolsWithDistance = results.map(school => {
        const distance = getDistance(lat, lng, school.latitude, school.longitude);
        return { ...school, distance };
      });
  
      const sortedSchools = schoolsWithDistance.sort((a, b) => a.distance - b.distance);
  
      res.json(sortedSchools);
    });
  });

  app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log(`server listening on port 3000`);
});