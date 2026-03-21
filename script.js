const state = {
    library: [],
}

function Book(title, author, pages, read) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary(title, author, pages, read) {
    const book = new Book(title, author, pages, read);
    state.library.push(book);
    return book;
}

function removeBookFromLibrary(id) {
    state.library = state.library.filter((book) => book.id != id);
}

function toggleReadFromLibrary(id) {
    const index = state.library.findIndex(book => book.id === id);
    if (index != -1) {
        const book = state.library[index];
        book.read = !book.read;
        return book;
    }
}

const ui = {
    new_book: document.getElementById('new-book'),
    title: document.getElementById('title'),
    author: document.getElementById('author'),
    pages: document.getElementById('pages'),
    read: document.getElementById('read'),
    list_book: document.getElementById('list-book'),
}

function addContentToCard(card, book) {
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

function addControlToCard(card, book) {
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

function addBookToCard(card, book) {
    addContentToCard(card, book);
    addControlToCard(card, book);
}

function addBookToListBook(book) {
    const card = document.createElement('div');
    card.id = book.id;
    card.classList.add('card');
    card.classList.add('book-card');

    addBookToCard(card, book);

    ui.list_book.appendChild(card);
}

function removeBookFromListBook(id) {
    const book = document.getElementById(id);
    ui.list_book.removeChild(book);
}

function updateBookFromListBook(book) {
    const card = document.getElementById(book.id);
    card.innerHTML = "";

    addBookToCard(card, book);
}

function resetForm() {
    ui.title.value = "";
    ui.author.value = "";
    ui.pages.value = "";
    ui.read.checked = false;
}

ui.new_book.addEventListener('submit', (e) => {
    e.preventDefault();
    const book = addBookToLibrary(
        ui.title.value,
        ui.author.value,
        ui.pages.valueAsNumber,
        ui.read.checked,
    );
    addBookToListBook(book);
    resetForm();
})

ui.list_book.addEventListener('submit', (e) => {
    e.preventDefault();
    const action = e.submitter.dataset.action;
    const bookId = e.submitter.dataset.id;

    switch (action) {
        case 'remove':
            removeBookFromLibrary(bookId);
            removeBookFromListBook(bookId);
            break;
        case 'read':
        case 'unread':
            const book = toggleReadFromLibrary(bookId);
            if (book != undefined) {
                updateBookFromListBook(book);
            }
            break;
    }
})