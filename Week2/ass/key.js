const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'hyfuser',
    password: 'hyfpassword',
    database: 'my_key'
}).promise();

async function createTable() {
    try {
        const [table] = await pool.query(`
          CREATE TABLE IF NOT EXISTS authors (
                author_id INT PRIMARY KEY AUTO_INCREMENT, 
                author_name VARCHAR(255),
                university VARCHAR(255),
                date_of_birth DATE,
                h_index INT,
                gender ENUM('male', 'female', 'other')
            )
        `);
        return table;
    } catch (error) {
        throw error;
    }
}

async function addColumn() {
    try {
        const [column] = await pool.query(`
            ALTER TABLE authors 
            ADD COLUMN mentor INT;
        `);
        return column;
    } catch (error) {
        throw error;
    }
}

async function addForeignKey() {
    try {
        const [key] = await pool.query(`
            ALTER TABLE authors
            ADD CONSTRAINT fk_mentor
            FOREIGN KEY (mentor) REFERENCES authors(author_id);
        `);
        return key;
    } catch (error) {
        throw error;
    }
}
addForeignKey()
createTable()
addColumn()