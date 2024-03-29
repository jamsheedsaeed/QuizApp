//All Declarations
const express = require('express');
const app = express();
const path = require('path')
const bodyParser = require('body-parser');

//For Testing Purpose Only
const views = path.join(__dirname, 'views');
console.log(views);

//Server Default Address
var port = process.env.PORT || 8080;

// Set Default Directory for Viewa
app.set('views', path.join(__dirname, 'views'));
// Set EJS View Engine**
app.set('view engine','ejs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', require('./routes/route.js')); 
app.use('/static', express.static(path.join(__dirname, 'public')));

//Main Page of Application
app.get('/', function(req, res) {
    res.render('main', {locals: {title: 'Welcome!'}});
  });


//Server Listen At Port number
app.listen(port, () => {
  console.log('Server is live on port : ', port  );
});