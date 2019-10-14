const { Book } = require('./Book')
const { Library } = require('./Library')
const MongoClient = require("mongodb").MongoClient;

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

var url = "mongodb://localhost:27017";

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    if (err) {
        console.error(err)
        return
    }
    const db = client.db('test_library_app');
    const collection_lib = db.collection('test_library');
    const collection_books = db.collection('test_books_in_lib');

    let test_lib = new Library("lib_name", "lib_address");
    test_lib.AddBookToLibrary(book);

    collection_lib.insertOne(test_lib, (err, resuls) =>{
        if(err){
            console.log(err);
        }
    })
    
    collection_books.insertMany(test_lib.listOfBooks, (err, resuls) =>{
        if(err){
            console.log(err);
        }
    })
    collection_books.find().toArray((err, items) => {
        console.table(items)
    })
    collection_lib.insert(collection_books, (err, resuls) =>{
        if(err){
            console.log(err);
        }
    });
    collection_lib.find().toArray((err, items) => {
        console.log(items[0].listOfBooks);
    })

})