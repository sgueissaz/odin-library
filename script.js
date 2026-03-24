class Book {
    constructor(title, author, pages, read) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }

    toggleRead() {
        this.read = !this.read;
    }
}

class Library {
    #library = [];
    #listeners = {
        add: new Set(),
        remove: new Set(),
        toggleRead: new Set(),
    }

    subscribeToAdd(fn) {
        this.#listeners.add.add(fn);
    }

    subscribeToRemove(fn) {
        this.#listeners.remove.add(fn);
    }

    subscribeToToggleRead(fn) {
        this.#listeners.toggleRead.add(fn);
    }
    
    #notifyAdd(book) {
        this.#listeners.add.forEach(fn => fn(book));
    }

    #notifyRemove(id) {
        this.#listeners.remove.forEach(fn => fn(id));
    }

    #notifyToggleRead(id) {
        this.#listeners.toggleRead.forEach(fn => fn(id));
    }

    get(id) {
        return this.#library.find(book => book.id === id);
    }

    add(title, author, pages, read) {
        const book = new Book(title, author, pages, read);
        this.#library.push(book);
        this.#notifyAdd(book);
    }  

    remove(id) {
        this.#library = this.#library.filter((book) => book.id !== id);
        this.#notifyRemove(id);
    }

    toggleRead(id) {
        this.#library.find(book => book.id === id).toggleRead();
        this.#notifyToggleRead(id);
    }
}

class NewBookFormController {
    #library;
    #newBook;
    #title;
    #author;
    #pages;
    #read;

    constructor(library) {
        this.#library = library;
        this.#newBook = document.getElementById('new-book');
        this.#title = document.getElementById('title');
        this.#author = document.getElementById('author');
        this.#pages = document.getElementById('pages');
        this.#read = document.getElementById('read');
        this.#bindEvents();
    }

    #bindEvents() {
        this.#newBook.addEventListener('submit', e => this.#onSubmit(e));
    }

    #reset() {
        this.#title.value = "";
        this.#author.value = "";
        this.#pages.value = "";
        this.#read.checked = false;
    }

    #onSubmit(e) {
        e.preventDefault();
        this.#library.add(
            this.#title.value,
            this.#author.value,
            this.#pages.valueAsNumber,
            this.#read.checked,
        );
        this.#reset();
    }
}

class ListBookController {
    #library;
    #listBook;

    constructor(library) {
        this.#library = library;
        this.#listBook = document.getElementById('list-book');
        this.#bindEvents();
        library.subscribeToAdd(book => this.#add(book));
        library.subscribeToRemove(id => this.#remove(id));
        library.subscribeToToggleRead(id => this.#toggleRead(id));
    }

    #bindEvents() {
        this.#listBook.addEventListener('submit', e => this.#onSubmit(e));
    }

    #addContentToCard(card, book) {
        const content = document.createElement('div');
        content.classList.add('book-content')

        const title = document.createElement('div');
        title.classList.add('book-title');
        title.textContent = book.title;

        const author = document.createElement('div');
        author.classList.add('book-author');
        author.textContent = book.author;

        const pages = document.createElement('div');
        pages.classList.add('book-pages');
        pages.textContent = `${book.pages} pages`;

        content.appendChild(title);
        content.appendChild(author);
        content.appendChild(pages);

        card.appendChild(content);
    }

    #addControlToCard(card, book) {
        const control = document.createElement('div');
        control.classList.add('book-control')

        const read = document.createElement('button');
        read.dataset.id = book.id;
        read.classList.add('book-read');
        read.classList.add('card');
        if (book.read) {
            read.dataset.action = 'unread';
            read.classList.add('remove');
            read.textContent = 'Unread';
        } else {
            read.dataset.action = 'read';
            read.classList.add('add');
            read.textContent = 'Read';
        }
        read.type = 'submit';

        const remove = document.createElement('button');
        remove.dataset.id = book.id;
        remove.dataset.action = 'remove';
        remove.classList.add('card');
        remove.classList.add('remove');
        remove.textContent = 'remove';
        remove.type = 'submit';

        control.appendChild(read);
        control.appendChild(remove);
        

        card.appendChild(control);
    }

    #add(book) {
        const card = document.createElement('div');
        card.innerHTML = "";
        card.id = book.id;
        card.classList.add('card');
        card.classList.add('book-card');

        this.#addContentToCard(card, book);
        this.#addControlToCard(card, book);

        this.#listBook.appendChild(card);
    }

    #remove(id) {
        const book = document.getElementById(id);
        this.#listBook.removeChild(book);
    }

    #toggleRead(id) {
        const book = this.#library.get(id);
        const card = document.getElementById(book.id);
        card.innerHTML = "";

        this.#addContentToCard(card, book);
        this.#addControlToCard(card, book);
    }

    #onSubmit(e) {
        e.preventDefault();

        const action = e.submitter.dataset.action;
        const bookId = e.submitter.dataset.id;

        switch (action) {
            case 'remove':
                this.#library.remove(bookId);
                break;
            case 'read':
            case 'unread':
                this.#library.toggleRead(bookId);
                break;
        }
    } 
}

const library = new Library();
new NewBookFormController(library);
new ListBookController(library);