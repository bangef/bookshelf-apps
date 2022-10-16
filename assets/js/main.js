// Constanta Variable
const RENDER_EVENT = "render-book";
const LOCAL_STORAGE_KEY = "book";
// Event Handler Listener
document.addEventListener("DOMContentLoaded", () => {
	const getInputBookForm = document.querySelector("#inputBook");
	getInputBookForm.addEventListener("submit", (event) => {
		event.preventDefault();
		addBook();
	});
	document.dispatchEvent(new Event(RENDER_EVENT));
});
document.addEventListener(RENDER_EVENT, () => {
	const incompleteBookshelfList = document.getElementById(
		"incompleteBookshelfList"
	);
	const completeBookshelfList = document.getElementById(
		"completeBookshelfList"
	);
	incompleteBookshelfList.innerHTML = "";
	completeBookshelfList.innerHTML = "";

	let books = getFromLocalStorage();
	for (let book of books) {
		const bookElemen = makeBook(book);
		if (book.isComplete) {
			incompleteBookshelfList.append(bookElemen);
		} else {
			completeBookshelfList.append(bookElemen);
		}
	}
});
// Local Storage Fuction
const checkStorage = () => {
	if (typeof Storage !== undefined) {
		return true;
	} else {
		alert("Local storage tidak didukung!");
		return false;
	}
};
const getFromLocalStorage = () => {
	if (checkStorage()) {
		return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
	} else {
		return [];
	}
};
const storeStorage = (bookObject, callback) => {
	let books = callback;
	books.unshift(bookObject);

	if (books.length > 8) {
		books.pop();
	}
	localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(books));
};
// Main Content Fucntion (CRUD)
const generateID = () => +new Date();
const generateBookItemObject = (
	getId,
	getTitle,
	getAuthor,
	getYear,
	getIsComplete
) => {
	return {
		id: getId,
		title: getTitle,
		author: getAuthor,
		year: getYear,
		isComplete: getIsComplete,
	};
};
const createElementCustom = (tagName, innerText = "", className) => {
	const element = document.createElement(tagName);
	element.innerText = innerText;
	className !== undefined && element.classList.add(className);
	return element;
};
const addBook = () => {
	const getTitle = document.querySelector("#inputBookTitle").value;
	const getAuthor = document.querySelector("#inputBookAuthor").value;
	const getYear = document.querySelector("#inputBookYear").value;
	const getIsComplete = document.querySelector("#inputBookIsComplete").checked;
	const getId = generateID();
	const bookObject = generateBookItemObject(
		getId,
		getTitle,
		getAuthor,
		getYear,
		getIsComplete
	);
	if (checkStorage()) {
		storeStorage(bookObject, getFromLocalStorage());
	}
	document.dispatchEvent(new Event(RENDER_EVENT));
};
const removeBookFromCompleted = (bookId) => {
	let books = getFromLocalStorage();
	for (let book of books) {
		if (book.id === bookId) {
			book.isComplete = false;
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(books));
			document.dispatchEvent(new Event(RENDER_EVENT));
		}
	}
};
const removeBookFromUnCompleted = (bookId) => {
	let books = getFromLocalStorage();
	for (let book of books) {
		if (book.id === bookId) {
			book.isComplete = true;
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(books));
			document.dispatchEvent(new Event(RENDER_EVENT));
		}
	}
};
const removeBook = (bookId) => {
	let books = getFromLocalStorage();
	const index = books.findIndex((element) => element.id === bookId);
	books.splice(index, 1);
	localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(books));
	document.dispatchEvent(new Event(RENDER_EVENT));
};
const makeBook = (booksObject) => {
	const title = createElementCustom("h3", booksObject.title);
	const author = createElementCustom("p", `Penulis: ${booksObject.author}`);
	const year = createElementCustom("p", `Tahun: ${booksObject.year}`);

	const buttonOne = createElementCustom("button", "", "green");
	if (booksObject.isComplete) {
		buttonOne.innerText = "Selesai Dibaca";
		buttonOne.addEventListener("click", function () {
			removeBookFromCompleted(booksObject.id);
		});
	} else {
		buttonOne.innerText = "Belum Selesai Dibaca";
		buttonOne.addEventListener("click", function () {
			removeBookFromUnCompleted(booksObject.id);
		});
	}

	const buttonTwo = createElementCustom("button", "Hapus Buku", "red");
	buttonTwo.addEventListener("click", async function () {
		const test = await Swal.fire({
			title: "Apakah anda yakin ingin menghapus ini ?",
			icon: "question",
			toast: true,
			confirmButtonColor: "#f96666",
			confirmButtonText: "Hapus",
			cancelButtonText: "Tidak",
			showConfirmButton: true,
			showCancelButton: true,
		});
		test.isConfirmed && removeBook(booksObject.id);
	});
	const actionWrapper = createElementCustom("div", "", "action");
	actionWrapper.append(buttonOne, buttonTwo);

	const article = createElementCustom("article", "", "book_item");
	article.setAttribute("id", `book-${booksObject.id}`);
	article.append(title, author, year, actionWrapper);

	return article;
};
