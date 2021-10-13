// Elements DOM
const elList = document.querySelector('.list');
const elForm = document.querySelector('.form');
const elSelect = document.querySelector('.form__select');
const elSearch = document.querySelector('.search');
const elSort = document.querySelector('.select__sort');
const elBookmarks = document.querySelector('.bookmarks__list');
const elModalBox = document.querySelector('.modal');



// Select genres
const resultGenre = [];

for (const film of films) {
	for (const ganre of film.genres) {
		if (!resultGenre.includes(ganre)) {
			resultGenre.push(ganre);
		}
	}
}

for (const option of resultGenre) {
	const elOption = document.createElement('option');
	elOption.value = option;
	elOption.textContent = option;

	elSelect.appendChild(elOption);
}

//Sort
const sortFns = {
	0: (a, b) => {
		if (a.title < b.title) {
			return -1;
		}

		if (a.title > b.title) {
			return 1;
		}

		return 0;
	},

	1: (a, b) => {
		if (a.title < b.title) {
			return 1;
		}

		if (a.title > b.title) {
			return -1;
		}

		return 0;
	},

	2: (a, b) => a.release_date - b.release_date,

	3: (a, b) => b.release_date - a.release_date,
};

// Films
function renderFilms(arr, node) {
	elList.innerHTML = null;

	arr.forEach((film) => {
		const newLi = document.createElement('li');
		const newHeading = document.createElement('h3');
		const newImage = document.createElement('img');
		const newParagraph = document.createElement('p');
		const newBtn = document.createElement('button');
		const modalBtn = document.createElement('button');

		newHeading.textContent = film.title;
		newParagraph.textContent =
			film.overview.split(' ').slice(0, 20).join(' ') + '...';

		newBtn.textContent = 'Bookmarks';
		modalBtn.textContent = 'More info';

		newLi.setAttribute('class', 'list__item');

		newHeading.setAttribute('class', 'film__heading');

		newParagraph.setAttribute('class', 'film__info');

		newImage.setAttribute('class', 'film__image');
		newImage.setAttribute('src', film.poster);
		newImage.setAttribute('alt', film.title + ' poster');
		newImage.setAttribute('width', '250');
		newImage.setAttribute('height', '250');

		newBtn.dataset.filmId = film.id;
		newBtn.setAttribute('class', 'bookmarks__btn btn');

		modalBtn.setAttribute('class', 'modal__btn btn')
		modalBtn.dataset.filmId = film.id;

		newLi.appendChild(newImage);
		newLi.appendChild(newHeading);
		newLi.appendChild(newParagraph);
		newLi.appendChild(modalBtn);
		newLi.appendChild(newBtn);

		node.appendChild(newLi);
	});
}

//Bookmarks

const localBookmarks = JSON.parse(window.localStorage.getItem('bookmarks'));
const bookmarks = localBookmarks || [];

//localStorage
function updateTodos() {
	renderBookmarks(bookmarks, elBookmarks);
	window.localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

updateTodos();

//Modal
const modal = [];

// Render Bookmarks
function renderBookmarks(arr, node) {
	node.innerHTML = null;
	0
	arr.forEach((film) => {
		const bookmarksLi = document.createElement('li');
		const bookmarksHeading = document.createElement('h2');
		const bookmarksImage = document.createElement('img');
		const bookmarkBtn = document.createElement('button');

		bookmarksHeading.textContent = film.title;

		bookmarkBtn.textContent = 'Delete';
		bookmarkBtn.dataset.filmId = film.id

		bookmarksImage.setAttribute('class', 'film__image');
		bookmarksImage.setAttribute('src', film.poster);
		bookmarksImage.setAttribute('alt', film.title + ' poster');
		bookmarksImage.setAttribute('width', '250');
		bookmarksImage.setAttribute('height', '250');

		bookmarksLi.setAttribute('class', 'list__item');
		bookmarksHeading.setAttribute('class', 'film__heading');

		bookmarkBtn.setAttribute('class', 'bookmarks__delete-btn btn');

		bookmarksLi.appendChild(bookmarksImage);
		bookmarksLi.appendChild(bookmarksHeading);
		bookmarksLi.appendChild(bookmarkBtn);

		node.appendChild(bookmarksLi);
	});
}

// Render Modal
function renderFilmInfo(arr, node) {
	node.innerHTML = null;

	arr.forEach((film) => {
		const modalLI = document.createElement('div');
		const modalHeading = document.createElement('h3');
		const modalParagraph = document.createElement('p');
		const modalGenresList = document.createElement('ul');
		const modalDate = document.createElement('time');
		const modalClose = document.createElement('button');

		modalHeading.textContent = film.title;
		modalParagraph.textContent = film.overview;
		modalClose.innerHTML = '&times'

		for (const genre of film.genres) {
			const newGenreLi = document.createElement('li');
			newGenreLi.setAttribute('class', 'genre__item');

			newGenreLi.textContent = genre;
			modalGenresList.appendChild(newGenreLi);
		}

		modalDate.textContent = normalizeDate(film.release_date);

		modalLI.setAttribute('class', 'modal__item');
		modalHeading.setAttribute('class', 'film__heading')
		modalDate.setAttribute('class', 'date');
		modalGenresList.setAttribute('class', 'genre__list');
		modalClose.setAttribute('class', 'modal__close');


		modalClose.dataset.filmId = film.id

		modalLI.appendChild(modalHeading);
		modalLI.appendChild(modalParagraph);
		modalLI.appendChild(modalGenresList);
		modalLI.appendChild(modalDate);
		modalLI.appendChild(modalClose)

		node.appendChild(modalLI);
	});
}

// elList listened
elList.addEventListener('click', (evt) => {
	if (evt.target.matches('.bookmarks__btn')) {
		const filmId = evt.target.dataset.filmId;

		const foundFilm = films.find((film) => film.id === filmId);

		if (!bookmarks.includes(foundFilm)) {
			bookmarks.push(foundFilm);

			renderBookmarks(bookmarks, elBookmarks);

			updateTodos()
		}
	}

	if (evt.target.matches('.modal__btn')) {

		const filmId = evt.target.dataset.filmId;

		const foundFilm = films.find((film) => film.id === filmId);

		modal.push(foundFilm)

		elModalBox.innerHTML = null

		elModalBox.classList.add('modal--show');

		renderFilmInfo(modal, elModalBox)

	}
});

// elBookmarks listened
elBookmarks.addEventListener('click', (evt) => {
	if (evt.target.matches('.bookmarks__delete-btn')) {

		const filmId = evt.target.dataset.filmId;

		const foundBookmarks = bookmarks.find((film) => film.id === filmId);

		bookmarks.splice(foundBookmarks, 1);

		renderBookmarks(bookmarks, elBookmarks);

		updateTodos()
	}
})

// elModalList listened
elModalBox.addEventListener('click', (evt) => {
	const isTargetRemover =
		evt.target.matches('.modal') ||
		evt.target.matches('.modal__close');


	if (isTargetRemover) {

		const filmId = evt.target.dataset.filmId

		const foundModal = films.find((film) => film.id === filmId);

		modal.splice(foundModal, 1);

		elModalBox.classList.remove('modal--show');

		renderFilmInfo(modal, elModalBox)

		console.log(modal);
	}
})

// Form Listened
elForm.addEventListener('submit', (evt) => {
	evt.preventDefault();

	const genreValue = elSelect.value;
	const searchValue = elSearch.value;
	const sortValue = elSort.value;

	const newRegx = new RegExp(searchValue, 'gi');

	let filterFilms = [];

	if (genreValue === 'all') {
		filterFilms = films.filter((movie) => movie.title.match(newRegx));
	} else {
		filterFilms = films
			.filter((film) => film.genres.includes(genreValue))
			.filter((movie) => movie.title.match(newRegx));
	}

	filterFilms.sort(sortFns[sortValue]);

	renderFilms(filterFilms, elList);

	// updateTodos()	

});

renderFilms(films, elList);
renderBookmarks(bookmarks, elBookmarks);