// Объявление переменных
const leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    tvShowsItem = document.querySelectorAll('.tv-shows__item');

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

tvShowsItem.forEach(element => {
    element.addEventListener('mouseover', event => {
        const target = event.target,
            img = target.closest('img');
        let src = img.src,
            dataBackdrop = img.getAttribute('data-backdrop');
        if (img) {
            img.src = dataBackdrop;
            img.setAttribute('data-backdrop', src);
        }

    });

    element.addEventListener('mouseout', event => {
        const target = event.target,
            img = target.closest('img');
        let src = img.src,
            dataBackdrop = img.getAttribute('data-backdrop');
        if (img) {
            img.src = dataBackdrop;
            img.setAttribute('data-backdrop', src);
        }
    });

});