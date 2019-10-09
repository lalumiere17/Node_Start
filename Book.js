class Book{

    /**
     * 
     * @param {Book} book новая книга 
     */
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

    /**
     * 
     * @param {string} fieldName название поля, которое необходимо изменить
     * @param {string} newValue новое значение поля
     */
    UpdateBookInfo(fieldName, newValue){
        this[fieldName] = newValue;
    }

}

module.exports = {Book};