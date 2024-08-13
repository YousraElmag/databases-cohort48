const mysql = require('mysql2');


const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'hyfuser',
    password: 'hyfpassword',
    database: 'my_key'
}).promise();


async function getAuthorMentors() {
    try {
        const [rows] = await pool.query(`
            SELECT a.author_name AS Author, m.author_name AS Mentor
            FROM authors a
            LEFT JOIN authors m ON a.mentor = m.author_id;
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}


async function getAuthorsAndPapers() {
    try {
        const [rows] = await pool.query(`
            SELECT a.*, rp.paper_title
            FROM authors a
            LEFT JOIN author_papers ap ON a.author_id = ap.author_id
            LEFT JOIN research_papers rp ON ap.paper_id = rp.paper_id;
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}
getAuthorMentors()
getAuthorsAndPapers()