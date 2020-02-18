const questions = require('../models/questions.js');
var express = require('express');
var pdfUtil = require('pdf-to-text');
var app = express();
var fs = require("fs");
var result = [];
var pdf_path = "./msoffice.pdf";
var option = {from: 0, to: 10};

exports.QuizPage = function (req, res) {
  console.log("\n *START* \n");
  var contents = fs.readFileSync("./questions.json");

  var jsonContent = JSON.parse(contents);
  console.log("Output Content : \n"+ contents);
 
  for(var i in jsonContent){
      var a=jsonContent[i]
      result.push(a);
   }
   console.log(result[0].Question);
  console.log("\n *EXIT* \n");
  res.render('quiz', {
    result
  });
  }

  exports.GetRandomQuestion = function (req , res){
    const data = result[Math.floor(Math.random() * result.length)];
    console.log("function called" + data);
    res.json({question:data});

  }

  exports.ConvertPdF = function (req , res){
    
    pdfUtil.pdfToText(pdf_path, option, function(err, data) {
      if (err) throw(err);
      console.log(data); //print text     
    });
    

  }
  




