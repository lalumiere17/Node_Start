const { Book } = require('./Book')
const { Library } = require('./Library')

var amqp = require('amqplib/callback_api');

console.log("Hello! i'm Node.js")

const book = {
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

amqp.connect('amqp://localhost', (err, connection) => {
    if (err)
        throw err;
    connection.createChannel((err1, channel) => {
        if (err1)
            throw err1;
        let queue = 'books';
        let msg = {
            "id": "4",
            "name": "Код да Винчи",
            "author": "Д. Браун",
            "year": "2014",
            "publisher": "Эксмо",
            "language": "русский",
            "pages": "784",
            "price": "950",
            "genre": "роман",
            "age": "12+"
        };

        channel.assertQueue(queue, {durable: false});

        channel.sendToQueue(queue,  Buffer.from(JSON.stringify(msg)));

        console.log(" [x] Sent %s", JSON.stringify(msg));
    });

    setTimeout( () => {
        connection.close();
        process.exit(0)
    }, 500)
});