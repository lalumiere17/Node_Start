const { Book } = require('./Book');
const { Library } = require('./Library');
const express = require("express");
let bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;
const amqp = require('amqplib/callback_api');

const elem = {
    id: 0,
    name: "Мастер и Маргарита",
    author: "М. Булгаков",
    year: "2015",
    publisher: "Эксмо",
    language: "русский",
    pages: "352",
    price: "1500",
    genre: "роман",
    age: "16+"
};
let book = new Book(elem)

let dbClient;
let url = "mongodb://localhost:27017";

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    if (err) {
        console.error(err)
        return
    }
    dbClient = client.db('LibraryApp');
    let library_collection = dbClient.collection('library');
    
    //Add a library into a database
    // let MainLibrary = new Library("Public Library", "Lenina pr. 60");

    // library_collection.insertOne(MainLibrary, (err, resuls) =>{
    //     if(err){
    //         console.log(err);
    //     }
    // });
    app.locals.library_collection = library_collection;
})

const app = express();
app.use(bodyParser.json());


app.get("/", (request, response) => {
    request.app.locals.library_collection.findOne({libName: 'Public Library'}, (err, item) =>{
        let mainInfo = "<h2>Welcome to the library!</h2>\n" + item.libName +", " + item.libAddress
        response.send(mainInfo);
    });    
});

//принимает сообщения, но почему-то не добавляет в БД если несколько штук
//TODO: разобраться с этим
app.get("/books_from_queue", (request, response) => {
    request.app.locals.library_collection.findOne({libName: 'Public Library'}, (err0, item) =>{
        if(err0){
            console.log(err0);
        }
        let new_item;
        let new_list = item.listOfBooks;
        console.table(new_list);
        amqp.connect('amqp://localhost', (err1, connection) => {
        if (err1)
            throw err1;

        connection.createChannel((err2, channel) => {
            if (err2)
                throw err2;

            let queue = 'books';

            channel.assertQueue(queue, {durable: false});
            channel.consume(queue, (msg) => {
                new_item = JSON.parse(msg.content);
                console.log(" [x] Received %s", msg.content.toString());
                console.table(new_item);
                new_list.push(new_item);
                console.table(new_list);
                request.app.locals.library_collection.updateOne({libName: 'Public Library'}, {'$set': {'listOfBooks': new_list}}, (err3, item) => {
                    if(err3)
                        console.log(err3);
                    console.table(item.listOfBooks);
                });
            }, {noAck: true});

        });
    });
    response.sendStatus(201);
    }); 
    
})
  
app.post("/books", (request, response) => {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    request.app.locals.library_collection.findOne({libName: 'Public Library'}, (err, item) => {
        if(err){
            console.log(err);
        }
        let new_list = item.listOfBooks;
        new_list.push(request.body);
        request.app.locals.library_collection.updateOne({libName: 'Public Library'}, {'$set': {'listOfBooks': new_list}}, (err, item) => {
            if(err)
                console.log(err);
        });
        response.sendStatus(201);
    })
})

app.get("/books", (request, response) => {
    request.app.locals.library_collection.findOne({libName: 'Public Library'}, (err, item) => {
        if(err){
            console.log(err);
        }

        response.status(200).send(JSON.stringify(item.listOfBooks));
    });    
})

app.get("/books/:bookId", (request, response) => {
    request.app.locals.library_collection.findOne({libName: 'Public Library'}, (err, item) => {
        if(err){
            console.log(err);
        }

        let resArr = [];
        item.listOfBooks.forEach(element => {
        if (element.id === request.params["bookId"])
            resArr.push(element)
        });
        
        response.status(200).send(JSON.stringify(resArr));
    });
})

//doesn't work now
app.put("/update_book", (request, response) => {
    if(!request.body)
        return response.status(400).send("Please, enter all data to update the book :(");
    
    request.app.locals.library_collection.findOne({libName: 'Public Library'}, (err, item) => {
        if(err){
            console.log(err);
        }

        let temp_list = item.listOfBooks;

        let index;
        temp_list.forEach(element =>{
            if (element.id === request.body.bookId){
                index = temp_list.indexOf(element);
                temp_list[index].UpdateBookInfo(request.body.fieldName, request.body.newValue);
            }
        })
        request.app.locals.library_collection.updateOne({libName: 'Public Library'}, {'$set': {'listOfBooks': temp_list}}, (err, item) => {
            if(err)
                console.log(err);
        });
        response.sendStatus(200);
    });     
})

//not connected to database
app.delete("/delete_book/:bookId", (request, responce) => {

    MainLibrary.listOfBooks.forEach(element => {
        if (element.id === request.params["bookId"])
            MainLibrary.DeleteBookFromLibrary(element);
    });
    console.table(MainLibrary.listOfBooks);
    responce.sendStatus(204);
})

//not connected to database
app.delete("/delete_lib", (request, responce) => {

    MainLibrary.DeleteAllLibrary();

    responce.sendStatus(204);
})

app.listen(3000);