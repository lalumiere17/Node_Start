const fs = require('fs');
const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connection) => {
    if (err)
        throw err;
    connection.createChannel((err1, channel) => {
        if (err1)
            throw err1;

        let books;
        
        fs.readFile("books.json", (err, data) => {
            books = JSON.parse(data);
            console.table(books);
            let queue = 'books';
            
            books.forEach(element => {
                channel.assertQueue(queue, {durable: false});
                channel.sendToQueue(queue,  Buffer.from(JSON.stringify(element)));

                console.log(" [x] Sent %s", JSON.stringify(element));
            }); 
        })   
    });

    setTimeout( () => {
        connection.close();
        process.exit(0)
    }, 500)
});