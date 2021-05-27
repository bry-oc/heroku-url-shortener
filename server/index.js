const cors = require("cors");
const dns = require("dns");
const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const PORT = process.env.PORT || 3001;

const app = express()

app.use(express.urlencoded({extended: false}));
app.use(cors({optionsSuccessStatus: 200}));
app.use(express.static(path.resolve(__dirname, '../client/build')));

//shortlink schema
const shortenSchema = new mongoose.Schema({
    original_url: String,
    short_url: Number
});

const Shorten = mongoose.model('Shorten', shortenSchema);

//connect to mongodb
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//post
//verify that domain is valid
//find if url exists in db already
//return url+shorturl if it does
//otherwise create new
app.get('/api/shorturl', (req, res) => { 
    domain = "https://google.com";
    //filter input to fit domain.name format
    domainRegex = /^https?:\/\//i;
    domainFormat = domain.replace(domainRegex, "");
    console.log(domainFormat);
    //verify the domain is valid
    dns.lookup(domainFormat, (err, address, family) => {
        if(err){
            res.json({error:"Invalid URL"});
        } 
    })
    console.log("url is valid");
    res.json({status:"all clear"})
});


//get
//lookup shorturl
//redirect to longurl if it does
//else error
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`)
});
