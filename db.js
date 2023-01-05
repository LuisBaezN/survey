const { MongoClient } = require('mongodb');

let dbConnection;
let uri = 'mongodb+srv://Luis:7euVEUmx1ihZHKm5@books.uqc0saf.mongodb.net/?retryWrites=true&w=majority';

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(uri)
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