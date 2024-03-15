const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const csvParser = require('csv-parser');

const sqliteFilePath = 'bonds.db';
const csvFilePathDonators = 'purchaser.csv';

// Check if the SQLite file exists, if not create a new one
const dbExists = fs.existsSync(sqliteFilePath);
const db = new sqlite3.Database(sqliteFilePath);

// Create the donators table if the database is newly created
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS donators (
            date TEXT,
            purchaser TEXT,
            denomination INTEGER
        )`);
    });

// Function to process the donators CSV and insert data into the table
function processDonatorsCSV(filePath) {
    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
            db.run(`INSERT INTO donators (date, purchaser, denomination) 
                    VALUES (?, ?, ?)`, 
                    [row['Date of Purchase'], row['Purchaser Name'], row['Denomination']]);
        })
        .on('end', () => {
            console.log(`${filePath} CSV file successfully processed`);
            db.close(); // Close the database connection after processing
        })
        .on('error', (error) => {
            console.error(`Error processing CSV: ${error}`);
            db.close(); // Close the database connection in case of error
        });
}

// Process the donators CSV file
processDonatorsCSV(csvFilePathDonators);

