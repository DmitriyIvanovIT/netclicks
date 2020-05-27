const imgURL = "https://image.tmdb.org/t/p/w185_and_h278_bestv2",
API_KEY = "a5fbea0d07b256ed534002b62cae1500";
// Объявление переменных
const leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    tvShowsList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal');

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
            return await this.getData('test.json');
        };


    },
    renderCard = response => {
        console.log(response.results);
        tvShowsList.textContent = '';

        response.results.forEach(item => {
            const { 
                vote_average: rating, 
                poster_path: poster, 
                name: title, 
                backdrop_path: backdrop 
            } = item;

            const posterIMG = poster ? imgURL + poster : 'img/no-poster.jpg',
            backdropIMG = backdrop ? imgURL + backdrop : '',
            voteElem = rating !== 0 ? ` <span class="tv-card__vote">${rating}</span>`: '' ; 


            const card = document.createElement('li');
            card.className = 'tv-shows__item';
            card.innerHTML = `
                <a href="#" class="tv-card">
                    ${voteElem}
                    <img class="tv-card__img"
                        src="${posterIMG}"
                        data-backdrop="${backdropIMG}"
                        alt="Звёздные войны: Повстанцы">
                    <h4 class="tv-card__head">${title}</h4>
                </a>
            `;
            tvShowsList.append(card);
        })
    }

new DBService().getTestData().then(renderCard);

// Функции
const toggleMenu = () => {
        leftMenu.classList.toggle('openMenu');
        hamburger.classList.toggle('open');
    },
    openDropDown = (event) => {
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
        card = target.closest('.tv-shows__item');

    if (card) {
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
    };

});

modal.addEventListener('click', event => {
    const target = event.target,
        close = target.classList.contains('modal');

    if (close || target.closest('.cross')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    };

});