
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'meetup'
});

connection.connect(error => {
  if (error) {
    console.error('Error connecting to the database:', error.stack);
    return;
  }
  console.log('Connected to the database as ID', connection.threadId);

  const queries = [
    `CREATE TABLE IF NOT EXISTS employees (
      id INT AUTO_INCREMENT PRIMARY KEY,
      invitee_no VARCHAR(100),
      invitee_name VARCHAR(50),
      invited_by DECIMAL(10, 2)
    );`,
    `CREATE TABLE IF NOT EXISTS Room (
      id INT AUTO_INCREMENT PRIMARY KEY,
      room_no VARCHAR(100),
      room_name VARCHAR(50),
      floor_number DECIMAL(10, 2)
    );`,
    `CREATE TABLE IF NOT EXISTS Meeting (
      id INT AUTO_INCREMENT PRIMARY KEY,
      meeting_no VARCHAR(100),
      meeting_title VARCHAR(50),
      starting_time DATETIME,
      ending_time DATETIME,
      room_no VARCHAR(100)
    );`,
    `INSERT INTO employees (invitee_no, invitee_name, invited_by) VALUES
    ('INV001', 'Alice Johnson', 500.00),
    ('INV002', 'Bob Smith', 300.00),
    ('INV003', 'Charlie Brown', 450.00),
    ('INV004', 'Diana Prince', 600.00),
    ('INV005', 'Eve Adams', 550.00);`,
    `INSERT INTO Room (room_no, room_name, floor_number) VALUES
    ('R001', 'Conference Room A', 1),
    ('R002', 'Conference Room B', 1),
    ('R003', 'Meeting Room C', 2),
    ('R004', 'Meeting Room D', 2),
    ('R005', 'Executive Room', 3);`,
    `INSERT INTO Meeting (meeting_no, meeting_title, starting_time, ending_time, room_no) VALUES
    ('M001', 'Team Sync', '2024-08-07 09:00:00', '2024-08-07 10:00:00', 'R001'),
    ('M002', 'Project Kickoff', '2024-08-07 10:30:00', '2024-08-07 11:30:00', 'R002'),
    ('M003', 'Weekly Review', '2024-08-07 13:00:00', '2024-08-07 14:00:00', 'R003'),
    ('M004', 'Client Presentation', '2024-08-07 15:00:00', '2024-08-07 16:30:00', 'R004'),
    ('M005', 'Strategic Planning', '2024-08-07 17:00:00', '2024-08-07 18:00:00', 'R005');`
  ];

  function executeQuery(query) {
    return new Promise((resolve, reject) => {
      connection.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  async function runQueriesInSequence() {
    try {
      for (const query of queries) {
        await executeQuery(query);
        console.log('Query executed successfully.');
      }
    } catch (err) {
      console.error('Error executing query:', err.stack);
    } finally {
      connection.end();
    }
  }

  runQueriesInSequence();
});
