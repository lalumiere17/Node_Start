const { Book } = require('./Book')
const { Library } = require('./Library')

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()

var MainLibrary = new Library("Public library", "Lenina pr. 60")

const express = require("express");
const app = express();

app.use(function (request, response) {
    response.send("<h2>Welcome to the library!</h2>");
});

app.post("/books", jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    var item = new Book(request.body)
    MainLibrary.AddBookToLibrary(item)
    response.sendStatus(201);
})

app.listen(3000);


// /addbook
// /update_book
// /delete_book
// /show_books