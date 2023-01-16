require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose')

// Basic Configuration
const port = process.env.PORT || 3000;
const DATABASE_KEY = process.env.DATABASE_KEY;
const dbURI = `mongodb+srv://frankie354:${DATABASE_KEY}@cluster0.om3gerr.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => app.listen(port))
.catch((err) => console.log(err));

//Schema for saving URLs
const shorturl = mongoose.model('shorturl', new mongoose.Schema({
  original_url: String,
  short_url: String
}))

app.use(cors());
app.use(express.urlencoded({extended:true}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.post('/api/shorturl', function(req, res) {
    const url = req.body.url
    const shortUrlId = Math.floor(Math.random() * 10000)
  
  if(!url.includes("https://") && !url.includes("http://")) {
    return res.json({
      error: 'invalid url'
    })
  }

  const newDatabaseUrl = new shorturl({
    original_url: url,
    short_url: shortUrlId
  })

  newDatabaseUrl.save()
  .then((result) => {
    res.json({
      original_url: result.original_url,
      short_url: result.short_url
    })
  })
  .catch((err) => {
      res.send(err)
    })
})

// Your first API endpoint
app.get('/api/shorturl/:short_url', function(req, res) {
  shorturl.findOne({short_url: req.params.short_url})
  .then((result) => {
    res.redirect(result.original_url)
  })
  .catch((err) => {
    res.send(err)
  })
});
