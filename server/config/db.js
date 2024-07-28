const mongoose = require('mongoose');
const colors = require('colors');
const { mongoURI } = require('./config');

const connectDB = async () => {
    try {
        if (!mongoURI) {
            throw new Error("MongoURI is not defined in the configuration.");
        }

        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`Connected to Database ${mongoose.connection.name} on ${mongoose.connection.host}:${mongoose.connection.port}`.bgCyan.white);
    } catch (error) {
        console.log(`Error in connection DB ${error}`.bgRed.white); 
    }
};

module.exports = connectDB;