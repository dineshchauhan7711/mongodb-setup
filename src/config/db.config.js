const mongoose = require('mongoose');
const { db_url } = require('./config');

/***
 * Connect to DB
 */
const connect = () => {
     return new Promise(resolve => {
          mongoose
               .connect(db_url)
               .then(async () => {
                    console.log("DB connected successfully...");
                    resolve();
               })
               .catch((error) => console.log("DB connection error ::  ",error));
     });
};

connect()


module.exports = {
     connect
};
