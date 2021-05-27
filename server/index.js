const cors = require("cors");
const dns = require("dns");
const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const PORT = process.env.PORT || 3001;

const app = express()

app.use(express.json());
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
mongoose.connect(process.env.MONGO_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });


//post
//verify that domain is valid
//find if url exists in db already
//return url+shorturl if it does
//otherwise create new
app.post('/api/shorturl', (req, res) => { 
    //post request will use req.body.domain
    const domain = req.body.domain;
    console.log(domain);
    //filter input to fit domain.name format
    //remove http(s)://
    const domainRegex = /^https?:\/\//i;
    const domainFormat = domain.replace(domainRegex, "");
    console.log(domainFormat);
    //verify the domain is valid
    dns.lookup(domainFormat, (err, address, family) => {
        if(err){
            res.json({error:"Invalid URL"});
        } 
    })
    //does url already have shortlink?
    Shorten.findOne({ long_url: domain }, function(err, domain){
        if(err){
            console.log(err);
        } else {
            if(domain === null){
                //create new
                console.log("did not find");
                console.log(domain);

            } else {
                //return existing
                
            }
        }
    });
    //return existing
    //create new
    res.json({status:"all clear"})
});


//get
//lookup shorturl
//redirect to longurl if it does
//else error
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`)
});
