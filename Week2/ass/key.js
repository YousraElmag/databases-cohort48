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
        const [rows] = await pool.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'authors' 
            AND COLUMN_NAME = 'mentor';
        `);

        if (rows.length === 0) {
            await pool.query(`
                ALTER TABLE authors 
                ADD COLUMN mentor INT;
            `);
        }
    } catch (error) {
        throw error;
    }
}

async function dropForeignKeyIfExists() {
    try {
        const [rows] = await pool.query(`
            SELECT CONSTRAINT_NAME 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE TABLE_NAME = 'authors' 
            AND CONSTRAINT_NAME = 'fk_mentor';
        `);

        if (rows.length > 0) {
            await pool.query(`
                ALTER TABLE authors
                DROP FOREIGN KEY fk_mentor;
            `);
        }
    } catch (error) {
        throw error;
    }
}

async function addForeignKey() {
    try {
        await pool.query(`
            ALTER TABLE authors
            ADD CONSTRAINT fk_mentor
            FOREIGN KEY (mentor) REFERENCES authors(author_id);
        `);
    } catch (error) {
        if (error.code !== 'ER_FK_DUP_NAME') {
            throw error;
        }
    }
}

async function main() {
    try {
        await createTable(); 
        await addColumn(); 
        await dropForeignKeyIfExists(); 
        await addForeignKey(); 
        console.log("Table and foreign key setup successfully!");
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
