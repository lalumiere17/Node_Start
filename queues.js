const express = require("express");
let bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');

const app = express();
app.use(bodyParser.json());

app.post("/add_books", (request, response) => {
    amqp.connect('amqp://localhost', (err, connection) => {
        if (err)
            throw err;
        connection.createChannel((err1, channel) => {
            if (err1)
                throw err1;
            let books = request.body;
            console.table(books);
            let queue = 'books';
                
            books.forEach(element => {
                channel.assertQueue(queue, {durable: false});
                channel.sendToQueue(queue,  Buffer.from(JSON.stringify(element)));

                console.log(" [x] Sent %s", JSON.stringify(element));
            });  

        });
    })
    response.sendStatus(201);
})

app.post("/update_book", (request, response) => {
    amqp.connect('amqp://localhost', (err, connection) => {
        if (err)
            throw err;
        connection.createChannel((err1, channel) => {
            if (err1)
                throw err1;
            let update_info = request.body;
            let queue = 'update_book';
                
            channel.assertQueue(queue, {durable: false});
            channel.sendToQueue(queue,  Buffer.from(JSON.stringify(update_info)));

            console.log(" [x] Sent %s", JSON.stringify(update_info));

        });
    })
    response.sendStatus(201);
})

app.post("/delete_book", (request, response) => {
    amqp.connect('amqp://localhost', (err, connection) => {
        if (err)
            throw err;
        connection.createChannel((err1, channel) => {
            if (err1)
                throw err1;
            let delete_info = request.body;
            let queue = 'delete_book';
                
            channel.assertQueue(queue, {durable: false});
            channel.sendToQueue(queue,  Buffer.from(JSON.stringify(delete_info)));

            console.log(" [x] Sent %s", JSON.stringify(delete_info));
        });
    })
    response.sendStatus(201);
})

app.listen(3001);