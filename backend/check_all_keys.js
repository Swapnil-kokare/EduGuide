const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function checkKeys() {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        await mongoose.connect(uri);
        const collection = mongoose.connection.db.collection('cutoff');
        
        // Fetch 50 docs that definitely have variety in categories
        const samples = await collection.find({ 'branches.cutoffs.categories': { $exists: true } }).limit(50).toArray();
        
        const allKeys = new Set();
        samples.forEach(doc => {
            if (doc.branches) {
                doc.branches.forEach(b => {
                    if (b.cutoffs) {
                        b.cutoffs.forEach(c => {
                            if (c.categories) {
                                Object.keys(c.categories).forEach(k => allKeys.add(k));
                            }
                        });
                    }
                });
            }
        });

        console.log('--- ALL UNIQUE CATEGORY KEYS FOUND ---');
        console.log(Array.from(allKeys).sort().join(', '));

        await mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

checkKeys();
