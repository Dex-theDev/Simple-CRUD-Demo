//console.log("May Node be with you")

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const res = require('express/lib/response')
const MongoClient = require('mongodb').MongoClient
const dotenv = require('dotenv')

dotenv.config()

//Make sure you place body-parser before your CRUD handlers







MongoClient.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.lvio90e.mongodb.net/?retryWrites=true&w=majority`,{
    useUnifiedTopology: true})
.then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')
    
    app.set('view engine','ejs')
    
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(express.static('public'))
    app.use(bodyParser.json())
  
    app.get('/', (req,res) => {
       // res.sendFile(__dirname + '/index.html')
         db.collection('quotes').find().toArray()
          .then(quotes => {
            res.render('index.ejs', { quotes: quotes})
            console.log(quotes)
          })
          .catch(error => console.error(error))
        
    })
    app.post('/quotes', (req,res) => {
      quotesCollection.insertOne(req.body)
        .then(result => {
            res.redirect('/')
            //console.log(result)
        })
      .catch(error => console.error(error))
  })
  
    app.put('/quotes', (req, res) => {
      quotesCollection.findOneAndUpdate(
        { name: 'Yoda '},
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        }, 
        {
          upsert: true
        }
        
      )
      .then(result => {
        res.json('Success')
      })
      .catch(error => console.error(error))
    })


    app.delete('/quotes', (req,res) => {
      quotesCollection.deleteOne(
        /*query*/ { name: req.body.name }
       //the second parameter would be options but we dont need any in this case
      )
      .then(result => {
        if(result.deletedCount === 0){
          return res.json('No quote to delete')
        }
        res.json("Deleted Darth Vadar's quote")
      })
      .catch(error => console.error(error))
    })
    
    
  
    app.listen(3000, function(){
        console.log('listening on 3000')
    }) //creates a server the browser can connect to
    
    
})
.catch(error => console.log(error))