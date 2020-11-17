const express = require('express')
var bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const objectid = require('mongodb').ObjectId
var cors = require('cors')
require('dotenv').config()

//"start-dev": "nodemon index.js",

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y8hyt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express()
app.use(bodyParser.json())
app.use(fileUpload());
app.use(cors())
const port = 12000

app.get('/', (req, res) => {
    res.send('Hello Apartment Hunt!')
})

client.connect(err => {
    const rentHouseCollection = client.db(`${process.env.DB_NAME}`).collection("rentHouse");
    const bookingCollection = client.db(`${process.env.DB_NAME}`).collection("booking");
    const adminCollection = client.db(`${process.env.DB_NAME}`).collection("admins");

    // app.post('/addRentHouse', (req, res) => {
    //     const house = req.body;
    //     //console.log(house)
    //     rentHouseCollection.insertMany(house)
    //     .then(result => {
    //       res.send(result.insertedCount)
    //     })
    // })

    app.post('/addRentHouse', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const location = req.body.location;
        const price = req.body.price;
        const bedRoom = req.body.bedRoom;
        const bathRoom = req.body.bathRoom;
        const newImg = file.data;
        const encImg = newImg.toString('base64');
    
            var image = {
                contentType: file.mimetype,
                size: file.size,
                img: Buffer.from(encImg, 'base64')
            };
        
         rentHouseCollection.insertOne({name, location, price, bedRoom, bathRoom,  image})
        .then(result => {
            console.log(result.insertedCount);
          res.send(result.insertedCount > 0)
        })
    })
     
    app.get('/rentHouse', (req, res) => {
        const showHouse = req.body;
         //console.log(showHouse)
         rentHouseCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })    
    })

    app.post('/addBooking', (req, res) => {
        const booking = req.body;
        //console.log(booking)
        bookingCollection.insertOne(booking)
        .then(result => {
          res.send(result.insertedCount)
        })
    })

    app.get('/myBooking', (req, res) => {
        const booking = req.body;
        console.log(booking)
        bookingCollection.find({})
        .toArray((err, documents) => {
          res.send(documents)
        })    
    })

    app.get('/allBookingList', (req, res) => {
        const booking = req.body;
        //console.log(booking)
        bookingCollection.find({})
        .toArray((err, documents) => {
          res.send(documents)
        })    
    })

    app.patch('/updateOrderStatus/:id',(req,res)=>{
    
        const id = req.params.id
        const status = req.body.status
        
        bookingCollection.updateOne(
            {_id:objectid(id)},
            {
                $set:{"status":status}
            }).then(result=>res.send("cdc"))
            .catch(err=>{})
    })

    app.post('/makeAdmin', (req, res) => {
        const admins = req.body;
        console.log(admins)
        adminCollection.insertOne(admins)
        .then(result => {
          res.send(result.insertedCount)
        })
    })

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, documents) => {
                 res.send(documents.length > 0);
                //console.log(documents)
            })
      })


            

    });



    app.listen(process.env.PORT || port)