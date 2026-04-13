const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function checkDistricts() {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        await mongoose.connect(uri);
        const collection = mongoose.connection.db.collection('cutoff');
        
        const districtCount = await collection.distinct('district');
        const cityCount = await collection.distinct('city');
        const locationCount = await collection.distinct('location');

        console.log('Unique District values:', districtCount.length);
        console.log('Values:', districtCount.sort().join(', '));
        
        console.log('\nUnique City values:', cityCount.length);
        console.log('Values:', cityCount.sort().join(', '));

        console.log('\nUnique Location values:', locationCount.length);
        console.log('Values:', locationCount.sort().join(', '));

        await mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

checkDistricts();
