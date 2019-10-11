const { Book } = require('./Book');
const { Library } = require('./Library');
const express = require("express");
var bodyParser = require('body-parser');

var MainLibrary = new Library("Public library", "Lenina pr. 60");


const app = express();
app.use(bodyParser.json());


app.get("/", (request, response) => {
    var mainInfo = "<h2>Welcome to the library!</h2>\n" + MainLibrary.libName+", " + MainLibrary.libAdress
    response.send(mainInfo);
});
  
app.post("/books", (request, response) => {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    var item = new Book(request.body);
    MainLibrary.AddBookToLibrary(item);
    console.table(MainLibrary.listOfBooks);
    response.sendStatus(201);
})

app.get("/books", (request, response) => {
    response.status(200).send(JSON.stringify(MainLibrary.listOfBooks));
})

app.get("/books/:bookId", (request, response) => {
    console.log(request.params["bookId"]);
    var resArr = [];
    MainLibrary.listOfBooks.forEach(element => {
        if (element.id === request.params["bookId"])
            resArr.push(element)
    });
    response.status(200).send(JSON.stringify(resArr));
    
})

app.put("/update_book", (request, response) => {
    if(!request.body)
        return response.status(400).send("Please, enter all data to update the book :(");
    
    var index;
    MainLibrary.listOfBooks.forEach(element => {
        if (element.id === request.body.bookId){
            index = MainLibrary.listOfBooks.indexOf(element);
            MainLibrary.listOfBooks[index].UpdateBookInfo(request.body.fieldName, request.body.newValue);
        }
    });
    console.table(MainLibrary.listOfBooks);
    response.sendStatus(200);
})

app.delete("/delete_book/:bookId", (request, responce) => {

    MainLibrary.listOfBooks.forEach(element => {
        if (element.id === request.params["bookId"])
            MainLibrary.DeleteBookFromLibrary(element);
    });
    console.table(MainLibrary.listOfBooks);
    responce.sendStatus(204);
})

app.delete("/delete_lib", (request, responce) => {

    MainLibrary.DeleteAllLibrary();

    responce.sendStatus(204);
})

app.listen(3000);