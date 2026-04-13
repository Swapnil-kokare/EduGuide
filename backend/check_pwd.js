const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function checkKeys() {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        await mongoose.connect(uri);
        const collection = mongoose.connection.db.collection('cutoff');
        
        // Search for any document where the categories object (nested inside branches and cutoffs) 
        // has at least one key containing "PWD"
        // Since it's nested, we'll try some common ones
        const commonKeys = ['PWDOPENS', 'PWDOBCS', 'PWDSCS', 'PWDS', 'PH', 'PH1', 'PHO'];
        const query = {
            $or: commonKeys.map(k => ({
                [`branches.cutoffs.categories.${k}`]: { $exists: true }
            }))
        };

        console.log('Searching for any document with PWD/PH keys...');
        const match = await collection.findOne(query);

        if (match) {
            console.log('Result: Found evidence of PWD/PH category!');
            console.log('College:', match.college_name);
            // Show all keys in that match
            const keys = new Set();
            match.branches.forEach(b => b.cutoffs.forEach(c => {
                if (c.categories) Object.keys(c.categories).forEach(k => keys.add(k));
            }));
            const found = Array.from(keys).filter(k => k.toUpperCase().includes('PWD') || k.toUpperCase().includes('PH'));
            console.log('Actual keys:', found);
        } else {
            console.log('Result: No PWD or PH categories found in the database using common keys.');
        }

        await mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

checkKeys();
