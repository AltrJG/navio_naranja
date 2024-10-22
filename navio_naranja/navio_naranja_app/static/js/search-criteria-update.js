document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.querySelector('.search-bar');
    const genreFilters = document.getElementById('genre-filters');
    const toggleButton = document.getElementById('toggle-genres-btn');

    toggleButton.addEventListener('click', function () {
        genreFilters.classList.toggle('expanded');

        if (genreFilters.classList.contains('expanded')) {
            toggleButton.textContent = 'Ocultar géneros';
        } else {
            toggleButton.textContent = 'Mostrar todos los géneros';
        }
    });

    if (searchBar) {
        searchBar.style.display = 'flex';
    }

    document.querySelectorAll('.filter-label').forEach(label => {
        label.addEventListener('click', () => {
            const checkbox = label.querySelector('input[type="checkbox"]');
            const filterBox = label.querySelector('.filter-box');

            checkbox.checked = !checkbox.checked;
            filterBox.classList.toggle('selected', checkbox.checked);

            fetchResults();
        });
    });

    document.getElementById('search-input').addEventListener('input', function() {
        const query = this.value;
        fetchResults();
    });

    function fetchResults() {
        const form = document.getElementById('filter-form');
        const formData = new FormData(form);
        formData.set('q', document.getElementById('search-input').value);

        const queryString = new URLSearchParams(formData).toString();

        fetch(`/search_result/?${queryString}`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.text())
        .then(data => {
            document.getElementById('results-container').innerHTML = data;
        })
        .catch(error => console.error('Error fetching results:', error));
    }
});
