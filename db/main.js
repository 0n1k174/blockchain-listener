const {MongoClient, Db} = require("mongodb");

class DB {

    constructor() {
        /**
         *
         * @type {Db}
         */
        this.db = null;
    }

    async connect() {
        try {
            const client = await MongoClient.connect(process.env.MAIN_DB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })

            this.db = client.db(process.env.MAIN_DB_NAME);
            console.log(`Successfully connected to ${process.env.MAIN_DB_NAME}`)
        } catch (error) {
            console.error(`Could not connect to ${process.env.MAIN_DB_NAME}: ${error.message}`)
        }
    }
}

module.exports = new DB();
