const { Book } = require('./Book')
const { Library } = require('./Library')

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

var item = new Book(book)

var MainLibrary = new Library("Public library", "Lenina pr. 60")

MainLibrary.AddBookToLibrary(item)
console.table(MainLibrary.listOfBooks)

MainLibrary.listOfBooks[0].UpdateBookInfo("name", "Мастер Кот Воланд")
console.table(MainLibrary.listOfBooks)

MainLibrary.DeleteBookFromLibrary(item)
console.table(MainLibrary.listOfBooks)