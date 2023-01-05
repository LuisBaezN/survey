const { MongoClient } = require('mongodb');
require('dotenv').config(); //process.env.URI at MongoClient.connect()

let dbConnection;
//uri = 'mongodb+srv://Luis:7euVEUmx1ihZHKm5@books.uqc0saf.mongodb.net/?retryWrites=true&w=majority';

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(process.env.URI)
            .then((client) => {
                dbConnection = client.db();
                return cb();
            })
            .catch(err => {
                console.log(err);
                return cb(err);
            })
    },
    getDb: () => dbConnection
}