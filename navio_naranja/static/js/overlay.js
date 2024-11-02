const navbar = document.querySelector('.navbar');
const overlay = document.querySelector('.overlay');
const overlay2 = document.querySelector('.overlay2');
const searchBar = document.querySelector('.search-bar');
const dropdown = document.querySelector('.dropdown');
const dropdownMenu = document.querySelector('.dropdown-menu');
const header = document.querySelector('header');

navbar.addEventListener('mouseenter', () => {
  overlay.classList.add('visible'); 
});

navbar.addEventListener('mouseleave', () => {
  overlay.classList.remove('visible'); 
});

searchBar.addEventListener('focusin', () => {
  overlay2.classList.add('visible');
  header.classList.add('header-overlay-active');
});

searchBar.addEventListener('focusout', () => {
  overlay2.classList.remove('visible');
  header.classList.remove('header-overlay-active');
});

dropdown.addEventListener('mouseenter', () => {
  searchInput.blur();
  overlay2.classList.add('visible');
  header.classList.add('header-overlay-active');
});

dropdown.addEventListener('mouseleave', () => {
  overlay2.classList.remove('visible');
  header.classList.remove('header-overlay-active');
});