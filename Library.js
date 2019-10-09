class Library{

    constructor(libName, libAdress){
        this.libName = libName;
        this.libAdress = libAdress;
        this.listOfBooks = new Array();
    }

    AddBookToLibrary(book){
        this.listOfBooks.push(book);
    }

    DeleteBookFromLibrary(book){
        var num = this.listOfBooks.indexOf(book);
        this.listOfBooks.splice(num);
    }

    DeleteAllLibrary(){
        this.libName = null;
        this.libAdress = null;
        this.listOfBooks = null;
    }
}

module.exports = {Library};