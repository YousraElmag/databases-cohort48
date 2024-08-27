// Import the setup function and transfer function
const setupDatabase = require('./setup');
const transferFunds = require('./transfer');

// Function to run setup and transfer
async function run() {
    await setupDatabase(); // Set up the database with sample data
    console.log('Database setup completed');

    // Transfer funds and test
    await transferFunds('101', '102', 1000.00, 'Test transfer');
}

run()
    .then(() => console.log('Transfer test completed'))
    .catch(error => console.error('Error during test:', error));
