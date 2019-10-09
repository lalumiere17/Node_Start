class Book{
    constructor(book){
        this.name = book.name;
        this.author = book.author;
        this.year = book.year;
        this.publisher = book.publisher;
        this.language = book.language;
        this.pages = book.pages;
        this.price = book.price;
        this.genre = book.genre;
        this.age = book.age;
    }

    UpdateBookInfo(fieldName, newValue){
        this[fieldName] = newValue;
    }

}

module.exports = {Book};