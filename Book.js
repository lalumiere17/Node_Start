function UpdateBookInfo(book, fieldName, newValue){
    book[fieldName] = newValue;
    return book;
}

module.exports = {UpdateBookInfo};