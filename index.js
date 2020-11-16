const express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y8hyt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 12000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

client.connect(err => {
    const rentHouseCollection = client.db(`${process.env.DB_NAME}`).collection("rentHouse");

    app.post('/addRentHouse', (req, res) => {
            const House = req.body 
            console.log(House);
            rentHouseCollection.insertOne(House)
            .then(result => {
                console.log(result.insertedCount)
                res.send(result.insertedCount)
          })
        })

    });



    app.listen(port)