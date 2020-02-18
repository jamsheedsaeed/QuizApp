const express = require('express');
var app = express();
var http = require('http').Server(app);
var router = express.Router();

var questions = require('../api/questions.js');
router.get('/getQuestions',questions.QuizPage);
router.get('/getRandomQuestions',questions.GetRandomQuestion);
router.get('/convertpdf',questions.ConvertPdF);


module.exports = router;