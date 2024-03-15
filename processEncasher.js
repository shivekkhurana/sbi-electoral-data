const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const csvParser = require('csv-parser');

const sqliteFilePath = 'bonds.db';
const csvFilePath = 'encasher.csv';

// Check if the SQLite file exists, if not create a new one
const dbExists = fs.existsSync(sqliteFilePath);
const db = new sqlite3.Database(sqliteFilePath);

// Create table if the database is newly created
if (!dbExists) {
    db.serialize(() => {
        db.run(`CREATE TABLE parties (
            Date_of_Encashment TEXT,
            Name_of_the_Political_Party TEXT,
            Denomination INTEGER
        )`);
    });
}

// Read CSV and insert data into the table
fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on('data', (row) => {
        db.run(`INSERT INTO parties (Date_of_Encashment, Name_of_the_Political_Party, Denomination) 
                VALUES (?, ?, ?)`, 
                [row['Date of Encashment'], row['Name of the Political Party'], row['Denomination']]);
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
        db.close();
    });

