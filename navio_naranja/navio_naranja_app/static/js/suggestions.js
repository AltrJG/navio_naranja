document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const suggestionsBox = document.getElementById('suggestions');
    let selectedSuggestionIndex = -1;

    searchInput.addEventListener('input', function() {
        const query = searchInput.value;

        if (query.length > 0) {
            fetch(`/search-suggestions/?q=${query}`)
                .then(response => response.json())
                .then(data => {
                    suggestionsBox.innerHTML = '';
                    selectedSuggestionIndex = -1;

                    if (data.genres.length > 0) {
                        data.genres.forEach(genre => {
                            const genreItem = createSuggestionItem(`${genre.name}`);
                            suggestionsBox.appendChild(genreItem);
                        });
                    }

                    if (data.artists.length > 0) {
                        data.artists.forEach(artist => {
                            const artistItem = createSuggestionItem(`${artist.artist}`);
                            suggestionsBox.appendChild(artistItem);
                        });
                    }

                    if (data.songs.length > 0) {
                        data.songs.forEach(song => {
                            const songItem = createSuggestionItem(`${song.title}`);
                            suggestionsBox.appendChild(songItem);
                        });
                    }

                    if (data.products.length > 0) {
                        data.products.forEach(product => {
                            const productItem = createSuggestionItem(`${product.title}`);
                            suggestionsBox.appendChild(productItem);
                        });
                    }

                    if (suggestionsBox.children.length > 0) {
                        suggestionsBox.style.display = 'block';
                    } else {
                        suggestionsBox.style.display = 'none';
                    }
                });
        } else {
            suggestionsBox.style.display = 'none';
        }
    });

    function createSuggestionItem(text) {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');

        const icon = document.createElement('i');
        icon.classList.add('bx', 'bx-search');

        const textSpan = document.createElement('span');
        textSpan.textContent = text;

        suggestionItem.appendChild(icon);
        suggestionItem.appendChild(textSpan);

        suggestionItem.addEventListener('click', function() {
            searchInput.value = text;
            suggestionsBox.style.display = 'none'; 
            performSearch(text);
        });

        return suggestionItem;
    }

    document.addEventListener('keydown', function(event) {
        const suggestionItems = suggestionsBox.getElementsByClassName('suggestion-item');
        const suggestionCount = suggestionItems.length;

        if (event.key === 'ArrowDown') {
            selectedSuggestionIndex = (selectedSuggestionIndex + 1) % suggestionCount;
            updateSuggestionSelection(suggestionItems);
        } else if (event.key === 'ArrowUp') {
            selectedSuggestionIndex = (selectedSuggestionIndex - 1 + suggestionCount) % suggestionCount;
            updateSuggestionSelection(suggestionItems);
        } else if (event.key === 'Enter') {
            const query = searchInput.value;
            if (query.length > 0) {
                performSearch(query);
            }
        }
    });

    function performSearch(query) {
        window.location.href = `/search_result/?q=${encodeURIComponent(query)}`;
    }

    function updateSuggestionSelection(suggestionItems) {
        for (let i = 0; i < suggestionItems.length; i++) {
            if (i === selectedSuggestionIndex) {
                suggestionItems[i].classList.add('selected');
            } else {
                suggestionItems[i].classList.remove('selected');
            }
        }

        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestionItems.length) {
            searchInput.value = suggestionItems[selectedSuggestionIndex].textContent;
        }
    }

    searchInput.addEventListener('focus', function() {
        if (searchInput.value.length > 0) {
            suggestionsBox.style.display = 'block';
        }
    });

    searchInput.addEventListener('blur', function() {
        setTimeout(() => {
            suggestionsBox.style.display = 'none';
        }, 100); 
    });

    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.style.display = 'none';
        }
    });
});
