const { Library } = require('./Library');
const { Book } = require('./Book');
const camunda = require('./camunda');
const express = require("express");
let bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;
const amqp = require('amqplib/callback_api');

let dbClient;
let url = "mongodb://localhost:27017";
let no_need = {id: "5",
name: "Великий Гэтсби",
author: "Ф. С. Фицджеральд",
year: "2013",
publisher: "Эксмо",
language: "русский",
pages: "542",
price: "502",
genre: "роман",
age: "12+"}
let book = new Book(no_need);

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


app.get("/add_books_from_queue", (request, response) => {
    dbClient.collection("library").findOne({libName: 'Public Library'}, (err0, item) =>{
        if(err0){
            console.log(err0);
        }
        let new_item;
        let new_list = item.listOfBooks;
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
                    new_list.push(new_item);
                    dbClient.collection("library").updateOne({libName: 'Public Library'}, {'$set': {'listOfBooks': new_list}});
                    camunda.StartBookInstance(new_item.id, (response) => {
                        new_item.instanceId = response;
                        camunda.SendNewMessage("NewBook", new_item.id, () => {
                            camunda.CompleteTask(new_item.id);
                        });
                    });
                }, {noAck: true});
            });
        });
    response.sendStatus(201);
    });  
})

app.get("/update_book", (request, response) => {

/*if(!request.body)
        return response.status(400).send("Please, enter all data to update the book :(");
    
    var index;
    MainLibrary.listOfBooks.forEach(element => {
        if (element.id === request.body.bookId){
            index = MainLibrary.listOfBooks.indexOf(element);
            MainLibrary.listOfBooks[index].UpdateBookInfo(request.body.fieldName, request.body.newValue);
        }
    });
    console.table(MainLibrary.listOfBooks);
    response.sendStatus(200);*/
    dbClient.collection("library").findOne({libName: 'Public Library'}, (err0, item) =>{
        if(err0){
            console.log(err0);
        }
        let new_item;
        let new_list = item.listOfBooks;
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
                    new_list.push(new_item);
                    dbClient.collection("library").updateOne({libName: 'Public Library'}, {'$set': {'listOfBooks': new_list}});
                    camunda.StartBookInstance(new_item.id, (response) => {
                        new_item.instanceId = response;
                        camunda.SendNewMessage("NewBook", new_item.id, () => {
                            camunda.CompleteTask(new_item.id);
                        });
                    });
                }, {noAck: true});
            });
        });
    response.sendStatus(201);
    });    
})

// //not connected to database
// app.delete("/delete_book/:bookId", (request, responce) => {

//     MainLibrary.listOfBooks.forEach(element => {
//         if (element.id === request.params["bookId"])
//             MainLibrary.DeleteBookFromLibrary(element);
//     });
//     console.table(MainLibrary.listOfBooks);
//     responce.sendStatus(204);
// })

app.listen(3000);