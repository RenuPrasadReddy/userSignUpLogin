var express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs')

const isAuthenticated = require('./authentication/authenticate');
const signupOrLogin = require('./routes/signupOrLogin');

var app = express();
app.use(express.json());
// app.use(isAuthenticated)
app.use(bodyParser.urlencoded({ extended: true })); 


// const MONGODB_URI = "mongodb+srv://Renu:renu@123@db-oiiwh.mongodb.net/Assesment?retryWrites=true&w=majority";
const MONGODB_URI = "mongodb+srv://Renu:renu@123@cluster0-oiiwh.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => console.log('connected to atlas db'));

// -----------
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

// generating jwt token
app.get('/jwt', (req, res) => {
  let privateKey = fs.readFileSync('./private.pem', 'utf8');
  let token = jwt.sign({ "body": "stuff" }, privateKey, { algorithm: 'HS256'});
  res.send(token);
})

app.use('/user', signupOrLogin);



