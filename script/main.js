"use strict";

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

const imgURL = "https://image.tmdb.org/t/p/w185_and_h278_bestv2",
    api = "a5fbea0d07b256ed534002b62cae1500",
    serv = `https://api.themoviedb.org/3`;

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
    searchFormInput = document.querySelector('.search__form-input'),
    dropdown = document.querySelectorAll('.dropdown'),
    tvShowsHead = document.querySelector('.tv-shows__head'),
    plagination = document.querySelector('.plagination');
const loading = document.createElement('div');
loading.className = 'loading';

// Получение данных с сервера 
class DBService {
    constructor() {
        this.API_KEY = api;
        this.SERVER = serv;
        _defineProperty(this, "getData", async url => {
            const res = await fetch(url);

            if (res.ok) {
                return res.json();
            } else {
                throw new Error(`Не удалось получить данные по адресу ${url}`);
            };
        });

        _defineProperty(this, "getSearchResult", query => {
            this.temp = `${this.SERVER}/search/tv?api_key=${this.API_KEY}&query=${query}&language=ru-RU`;
            return this.getData(this.temp);
        });

        _defineProperty(this, "getNext", page => {
            return this.getData(this.temp + '&page=' + page);
        });

        _defineProperty(this, "getTVShov", id => {
            this.temp = `${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`;
            return this.getData(this.temp);
        });

        _defineProperty(this, "getTop", item => {
            this.temp = `${this.SERVER}/tv/${item}?api_key=${this.API_KEY}&language=ru-RU`;
            return this.getData(this.temp);
        });
    }


};

const dbService = new DBService();

const renderCard = response => {
    plagination.textContent = '';
    tvShowsList.textContent = '';
    const col = response.results.length;

    if (col === 0) {
        tvShowsHead.textContent = 'По вашему запросу ничего не найдено';
        tvShowsHead.style.color = 'red';
        loading.remove();
    } else {
        response.results.forEach(item => {
            tvShowsHead.style.color = '';
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
            const idTV = id;
            card.innerHTML = `
                            <a href="#" id="${idTV}" class="tv-card">
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
        });

        if (response.total_pages > 1 && response.total_pages < 7) {
            for (let i = 1; i <= response.total_pages.length; i++) {
                plagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`;
            };
        } else if (response.total_pages > 7){
            for (let i = 1; i <= 7; i++) {
                plagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`;
            };
            plagination.innerHTML += `<li><a href="#" class="pages">Далее</a></li>`;
        }
    }
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
    tvShowsHead.textContent = `Результат поиска`;
    dbService.getSearchResult(value).then(renderCard);
});

// Функции
const toggleMenu = () => {
        leftMenu.classList.toggle('openMenu');
        hamburger.classList.toggle('open');
    },
    openDropDown = event => {
        event.preventDefault();
        const target = event.target,
            dropdown = target.closest('.dropdown');

        if (dropdown) {
            dropdown.classList.toggle('active');
            leftMenu.classList.add('openMenu');
            hamburger.classList.add('open');
        }

        if (target.closest('#top-rated')) {
            tvShows.append(loading);
            tvShowsHead.textContent = 'ТОП сериалы';
            dbService.getTop('top_rated').then(renderCard);
        }

        if (target.closest('#popular')) {
            tvShows.append(loading);
            tvShowsHead.textContent = 'Популярные сериалы';
            dbService.getTop('popular').then(renderCard);
        }

        if (target.closest('#today')) {
            tvShows.append(loading);
            tvShowsHead.textContent = 'Популярные сегодня';
            dbService.getTop('airing_today').then(renderCard);
        }

        if (target.closest('#week')) {
            tvShows.append(loading);
            tvShowsHead.textContent = 'Популярные за неделю';
            dbService.getTop('on_the_air').then(renderCard);
        }
    },
    changeImg = event => {
        const card = event.target.closest('.tv-shows__item');

        if (card) {
            const img = card.querySelector('.tv-card__img'),
                backdrop = img.dataset.backdrop;

            if (img.dataset.backdrop) {
                [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
            }

            ;
        };
    },
    closeDropdown = () => {
        dropdown.forEach(item => {
            item.classList.remove('active');
        });
    };

// Рендер событий
hamburger.addEventListener('click', () => {
    toggleMenu();
    closeDropdown();
});
document.addEventListener('click', event => {
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
        closeDropdown();
    };
});
leftMenu.addEventListener('click', openDropDown);

tvShowsList.addEventListener('mouseover', changeImg);

tvShowsList.addEventListener('mouseout', changeImg);

tvShowsList.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target,
        card = target.closest('.tv-card');

    if (card) {
        tvShows.append(loading);
        dbService.getTVShov(card.id).then(data => {
            tvCardImg.src = data.poster_path ? imgURL + data.poster_path : 'img/no-poster.jpg';
            tvCardImg.alt = data.name;
            modalTitle.textContent = data.name;
            genresList.innerHTML = '';

            if (data.genres !== 0) {
                data.genres.forEach(item => genresList.innerHTML += `<li>${item.name}</li>`);
            };
            
            rating.textContent = data.vote_average ? data.vote_average : 'Рейтинг отсутствует';
            description.textContent = data.overview ? data.overview : 'Описание отсутствует';
            modalLink.href = data.homepage ? data.homepage : '#';
        }).then(() => {
            document.body.style.overflow = 'hidden';
            modal.classList.remove('hide');
            loading.remove();
        });
    };
});

plagination.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;

    if (target.classList.contains('pages')) {
        tvShows.append(loading);
        dbService.getNext(target.textContent).then(renderCard);
    }
});

modal.addEventListener('click', event => {
    if (event.target.closest('.cross') || event.target.classList.contains('modal')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    };
});

document.addEventListener('DOMContentLoaded', () => {
    fetch(`${serv}/tv/airing_today?api_key=${api}&language=ru`).then(res => {
        tvShows.append(loading);

        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url}`);
        }

        ;
    }).then(response => {
        plagination.textContent = '';
        tvShowsList.textContent = '';
        response.results.forEach(item => {
            tvShowsHead.textContent = 'Популярные сегодня';
            tvShowsHead.style.color = '';
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
            const idTV = id;
            card.innerHTML = `
                            <a href="#" id="${idTV}" class="tv-card">
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
        });
    });
});
