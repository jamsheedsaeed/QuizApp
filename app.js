//All Declarations
const express = require('express');
const app = express();
const path = require('path')
const bodyParser = require('body-parser');

//For Testing Purpose Only
const views = path.join(__dirname, 'views');
console.log(views);

//Server Default Address
const hostname = '127.0.0.1';
const port = 8080;

// Set Default Directory for Viewa
app.set('views', path.join(__dirname, 'views'));
// Set EJS View Engine**
app.set('view engine','ejs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', require('./routes/route.js')); 

//Main Page of Application
app.get('/', function(req, res) {
    res.render('main', {locals: {title: 'Welcome!'}});
  });


//Server Listen At Port number
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});