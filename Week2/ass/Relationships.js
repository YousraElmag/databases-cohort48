const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'hyfuser',
    password: 'hyfpassword',
    database: 'my_key'
}).promise();

async function createResearchPapersTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS research_papers (
                paper_id INT PRIMARY KEY AUTO_INCREMENT,
                paper_title VARCHAR(255),
                conference VARCHAR(255),
                publish_date DATE,
                author_id INT,
                FOREIGN KEY (author_id) REFERENCES authors(author_id)
            )
        `);
        console.log('Research Papers table created successfully.');
    } catch (error) {
        console.error('Error creating research papers table:', error.message);
    }
}
async function creatrelation (){
    try{
        await pool.query(`CREATE TABLE IF NOT EXISTS author_papers (
            author_id INT,
            paper_id INT,
            PRIMARY KEY (author_id, paper_id),
            FOREIGN KEY (author_id) REFERENCES authors(author_id),
            FOREIGN KEY (paper_id) REFERENCES research_papers(paper_id)
        )`)
    }catch(error){
        throw error
    }
}


async function main() {
    try {
        await createResearchPapersTable();
        await creatrelation();
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await pool.end();
        console.log("Database connection closed.");
    }
}

main();
