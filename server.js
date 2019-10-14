const { Book } = require('./Book');
const { Library } = require('./Library');
const express = require("express");
let bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;

let dbClient;
var url = "mongodb://localhost:27017";

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    if (err) {
        console.error(err)
        return
    }
    dbClient = client.db('LibraryApp');
    let library_collection = dbClient.collection('library');
    let books_collection = dbClient.collection('books_in_lib');
    
    library_collection.insertOne(books_collection, (err, resuls) =>{
        if(err){
            console.log(err);
        }
    });
    app.locals.library_collection = library_collection;
    app.locals.books_collection = books_collection;

})

const app = express();
app.use(bodyParser.json());


app.get("/", (request, response) => {
    request.app.locals.library_collection.findOne({libName: 'Public library'}, (err, item) =>{
        var mainInfo = "<h2>Welcome to the library!</h2>\n" + item.libName +", " + item.libAddress
        response.send(mainInfo);
    });    
});
  
app.post("/books", (request, response) => {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    request.app.locals.library_collection.findOne({libName: 'Public library'}, (err, item) => {
        if(err){
            console.log(err);
        }
        let listOfBooks = item.listOfBooks;
        listOfBooks.push(request.body);
        request.app.locals.library_collection.updateOne({libName: 'Public library'}, {'$set': {'listOfBooks': listOfBooks}}, (err, item) => {
            if(err)
                console.log(err);
        });
        response.sendStatus(201);
    })
})

app.get("/books", (request, response) => {
    request.app.locals.library_collection.findOne({libName: 'Public library'}, (err, item) => {
        if(err){
            console.log(err);
        }
        response.status(200).send(JSON.stringify(item.listOfBooks));

    });

    
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
