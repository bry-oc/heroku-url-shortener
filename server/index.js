const cors = require("cors");
const dns = require("dns");
const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const path = require("path");
const PORT = process.env.PORT || 3001;

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({optionsSuccessStatus: 200}));
app.use(express.static(path.resolve(__dirname, '../client/build')));

//connect to mongodb
mongoose.connect(process.env.MONGO_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, returnNewDocument: true });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function() {
  console.log("Connection Successful!");
});

//shortlink schema
const shortenSchema = new mongoose.Schema({
    original_url: { type: String, required: true },
    short_url: { type: Number }
});

shortenSchema.plugin(AutoIncrement, {id:'short_url_seq',inc_field: 'short_url'});

const Shorten = mongoose.model('Shorten', shortenSchema);

//post
//verify that domain is valid
//find if url exists in db already
//return url+shorturl if it does
//otherwise create new
app.post('/api/shorturl', (req, res) => { 
    //post request will use req.body.domain
    const domain = req.body.URL;
    const httpFormat = /^https?:\/\/.+\..+\..+/i;
    if( !httpFormat.test(domain) ){
        return res.json({error: "Invalid URL"});
    }
    //filter input to fit domain.name format
    //remove http(s)://
    //const domainRegex = /^https?:\/\//i;
    const domainFormat = domain.split('/')[2];
    //verify the domain is valid
    dns.lookup(domainFormat, (err, address, family) => {
        if(err){
            //the domain is not a valid
            return res.json({error: "Invalid Hostname"})
        } else {
            //the domain is valid
            //lookup the domain in db
            Shorten.findOne({ original_url: domain }, function(err, url){
                if(err){
                    return console.error(err);
                } else {
                    if(!url){
                        //the url was not found
                        //create one
                        const newUrl = new Shorten({original_url: domain});
                        newUrl.save(function(err, data) {
                            if(err){
                                return console.error(err);
                            } else {
                                return res.json({original_url: data.original_url, short_url: data.short_url});
                            }                    
                        });
                    } else {
                        //the url was found
                        //return existing
                        return res.json({original_url: url.original_url, short_url: url.short_url});
                    }
                }
            });
        }
    });
    return;
});


//get
//lookup shorturl
//redirect to longurl if it does
//else error
app.get('/api/shorturl/:short_url?', (req, res) => {
    const short_url_id = req.params.short_url;
    Shorten.findOne({ short_url: short_url_id }, function(err, url){
        if(err){
            return console.error(err);
        } else {
            if(url){
                res.redirect(url.original_url);
            }
            else {
                return res.json({error:"No short URL found for the given input"});
            }
        }
    })
    return;
});

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`)
});
