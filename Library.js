class Library{

    /**
     * 
     * @param {string} libName Название библиотеки
     * @param {string} libAddress Адрес библиотеки
     */
    constructor(libName, libAddress){
        this.libName = libName;
        this.libAddress = libAddress;
        this.listOfBooks = new Array();
    }

    /**
     * 
     * @param {Book} book Книга, которую нужно добавить
     */
    AddBookToLibrary(book){
        this.listOfBooks.push(book);
    }

    /**
    * Удаляет книгу из библиотеки
    * @param {Book} book Книга, которую нужно удалить
    */
    DeleteBookFromLibrary(book){
        var num = this.listOfBooks.indexOf(book);
        this.listOfBooks.splice(num, 1);
    }

    /**
     * Удалить библиотеку
     */
    DeleteAllLibrary(){
        this.libName = null;
        this.libAddress = null;
        this.listOfBooks = null;
    }
}

module.exports = {Library};