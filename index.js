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
  const db = client.db('testdb');
  const collection = db.collection('test_collection');

  let test_lib = new Library("lib_name", "lib_address")
  collection.insertOne({name: "test_lib", address: "test_address"}, () =>{
             console.log("dobavleno");
         })
})