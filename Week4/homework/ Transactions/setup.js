// Import MongoDB client
const { MongoClient } = require('mongodb');
require('dotenv').config(); 

// MongoDB URI and Database Name
const uri = process.env.DB_URL;
const dbName = 'financial_db';

// Function to set up the database with sample data
async function setupDatabase() {
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB client
        await client.connect();
        console.log('Connected to MongoDB');

        // Get the database and collection
        const db = client.db(dbName);
        const accountsCollection = db.collection('accounts');

        // Clear existing data
        await accountsCollection.deleteMany({});
        console.log('Cleared existing data from accounts collection');

        // Sample data to insert
        const sampleAccounts = [
            {
                account_number: '101',
                balance: 1000.00,
                account_changes: [
                    { change_number: 1, amount: -50.00, changed_date: new Date('2024-08-01T10:00:00Z'), remark: 'Purchase' },
                    { change_number: 2, amount: 200.00, changed_date: new Date('2024-08-02T14:00:00Z'), remark: 'Deposit' }
                ]
            },
            {
                account_number: '102',
                balance: 500.00,
                account_changes: [
                    { change_number: 1, amount: -30.00, changed_date: new Date('2024-08-01T11:00:00Z'), remark: 'Purchase' },
                    { change_number: 2, amount: 100.00, changed_date: new Date('2024-08-03T15:00:00Z'), remark: 'Deposit' }
                ]
            }
        ];

        // Insert sample data into the collection
        await accountsCollection.insertMany(sampleAccounts);
        console.log('Inserted sample data into accounts collection');
    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        // Close the MongoDB client
        await client.close();
    }
}

// Export the setup function
module.exports = setupDatabase;
