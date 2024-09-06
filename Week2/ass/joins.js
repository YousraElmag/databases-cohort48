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
        console.log('Author Mentors:', rows);
        return rows;
    } catch (error) {
        console.error('Error in getAuthorMentors:', error);
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
        console.log('Authors and Papers:', rows);
        return rows;
    } catch (error) {
        console.error('Error in getAuthorsAndPapers:', error);
        throw error;
    }
}

// Call the functions and handle the promises
(async function runQueries() {
    await getAuthorMentors();
    await getAuthorsAndPapers();
})();

