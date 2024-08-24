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


async function columnExists(tableName, columnName) {
    const [rows] = await pool.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = ? AND COLUMN_NAME = ?
    `, [tableName, columnName]);
    return rows.length > 0;
}

async function addColumn() {
    try {
        // Check if the column exists
        if (!(await columnExists('authors', 'mentor'))) {
            // Add the new column
            const [result] = await pool.query(`
                ALTER TABLE authors
                ADD COLUMN mentor INT;
                ADD CONSTRAINT fk_mentor FOREIGN KEY (mentor) REFERENCES authors(author_id);

            `);
            console.log('Column "mentor" added successfully.');
            return result;
        } else {
            console.log('Column "mentor" already exists.');
        }
    } catch (error) {
        console.error('Error adding column:', error);
        throw error;
    }
}





async function main() {
    try {
        await createTable(); 
        await addColumn(); 
      
        console.log("Table and foreign key setup successfully!");
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
