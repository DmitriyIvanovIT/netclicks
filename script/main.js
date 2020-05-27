const imgURL = "https://image.tmdb.org/t/p/w185_and_h278_bestv2",
    API_KEY = "a5fbea0d07b256ed534002b62cae1500",
    server = `https://api.themoviedb.org/3`;
// Объявление переменных
const leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    tvShowsList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal'),
    tvShows = document.querySelector('.tv-shows'),
    tvCardImg = document.querySelector('.tv-card__img'),
    modalTitle = document.querySelector('.modal__title'),
    genresList = document.querySelector('.genres-list'),
    rating = document.querySelector('.rating'),
    description = document.querySelector('.description'),
    modalLink = document.querySelector('.modal__link'),
    searchForm = document.querySelector('.search__form'),
    searchFormInput = document.querySelector('.search__form-input');


const loading = document.createElement('div');
loading.className = 'loading';


// Получение данных с сервера
const DBService = class {
    getData = async url => {
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url}`)
        };
    };

    getTestData = async () => {
        return await this.getData(`${server}/trending/tv/day?api_key=${API_KEY}&language=ru`);
    };

    getTestCard = async () => {
        return await this.getData('card.json');
    };

    getSearchResult = async query => {
        return this.getData(`${server}/search/tv?api_key=${API_KEY}&query=${query}&language=ru-RU`);
    };

    getTVShov = id => {
        return this.getData(`${server}/tv/${id}?api_key=${API_KEY}&language=ru-RU`);
    }
};

const renderCard = response => {
    if (response.results.length === 0) {
        alert('По вашему запросу нет результатов');

    }

    tvShowsList.textContent = '';

    response.results.forEach(item => {
        const {
            vote_average: ratings,
            poster_path: poster,
            name: title,
            backdrop_path: backdrop,
            id
        } = item;

        const posterIMG = poster ? imgURL + poster : 'img/no-poster.jpg',
            backdropIMG = backdrop ? imgURL + backdrop : '',
            voteElem = ratings !== 0 ? ` <span class="tv-card__vote">${ratings}</span>` : '';


        const card = document.createElement('li');
        card.className = 'tv-shows__item';
        card.innerHTML = `
                <a href="#" id="${id}" class="tv-card">
                    ${voteElem}
                    <img class="tv-card__img"
                        src="${posterIMG}"
                        data-backdrop="${backdropIMG}"
                        alt="Звёздные войны: Повстанцы">
                    <h4 class="tv-card__head">${title}</h4>
                </a>
            `;

        loading.remove();
        tvShowsList.append(card);
    })
};

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value;
    searchFormInput.value = '';
    if (value.trim().length === 0) {
        alert('Введите название');
        return;
    }
    tvShows.append(loading);
    new DBService().getSearchResult(value).then(renderCard);
});

{
    tvShows.append(loading);
    new DBService().getTestData().then(renderCard);
}

// Функции
const toggleMenu = () => {
        leftMenu.classList.toggle('openMenu');
        hamburger.classList.toggle('open');
    },
    openDropDown = (event) => {
        event.preventDefault();
        const target = event.target,
            dropdown = target.closest('.dropdown');

        if (dropdown) {
            dropdown.classList.toggle('active');
            leftMenu.classList.add('openMenu');
            hamburger.classList.add('open');
        }
    },
    changeImg = event => {
        const card = event.target.closest('.tv-shows__item');

        if (card) {
            const img = card.querySelector('.tv-card__img'),
                backdrop = img.dataset.backdrop;
            if (img.dataset.backdrop) {
                [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
            };
        };

    };

// Рендер событий
hamburger.addEventListener('click', toggleMenu);

document.addEventListener('click', event => {
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    };
});

leftMenu.addEventListener('click', openDropDown);


tvShowsList.addEventListener('mouseover', changeImg);

tvShowsList.addEventListener('mouseout', changeImg);



tvShowsList.addEventListener('click', event => {
    const target = event.target,
        card = target.closest('.tv-card');

    if (card) {
        tvShows.append(loading);

        new DBService().getTVShov(card.id)
            .then(data => {
                tvCardImg.src = data.poster_path ? imgURL + data.poster_path : 'img/no-poster.jpg';
                tvCardImg.alt = data.name; 
                modalTitle.textContent = data.name;
                genresList.innerHTML = '';
                data.genres.forEach(item => genresList.innerHTML += `<li>${item.name}</li>`);
                rating.textContent = data.vote_average ? data.vote_average : 'Рейтинг отсутствует' ;
                description.textContent = data.overview ? data.overview : 'Описание отсутствует';
                modalLink.href = data.homepage ? data.homepage : '#';
            })
            .then(() => {
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
                tvShows.remove();
            });
    };

});

modal.addEventListener('click', event => {
    const target = event.target,
        close = target.classList.contains('modal');

    if (close || target.closest('.cross')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
        document.location.href = 'index.html';
    };

});
