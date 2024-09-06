const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'hyfuser',
    password: 'hyfpassword',
    database: 'my_key'
}).promise();

async function createTables() {
    try {
        // Create authors table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS authors (
                author_id INT PRIMARY KEY AUTO_INCREMENT, 
                author_name VARCHAR(255),
                university VARCHAR(255),
                date_of_birth DATE,
                h_index INT,
                gender ENUM('male', 'female', 'other')
            )
        `);

        // Create research_papers table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS research_papers (
                paper_id INT PRIMARY KEY AUTO_INCREMENT,
                paper_title VARCHAR(255),
                conference VARCHAR(255),
                publish_date DATE
            )
        `);

        // Create author_papers junction table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS author_papers (
                author_id INT,
                paper_id INT,
                FOREIGN KEY (author_id) REFERENCES authors(author_id),
                FOREIGN KEY (paper_id) REFERENCES research_papers(paper_id)
            )
        `);

        console.log('Tables created successfully.');
    } catch (error) {
        console.error('Error creating tables:', error.message);
        throw error;
    }
}

async function columnExists(tableName, columnName) {
    const [rows] = await pool.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = ? AND COLUMN_NAME = ?
    AND TABLE_SCHEMA = 'my_key'
    `, [tableName, columnName]);
    return rows.length > 0;
}

async function addColumn() {
    try {
        // Check if the column exists
        if (!(await columnExists('authors', 'mentor'))) {
            // Add the new column
            await pool.query(`
                ALTER TABLE authors
                ADD COLUMN mentor INT
            `);

            // Add foreign key constraint
            await pool.query(`
                ALTER TABLE authors
                ADD CONSTRAINT fk_mentor FOREIGN KEY (mentor) REFERENCES authors(author_id)
            `);

            console.log('Column "mentor" added successfully.');
        } else {
            console.log('Column "mentor" already exists.');
        }
    } catch (error) {
        console.error('Error adding column:', error.message);
        throw error;
    }
}

async function insertData() {
    try {
        // Insert 15 authors
        const authors = [
            ['Alice', 'MIT', '1970-01-01', 45, 'female'],
            ['Bob', 'Harvard', '1975-02-14', 50, 'male'],
            ['Charlie', 'Stanford', '1980-03-22', 40, 'male'],
            ['Diana', 'Oxford', '1985-04-10', 42, 'female'],
            ['Eve', 'Cambridge', '1990-05-18', 38, 'female'],
            ['Frank', 'Berkeley', '1972-06-25', 46, 'male'],
            ['Grace', 'Caltech', '1978-07-02', 47, 'female'],
            ['Heidi', 'ETH Zurich', '1983-08-12', 39, 'female'],
            ['Ivan', 'University of Tokyo', '1988-09-30', 41, 'male'],
            ['Judy', 'Tsinghua University', '1973-10-07', 44, 'female'],
            ['Karl', 'University of Toronto', '1976-11-11', 43, 'male'],
            ['Laura', 'Imperial College London', '1982-12-20', 37, 'female'],
            ['Mallory', 'National University of Singapore', '1987-01-15', 35, 'female'],
            ['Nathan', 'EPFL', '1992-02-28', 36, 'male'],
            ['Olivia', 'University of Melbourne', '1984-03-19', 39, 'female']
        ];

        for (const author of authors) {
            await pool.query(
                `INSERT INTO authors (author_name, university, date_of_birth, h_index, gender) VALUES (?, ?, ?, ?, ?)`,
                author
            );
        }

        // Insert 30 research papers
        const researchPapers = [
            ['AI in 2024', 'NeurIPS', '2024-06-01'],
            ['Quantum Computing', 'QIP', '2024-07-15'],
            ['Deep Learning Advances', 'ICML', '2024-05-23'],
            ['Blockchain in Finance', 'IEEE', '2024-08-10'],
            ['Cybersecurity Trends', 'Black Hat', '2024-09-05'],
            ['Natural Language Processing', 'ACL', '2024-10-14'],
            ['Robotics and AI', 'ICRA', '2024-11-20'],
            ['Genomics and AI', 'ISMB', '2024-12-11'],
            ['Climate Change Modeling', 'COP28', '2024-01-30'],
            ['Advanced Cryptography', 'CRYPTO', '2024-02-18'],
            ['Renewable Energy Systems', 'IEEE PES', '2024-03-10'],
            ['Big Data Analytics', 'BigData', '2024-04-01'],
            ['Autonomous Vehicles', 'CVPR', '2024-05-06'],
            ['Smart Cities', 'IoT', '2024-06-17'],
            ['Artificial General Intelligence', 'IJCAI', '2024-07-27'],
            ['Edge Computing', 'MobiCom', '2024-08-15'],
            ['Healthcare Informatics', 'AMIA', '2024-09-21'],
            ['Quantum Machine Learning', 'NeurIPS', '2024-10-05'],
            ['Data Privacy', 'PETS', '2024-11-13'],
            ['5G Networks', 'IEEE GLOBECOM', '2024-12-03'],
            ['Blockchain for IoT', 'IEEE Blockchain', '2024-01-14'],
            ['AI in Healthcare', 'AAAI', '2024-02-09'],
            ['Wearable Technology', 'CHI', '2024-03-22'],
            ['Natural Disaster Prediction', 'ECCV', '2024-04-13'],
            ['Space Exploration Technologies', 'IEEE Aerospace', '2024-05-29'],
            ['Human-Computer Interaction', 'UIST', '2024-06-08'],
            ['Neuroscience and AI', 'NIPS', '2024-07-11'],
            ['Smart Grids', 'IEEE PowerTech', '2024-08-23'],
            ['Social Media Analysis', 'WWW', '2024-09-30'],
            ['Artificial Life', 'ALIFE', '2024-10-19']
        ];

        for (const paper of researchPapers) {
            await pool.query(
                `INSERT INTO research_papers (paper_title, conference, publish_date) VALUES (?, ?, ?)`,
                paper
            );
        }

        // Insert into author_papers to link authors and research papers
        const authorPapers = [
            [1, 1], [1, 5],
            [2, 2], [2, 10],
            [3, 3], [3, 6],
            [4, 4], [4, 8],
            [5, 7], [5, 11],
            [6, 9], [6, 12],
            [7, 13], [7, 17],
            [8, 14], [8, 18],
            [9, 15], [9, 20],
            [10, 16], [10, 21],
            [11, 19], [11, 22],
            [12, 23], [12, 26],
            [13, 24], [13, 29],
            [14, 25], [14, 30],
            [15, 27], [15, 28]
        ];

        for (const authorPaper of authorPapers) {
            await pool.query(
                `INSERT INTO author_papers (author_id, paper_id) VALUES (?, ?)`,
                authorPaper
            );
        }

        console.log('Data inserted successfully.');
    } catch (error) {
        console.error('Error inserting data:', error.message);
        throw error;
    }
}

async function main() {
    try {
        await createTables(); 
        await addColumn(); 
        await insertData();
        console.log("Table and foreign key setup successfully!");
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await pool.end();
        console.log("Database connection closed.");
    }
}

main();
