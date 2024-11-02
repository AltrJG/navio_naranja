const searchInput = document.getElementById('search-input');
const clearIcon = document.querySelector('.clear__icon');

window.addEventListener('DOMContentLoaded', () => {
    if (searchInput.value.length > 0) {
        clearIcon.classList.add('show-clear-icon');
    }
});

searchInput.addEventListener('input', () => {
    if (searchInput.value.length > 0) {
        clearIcon.classList.add('show-clear-icon');
    } else {
        clearIcon.classList.remove('show-clear-icon');
    }
});

clearIcon.addEventListener('click', () => {
    searchInput.value = '';
    clearIcon.classList.remove('show-clear-icon');
    searchInput.focus();
});
