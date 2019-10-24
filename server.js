const { Library } = require('./Library');
const Book = require('./Book');
const camunda = require('./camunda');
const express = require("express");
let bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;
const amqp = require('amqplib/callback_api');

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
                            camunda.completeTask(new_item.id);
                        });
                    });
                }, {noAck: true});
            });
        });
    response.sendStatus(201);
    });  
})

app.get("/update_book", (request, response) => {
    dbClient.collection("library").findOne({libName: 'Public Library'}, (err0, item) =>{
        if(err0){
            console.log(err0);
        }
        let update_info;
        let new_list = item.listOfBooks;
        amqp.connect('amqp://localhost', (err1, connection) => {
            if (err1)
                throw err1;

            connection.createChannel((err2, channel) => {
                if (err2)
                    throw err2;
                let queue = 'update_book';
                channel.assertQueue(queue, {durable: false});
                channel.consume(queue, (msg) => {                    
                    update_info = JSON.parse(msg.content);
                    new_list.forEach(element => {
                        if(element.id === update_info.bookId)
                            element = Book.UpdateBookInfo(element, update_info.fieldName, update_info.newValue)                        
                    });
                    dbClient.collection("library").updateOne({libName: 'Public Library'}, {'$set': {'listOfBooks': new_list}});
                    if(CheckInstanceExist(update_info.bookId)){
                        camunda.SendNewMessage("UpdateBook", update_info.bookId, () => {
                            camunda.completeTask(update_info.bookId);
                        });
                    }
                }, {noAck: true});
            });
        });
    response.sendStatus(201);
    });    
})

app.get("/delete_book", (request, responce) => {
    dbClient.collection("library").findOne({libName: 'Public Library'}, (err0, item) =>{
        if(err0){
            console.log(err0);
        }
        let new_list = item.listOfBooks;
        amqp.connect('amqp://localhost', (err1, connection) => {
            if (err1)
                throw err1;

            connection.createChannel((err2, channel) => {
                if (err2)
                    throw err2;
                let queue = 'delete_book';
                channel.assertQueue(queue, {durable: false});
                channel.consume(queue, (msg) => {                    
                    deleteId = JSON.parse(msg.content);
                    let num;
                    new_list.forEach(element => {
                        if(element.id === deleteId)
                            num = new_list.indexOf(element);
                            new_list.splice(num, 1);                       
                    });
                    dbClient.collection("library").updateOne({libName: 'Public Library'}, {'$set': {'listOfBooks': new_list}});
                    if(CheckInstanceExist(deleteId)){
                        camunda.SendNewMessage("DeleteBook", deleteId, () => {
                            camunda.completeTask(deleteId);
                        });
                    }
                }, {noAck: true});
            });
        });
    response.sendStatus(201);
    });
})
app.listen(3000);