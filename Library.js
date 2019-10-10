class Library{

    /**
     * 
     * @param {string} libName Название библиотеки
     * @param {string} libAdress Адрес библиотеки
     */
    constructor(libName, libAdress){
        this.libName = libName;
        this.libAdress = libAdress;
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
        this.libAdress = null;
        this.listOfBooks = null;
    }
}

module.exports = {Library};