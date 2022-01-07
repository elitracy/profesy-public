const client = require("mongodb").MongoClient
const mongoose = require("mongoose")
const username = "dylann39"
const pw = "swimmer39"
const database = "profesy"
const clusterURL = ""
const url = `mongodb+srv://dylann39:swimmer39@cluster0.8bwmh.mongodb.net/profesy?retryWrites=true&w=majority`

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  //autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
}

main().catch(err => console.log(err));

async function main(){
  client.connect(url, options, (err, db) => {
    if (err) throw err
    console.log("CONNECTED!")
    db.close()
    console.log(db.getCollection("professors").find({"BROOKINS B" : {}}))
  })
}
