const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword'
});


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

    await executeQuery('DROP DATABASE IF EXISTS meetup;');
    console.log('Dropped existing database (if any).');

    await executeQuery('CREATE DATABASE meetup;');
    console.log('Database "meetup" created.');

    connection.changeUser({ database: 'meetup' }, async (err) => {
      if (err) throw err;

 
      const queries = [
        `CREATE TABLE IF NOT EXISTS Invitee (
          invitee_no VARCHAR(100) PRIMARY KEY,
          invitee_name VARCHAR(50),
          invited_by VARCHAR(100)
        );`,
        `CREATE TABLE IF NOT EXISTS Room (
          room_no VARCHAR(100) PRIMARY KEY,
          room_name VARCHAR(50),
          floor_number INT
        );`,
        `CREATE TABLE IF NOT EXISTS Meeting (
          meeting_no VARCHAR(100) PRIMARY KEY,
          meeting_title VARCHAR(50),
          starting_time DATETIME,
          ending_time DATETIME,
          room_no VARCHAR(100),
          FOREIGN KEY (room_no) REFERENCES Room(room_no)
        );`,
        `INSERT INTO Invitee (invitee_no, invitee_name, invited_by) VALUES
        ('INV001', 'Alice Johnson', 'John Doe'),
        ('INV002', 'Bob Smith', 'Jane Doe'),
        ('INV003', 'Charlie Brown', 'John Doe'),
        ('INV004', 'Diana Prince', 'Bob Smith'),
        ('INV005', 'Eve Adams', 'Jane Doe');`,
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


      for (const query of queries) {
        await executeQuery(query);
        console.log('Query executed successfully.');
      }

      connection.end();
    });
  } catch (err) {
    console.error('Error executing query:', err.stack);
    connection.end();
  }
}

runQueriesInSequence();
