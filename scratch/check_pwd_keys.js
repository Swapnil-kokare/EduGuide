const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from backend/.env
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

async function checkKeys() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const MahacetCutoff = require('./database/models/MahacetCutoff');
        
        // Find documents that have any of the standard PWD keys
        // Common MH-CET keys for PWD: PWDOPEN, PWDSC, PWDST, PWDOBC, PWDOBCS, etc.
        // Or sometimes just PH1, PH2
        
        const sampleColleges = await MahacetCutoff.find({ 
            'branches.cutoffs.categories': { $exists: true } 
        }).limit(20).lean();

        const allKeys = new Set();
        sampleColleges.forEach(college => {
            college.branches?.forEach(branch => {
                branch.cutoffs?.forEach(cutoff => {
                    if (cutoff.categories) {
                        Object.keys(cutoff.categories).forEach(k => allKeys.add(k));
                    }
                });
            });
        });

        console.log('--- ALL KEYS FOUND IN DATABASE ---');
        const sortedKeys = Array.from(allKeys).sort();
        console.log(sortedKeys.join(', '));
        
        const pwdKeys = sortedKeys.filter(k => k.toLowerCase().includes('pwd') || k.toLowerCase().includes('ph'));
        console.log('\n--- POTENTIAL PWD KEYS ---');
        console.log(pwdKeys.length > 0 ? pwdKeys.join(', ') : 'No PWD keys found');

        await mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkKeys();
