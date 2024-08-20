const mysql = require('mysql2');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword', 
  database: 'transfer' 
});


connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database.');

  const insertAccounts = `
    INSERT INTO account (account_number, balance)
    VALUES
      (101, 5000.00),
      (102, 3000.00)
    ON DUPLICATE KEY UPDATE balance = VALUES(balance);
  `;

  const insertAccountChanges = `
    INSERT INTO account_changes (account_number, amount, changed_date, remark)
    VALUES
      (101, 5000.00, NOW(), 'Initial deposit'),
      (102, 3000.00, NOW(), 'Initial deposit');
  `;

  connection.query(insertAccounts, (err) => {
    if (err) throw err;
    console.log('Sample data inserted into account table.');
  });

  connection.query(insertAccountChanges, (err) => {
    if (err) throw err;
    console.log('Sample data inserted into account_changes table.');
    connection.end();
  });
});
