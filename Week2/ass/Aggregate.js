const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'hyfuser',
    password: 'hyfpassword',
    database: 'my_key'
}).promise();

// Function to get the number of authors for each research paper
async function getPaperAuthorCounts() {
    try {
        const [rows] = await pool.query(`
            SELECT rp.paper_id, rp.paper_title, COUNT(ap.author_id) AS num_authors
            FROM research_papers rp
            LEFT JOIN author_papers ap ON rp.paper_id = ap.paper_id
            GROUP BY rp.paper_id, rp.paper_title;
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Function to sum the research papers published by female authors
async function sumPapersByFemaleAuthors() {
    try {
        const [rows] = await pool.query(`
            SELECT SUM(paper_count) AS total_papers
            FROM (
                SELECT COUNT(ap.paper_id) AS paper_count
                FROM authors a
                LEFT JOIN author_papers ap ON a.author_id = ap.author_id
                WHERE a.gender = 'female'
                GROUP BY a.author_id
            ) AS paper_counts;
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Function to get the average h-index of authors per university
async function getAverageHIndexPerUniversity() {
    try {
        const [rows] = await pool.query(`
            SELECT university, AVG(h_index) AS avg_h_index
            FROM authors
            GROUP BY university;
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Function to get the total number of papers per university
async function getTotalPapersPerUniversity() {
    try {
        const [rows] = await pool.query(`
            SELECT a.university, COUNT(ap.paper_id) AS total_papers
            FROM authors a
            LEFT JOIN author_papers ap ON a.author_id = ap.author_id
            GROUP BY a.university;
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Function to get the min and max h-index of authors per university
async function getMinMaxHIndexPerUniversity() {
    try {
        const [rows] = await pool.query(`
            SELECT university, MIN(h_index) AS min_h_index, MAX(h_index) AS max_h_index
            FROM authors
            GROUP BY university;
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Example usage
(async () => {
    try {
        const paperAuthorCounts = await getPaperAuthorCounts();
        console.log('Paper Author Counts:', paperAuthorCounts);

        const totalPapersByFemales = await sumPapersByFemaleAuthors();
        console.log('Total Papers by Female Authors:', totalPapersByFemales);

        const avgHIndexPerUniversity = await getAverageHIndexPerUniversity();
        console.log('Average H-Index per University:', avgHIndexPerUniversity);

        const totalPapersPerUniversity = await getTotalPapersPerUniversity();
        console.log('Total Papers per University:', totalPapersPerUniversity);

        const minMaxHIndexPerUniversity = await getMinMaxHIndexPerUniversity();
        console.log('Min and Max H-Index per University:', minMaxHIndexPerUniversity);
    } catch (error) {
        console.error('Error executing queries:', error);
    } finally {
     
        await pool.end();
    }
})();
