const path = require('path');
const mongoose = require('../shared/mongoose');
const College = require('../models/College');
const Feedback = require('../models/Feedback');
require('../shared/dotenv').config({ path: path.join(__dirname, '..', '..', 'backend', '.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/career-guide';

const sampleColleges = [
    // Mumbai
    { collegeName: 'IIT Bombay', city: 'Mumbai', branch: 'Computer Science', categoryCutoff: { OPEN: 99.5, OBC: 98.0, SC: 95.0, ST: 92.0 }, fees: 200000 },
    { collegeName: 'IIT Bombay', city: 'Mumbai', branch: 'Information Technology', categoryCutoff: { OPEN: 98.8, OBC: 97.5, SC: 94.0, ST: 91.0 }, fees: 200000 },
    { collegeName: 'IIT Bombay', city: 'Mumbai', branch: 'Electrical Engineering', categoryCutoff: { OPEN: 97.5, OBC: 96.0, SC: 92.0, ST: 89.0 }, fees: 200000 },
    { collegeName: 'IIT Bombay', city: 'Mumbai', branch: 'Mechanical Engineering', categoryCutoff: { OPEN: 96.0, OBC: 94.5, SC: 89.0, ST: 85.0 }, fees: 200000 },
    { collegeName: 'VJTI Mumbai', city: 'Mumbai', branch: 'Computer Engineering', categoryCutoff: { OPEN: 99.1, OBC: 97.5, SC: 94.0, ST: 90.5 }, fees: 90000 },
    { collegeName: 'VJTI Mumbai', city: 'Mumbai', branch: 'Information Technology', categoryCutoff: { OPEN: 98.5, OBC: 96.0, SC: 92.5, ST: 89.0 }, fees: 90000 },
    { collegeName: 'VJTI Mumbai', city: 'Mumbai', branch: 'Electronics Engineering', categoryCutoff: { OPEN: 97.0, OBC: 95.0, SC: 90.0, ST: 86.0 }, fees: 90000 },
    { collegeName: 'VJTI Mumbai', city: 'Mumbai', branch: 'Mechanical Engineering', categoryCutoff: { OPEN: 95.5, OBC: 93.0, SC: 88.0, ST: 84.5 }, fees: 90000 },
    { collegeName: 'SPIT Mumbai', city: 'Mumbai', branch: 'Computer Engineering', categoryCutoff: { OPEN: 98.8, OBC: 97.2, SC: 93.0, ST: 89.0 }, fees: 154000 },
    { collegeName: 'SPIT Mumbai', city: 'Mumbai', branch: 'Information Technology', categoryCutoff: { OPEN: 98.2, OBC: 96.5, SC: 92.0, ST: 88.0 }, fees: 154000 },
    { collegeName: 'SPIT Mumbai', city: 'Mumbai', branch: 'Electronics & Telecommunication', categoryCutoff: { OPEN: 97.0, OBC: 95.0, SC: 90.0, ST: 85.0 }, fees: 154000 },
    { collegeName: 'KJ Somaiya College of Engineering', city: 'Mumbai', branch: 'Computer Engineering', categoryCutoff: { OPEN: 98.0, OBC: 96.0, SC: 92.0, ST: 87.0 }, fees: 280000 },
    { collegeName: 'KJ Somaiya College of Engineering', city: 'Mumbai', branch: 'Information Technology', categoryCutoff: { OPEN: 97.5, OBC: 95.5, SC: 91.0, ST: 86.0 }, fees: 280000 },

    // Pune
    { collegeName: 'COEP Technological University', city: 'Pune', branch: 'Computer Engineering', categoryCutoff: { OPEN: 99.4, OBC: 98.0, SC: 95.0, ST: 92.5 }, fees: 110000 },
    { collegeName: 'COEP Technological University', city: 'Pune', branch: 'Information Technology', categoryCutoff: { OPEN: 99.0, OBC: 97.5, SC: 94.0, ST: 91.0 }, fees: 110000 },
    { collegeName: 'COEP Technological University', city: 'Pune', branch: 'Electronics & Telecommunication', categoryCutoff: { OPEN: 98.0, OBC: 96.5, SC: 92.0, ST: 89.0 }, fees: 110000 },
    { collegeName: 'COEP Technological University', city: 'Pune', branch: 'Mechanical Engineering', categoryCutoff: { OPEN: 96.5, OBC: 94.0, SC: 89.0, ST: 85.0 }, fees: 110000 },
    { collegeName: 'Pune Institute of Computer Technology', city: 'Pune', branch: 'Computer Engineering', categoryCutoff: { OPEN: 98.9, OBC: 97.0, SC: 93.5, ST: 89.5 }, fees: 115000 },
    { collegeName: 'Pune Institute of Computer Technology', city: 'Pune', branch: 'Information Technology', categoryCutoff: { OPEN: 98.3, OBC: 96.5, SC: 92.0, ST: 88.0 }, fees: 115000 },
    { collegeName: 'Pune Institute of Computer Technology', city: 'Pune', branch: 'Electronics & Telecommunication', categoryCutoff: { OPEN: 97.0, OBC: 95.0, SC: 90.0, ST: 85.0 }, fees: 115000 },
    { collegeName: 'Vishwakarma Institute of Technology', city: 'Pune', branch: 'Computer Engineering', categoryCutoff: { OPEN: 98.2, OBC: 96.5, SC: 92.5, ST: 88.0 }, fees: 175000 },
    { collegeName: 'Vishwakarma Institute of Technology', city: 'Pune', branch: 'Information Technology', categoryCutoff: { OPEN: 97.8, OBC: 96.0, SC: 91.5, ST: 87.0 }, fees: 175000 },
    { collegeName: 'Vishwakarma Institute of Technology', city: 'Pune', branch: 'Artificial Intelligence', categoryCutoff: { OPEN: 97.5, OBC: 95.5, SC: 91.0, ST: 86.5 }, fees: 175000 },
    { collegeName: 'MIT World Peace University', city: 'Pune', branch: 'Computer Engineering', categoryCutoff: { OPEN: 96.0, OBC: 93.0, SC: 88.0, ST: 82.0 }, fees: 250000 },
    { collegeName: 'MIT World Peace University', city: 'Pune', branch: 'Information Technology', categoryCutoff: { OPEN: 95.5, OBC: 92.5, SC: 87.0, ST: 81.0 }, fees: 250000 },
    { collegeName: 'MIT World Peace University', city: 'Pune', branch: 'Mechanical Engineering', categoryCutoff: { OPEN: 92.0, OBC: 88.0, SC: 82.0, ST: 78.0 }, fees: 250000 },
    { collegeName: 'PCCOE Pune', city: 'Pune', branch: 'Computer Engineering', categoryCutoff: { OPEN: 97.4, OBC: 95.6, SC: 91.0, ST: 86.4 }, fees: 135000 },
    { collegeName: 'PCCOE Pune', city: 'Pune', branch: 'Information Technology', categoryCutoff: { OPEN: 96.8, OBC: 94.8, SC: 90.0, ST: 85.5 }, fees: 135000 },

    // Nagpur
    { collegeName: 'VNIT Nagpur', city: 'Nagpur', branch: 'Computer Science', categoryCutoff: { OPEN: 99.3, OBC: 97.5, SC: 94.0, ST: 91.0 }, fees: 150000 },
    { collegeName: 'VNIT Nagpur', city: 'Nagpur', branch: 'Information Technology', categoryCutoff: { OPEN: 98.7, OBC: 96.5, SC: 93.0, ST: 89.0 }, fees: 150000 },
    { collegeName: 'VNIT Nagpur', city: 'Nagpur', branch: 'Electronics & Telecommunication', categoryCutoff: { OPEN: 97.8, OBC: 95.5, SC: 91.5, ST: 88.0 }, fees: 150000 },
    { collegeName: 'VNIT Nagpur', city: 'Nagpur', branch: 'Mechanical Engineering', categoryCutoff: { OPEN: 96.0, OBC: 93.5, SC: 89.0, ST: 85.0 }, fees: 150000 },
    { collegeName: 'Government College of Engineering', city: 'Nagpur', branch: 'Computer Engineering', categoryCutoff: { OPEN: 97.0, OBC: 95.0, SC: 90.0, ST: 85.0 }, fees: 80000 },
    { collegeName: 'Government College of Engineering', city: 'Nagpur', branch: 'Electrical Engineering', categoryCutoff: { OPEN: 95.0, OBC: 92.0, SC: 87.0, ST: 82.0 }, fees: 80000 },
    { collegeName: 'Government College of Engineering', city: 'Nagpur', branch: 'Civil Engineering', categoryCutoff: { OPEN: 93.0, OBC: 89.0, SC: 84.0, ST: 79.0 }, fees: 80000 },

    // Nashik
    { collegeName: 'KK Wagh Institute of Engineering', city: 'Nashik', branch: 'Computer Engineering', categoryCutoff: { OPEN: 95.5, OBC: 93.0, SC: 88.0, ST: 83.0 }, fees: 125000 },
    { collegeName: 'KK Wagh Institute of Engineering', city: 'Nashik', branch: 'Information Technology', categoryCutoff: { OPEN: 94.5, OBC: 92.0, SC: 87.0, ST: 82.0 }, fees: 125000 },
    { collegeName: 'KK Wagh Institute of Engineering', city: 'Nashik', branch: 'Mechanical Engineering', categoryCutoff: { OPEN: 91.0, OBC: 88.0, SC: 82.0, ST: 78.0 }, fees: 125000 },
    { collegeName: 'Sandip Institute of Technology', city: 'Nashik', branch: 'Computer Engineering', categoryCutoff: { OPEN: 92.0, OBC: 88.0, SC: 83.0, ST: 78.0 }, fees: 105000 },
    { collegeName: 'Sandip Institute of Technology', city: 'Nashik', branch: 'Artificial Intelligence', categoryCutoff: { OPEN: 91.0, OBC: 87.0, SC: 82.0, ST: 77.0 }, fees: 105000 },

    // Aurangabad
    { collegeName: 'Government College of Engineering', city: 'Aurangabad', branch: 'Computer Science', categoryCutoff: { OPEN: 96.5, OBC: 94.5, SC: 90.0, ST: 86.0 }, fees: 85000 },
    { collegeName: 'Government College of Engineering', city: 'Aurangabad', branch: 'Information Technology', categoryCutoff: { OPEN: 95.8, OBC: 93.5, SC: 89.0, ST: 85.0 }, fees: 85000 },
    { collegeName: 'Government College of Engineering', city: 'Aurangabad', branch: 'Mechanical Engineering', categoryCutoff: { OPEN: 93.5, OBC: 91.0, SC: 86.0, ST: 82.0 }, fees: 85000 },

    // Kolhapur
    { collegeName: 'Government College of Engineering', city: 'Kolhapur', branch: 'Computer Engineering', categoryCutoff: { OPEN: 95.5, OBC: 93.5, SC: 88.0, ST: 84.0 }, fees: 85000 },
    { collegeName: 'Government College of Engineering', city: 'Kolhapur', branch: 'Electronics & Telecommunication', categoryCutoff: { OPEN: 94.0, OBC: 92.0, SC: 86.0, ST: 82.0 }, fees: 85000 },
    { collegeName: 'Government College of Engineering', city: 'Kolhapur', branch: 'Civil Engineering', categoryCutoff: { OPEN: 92.0, OBC: 89.0, SC: 84.0, ST: 80.0 }, fees: 85000 },

    // Sangli
    { collegeName: 'Walchand College of Engineering', city: 'Sangli', branch: 'Computer Engineering', categoryCutoff: { OPEN: 98.4, OBC: 96.5, SC: 92.5, ST: 88.5 }, fees: 95000 },
    { collegeName: 'Walchand College of Engineering', city: 'Sangli', branch: 'Information Technology', categoryCutoff: { OPEN: 97.8, OBC: 95.8, SC: 91.5, ST: 87.5 }, fees: 95000 },
    { collegeName: 'Walchand College of Engineering', city: 'Sangli', branch: 'Electronics & Telecommunication', categoryCutoff: { OPEN: 96.5, OBC: 94.5, SC: 90.0, ST: 86.0 }, fees: 95000 },
    { collegeName: 'Walchand College of Engineering', city: 'Sangli', branch: 'Mechanical Engineering', categoryCutoff: { OPEN: 95.0, OBC: 92.5, SC: 88.0, ST: 84.0 }, fees: 95000 },

    // Nanded
    { collegeName: 'SGGS IE&T Nanded', city: 'Nanded', branch: 'Computer Science', categoryCutoff: { OPEN: 96.0, OBC: 94.0, SC: 89.0, ST: 85.0 }, fees: 90000 },
    { collegeName: 'SGGS IE&T Nanded', city: 'Nanded', branch: 'Information Technology', categoryCutoff: { OPEN: 95.5, OBC: 93.0, SC: 88.0, ST: 84.0 }, fees: 90000 },
    { collegeName: 'SGGS IE&T Nanded', city: 'Nanded', branch: 'Mechanical Engineering', categoryCutoff: { OPEN: 93.0, OBC: 90.5, SC: 85.5, ST: 81.5 }, fees: 90000 },

    // Amravati
    { collegeName: 'Government College of Engineering', city: 'Amravati', branch: 'Computer Science', categoryCutoff: { OPEN: 96.2, OBC: 94.2, SC: 89.5, ST: 85.5 }, fees: 85000 },
    { collegeName: 'Government College of Engineering', city: 'Amravati', branch: 'Civil Engineering', categoryCutoff: { OPEN: 92.5, OBC: 89.5, SC: 84.5, ST: 80.5 }, fees: 85000 },

    // Jalgaon
    { collegeName: 'Government College of Engineering', city: 'Jalgaon', branch: 'Computer Engineering', categoryCutoff: { OPEN: 94.5, OBC: 92.0, SC: 87.0, ST: 83.0 }, fees: 80000 },

    // Chandrapur
    { collegeName: 'Government College of Engineering', city: 'Chandrapur', branch: 'Computer Science', categoryCutoff: { OPEN: 94.0, OBC: 91.5, SC: 86.5, ST: 82.5 }, fees: 80000 },

    // Islampur
    { collegeName: 'Rajarambapu Institute of Technology', city: 'Islampur', branch: 'Computer Engineering', categoryCutoff: { OPEN: 93.5, OBC: 91.0, SC: 86.0, ST: 82.0 }, fees: 120000 },
];

const sampleFeedback = [
    {
        rating: 5,
        message: 'Excellent college prediction system! Very accurate results.',
    },
    {
        rating: 4,
        message: 'Good interface and helpful recommendations. Could improve search filters.',
    },
    {
        rating: 5,
        message: 'Became my go-to resource for college guidance. Highly recommend!',
    },
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Clear existing data
        await College.deleteMany({});
        await Feedback.deleteMany({});
        console.log('Cleared existing data');

        // Insert colleges
        await College.insertMany(sampleColleges);
        console.log(`✅ Inserted ${sampleColleges.length} colleges`);

        // Insert feedback
        await Feedback.insertMany(sampleFeedback);
        console.log(`✅ Inserted ${sampleFeedback.length} feedback entries`);

        console.log('\n✅ Database seeded successfully!');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error.message);
        process.exit(1);
    }
};

seedDatabase();
