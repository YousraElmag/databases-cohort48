const { MongoClient } = require('mongodb');
require('dotenv').config();
// MongoDB URI and Database Name
const uri = process.env.DB_URL;
const dbName = 'financial_db';

async function transferFunds(fromAccountNumber, toAccountNumber, amount, remark) {
    const client = new MongoClient(uri);

    try {
        // Connect to MongoDB client
        await client.connect();
        console.log('Connected to MongoDB');

        // Get the database and collection
        const db = client.db(dbName);
        const accountsCollection = db.collection('accounts');

        // Find accounts
        const fromAccount = await accountsCollection.findOne({ account_number: fromAccountNumber });
        const toAccount = await accountsCollection.findOne({ account_number: toAccountNumber });

        if (!fromAccount) {
            throw new Error(`From account ${fromAccountNumber} not found`);
        }
        if (!toAccount) {
            throw new Error(`To account ${toAccountNumber} not found`);
        }
        if (fromAccount.balance < amount) {
            throw new Error(`Insufficient funds in account ${fromAccountNumber}`);
        }

        // Increment change numbers
        const getNextChangeNumber = async (accountNumber) => {
            const account = await accountsCollection.findOne({ account_number: accountNumber });
            if (account.account_changes.length === 0) {
                return 1;
            }
            const lastChangeNumber = account.account_changes[account.account_changes.length - 1].change_number;
            return lastChangeNumber + 1;
        };

        const fromChangeNumber = await getNextChangeNumber(fromAccountNumber);
        const toChangeNumber = await getNextChangeNumber(toAccountNumber);

        // Perform the transfer
        const fromUpdate = {
            $inc: { balance: -amount },
            $push: {
                account_changes: {
                    change_number: fromChangeNumber,
                    amount: -amount,
                    changed_date: new Date(),
                    remark
                }
            }
        };

        const toUpdate = {
            $inc: { balance: amount },
            $push: {
                account_changes: {
                    change_number: toChangeNumber,
                    amount: amount,
                    changed_date: new Date(),
                    remark
                }
            }
        };

        await accountsCollection.updateOne({ account_number: fromAccountNumber }, fromUpdate);
        await accountsCollection.updateOne({ account_number: toAccountNumber }, toUpdate);

        console.log(`Transferred ${amount} from ${fromAccountNumber} to ${toAccountNumber}`);
    } catch (error) {
        console.error('Error during funds transfer:', error);
    } finally {
        // Close MongoDB client
        await client.close();
    }
}

// Export the transfer function
module.exports = transferFunds;
