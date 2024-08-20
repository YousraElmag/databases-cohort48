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

 
  connection.beginTransaction((err) => {
    if (err) throw err;

   
    connection.query(`
      UPDATE account
      SET balance = balance - 1000
      WHERE account_number = 101;
    `, (err, result) => {
      if (err) {
        return connection.rollback(() => {
          throw err;
        });
      }

     
      connection.query(`
        INSERT INTO account_changes (account_number, amount, changed_date, remark)
        VALUES (101, -1000, NOW(), 'Transfer to account 102');
      `, (err, result) => {
        if (err) {
          return connection.rollback(() => {
            throw err;
          });
        }

     
        connection.query(`
          UPDATE account
          SET balance = balance + 1000
          WHERE account_number = 102;
        `, (err, result) => {
          if (err) {
            return connection.rollback(() => {
              throw err;
            });
          }

          
          connection.query(`
            INSERT INTO account_changes (account_number, amount, changed_date, remark)
            VALUES (102, 1000, NOW(), 'Received from account 101');
          `, (err, result) => {
            if (err) {
              return connection.rollback(() => {
                throw err;
              });
            }

        
            connection.commit((err) => {
              if (err) {
                return connection.rollback(() => {
                  throw err;
                });
              }
              console.log('Transaction completed successfully.');
              connection.end()
            });
          });
        });
      });
    });
  });
});
console.log('hello')
