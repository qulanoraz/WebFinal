window.showNotification = function(message, type = 'info') {
    let container = document.querySelector('.notification-container');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    setTimeout(() => {
        closeNotification(notification);
    }, 3000);
};

function closeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        notification.remove();
    }, 300);
}
class RatingSystem {
    constructor() {
        this.init();
    }

    init() {
        this.addRatingToCards();
    }

    addRatingToCards() {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            const movieId = card.getAttribute('data-movie') || card.getAttribute('data-series');
            if (!movieId) return;

            if (card.querySelector('.rating-container')) return;

            const ratingContainer = document.createElement('div');
            ratingContainer.className = 'rating-container';
            ratingContainer.innerHTML = `
                <div class="star-rating" data-movie-id="${movieId}">
                    ${this.createStars(movieId)}
                </div>
                <div class="rating-info">
                    <span class="rating-score">${this.getAverageRating(movieId)}</span>
                    <span class="rating-count">(${this.getRatingCount(movieId)})</span>
                </div>
            `;

            card.appendChild(ratingContainer);

            const stars = ratingContainer.querySelectorAll('.star');
            stars.forEach((star, index) => {
                star.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    this.rateMovie(movieId, index + 1);
                });

                star.addEventListener('mouseenter', (e) => {
                    e.stopPropagation();
                    this.highlightStars(stars, index);
                });
            });

            ratingContainer.addEventListener('mouseleave', () => {
                this.resetStars(stars, movieId);
            });

            ratingContainer.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    }

    createStars(movieId) {
        const userRating = this.getUserRating(movieId);
        let starsHTML = '';
        
        for (let i = 1; i <= 5; i++) {
            const filled = i <= userRating;
            starsHTML += `<span class="star ${filled ? 'filled' : ''}" data-value="${i}">★</span>`;
        }
        
        return starsHTML;
    }

    rateMovie(movieId, rating) {
        if (!window.authSystem || !window.authSystem.isLoggedIn()) {
            window.showNotification('Please log in to rate movies!', 'error');
            if (window.openLoginModal) {
                window.openLoginModal();
            }
            return;
        }

        const currentUser = window.authSystem.currentUser;
        
        let allRatings = this.getAllRatings();
        
        if (!allRatings[movieId]) {
            allRatings[movieId] = {};
        }

        allRatings[movieId][currentUser.id] = {
            rating: rating,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('movieRatings', JSON.stringify(allRatings));

        this.updateRatingDisplay(movieId);
        
        window.showNotification(`Rated ${rating} star${rating > 1 ? 's' : ''}!`, 'success');
    }

    getAllRatings() {
        const ratings = localStorage.getItem('movieRatings');
        return ratings ? JSON.parse(ratings) : {};
    }

    getUserRating(movieId) {
        if (!window.authSystem || !window.authSystem.isLoggedIn()) {
            return 0;
        }

        const allRatings = this.getAllRatings();
        const movieRatings = allRatings[movieId];
        
        if (!movieRatings) return 0;

        const currentUser = window.authSystem.currentUser;
        const userRating = movieRatings[currentUser.id];

        return userRating ? userRating.rating : 0;
    }

    getAverageRating(movieId) {
        const allRatings = this.getAllRatings();
        const movieRatings = allRatings[movieId];

        if (!movieRatings || Object.keys(movieRatings).length === 0) {
            return '0.0';
        }

        const ratings = Object.values(movieRatings).map(r => r.rating);
        const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;

        return average.toFixed(1);
    }

    getRatingCount(movieId) {
        const allRatings = this.getAllRatings();
        const movieRatings = allRatings[movieId];

        if (!movieRatings) return 0;

        return Object.keys(movieRatings).length;
    }

    highlightStars(stars, index) {
        stars.forEach((star, i) => {
            if (i <= index) {
                star.classList.add('highlight');
            } else {
                star.classList.remove('highlight');
            }
        });
    }

    resetStars(stars, movieId) {
        const userRating = this.getUserRating(movieId);
        stars.forEach((star, i) => {
            star.classList.remove('highlight');
            if (i < userRating) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
            }
        });
    }

    updateRatingDisplay(movieId) {
        const ratingContainer = document.querySelector(`[data-movie-id="${movieId}"]`)?.parentElement;
        if (!ratingContainer) return;

        const scoreElement = ratingContainer.querySelector('.rating-score');
        const countElement = ratingContainer.querySelector('.rating-count');

        scoreElement.textContent = this.getAverageRating(movieId);
        countElement.textContent = `(${this.getRatingCount(movieId)})`;

        const stars = ratingContainer.querySelectorAll('.star');
        const userRating = this.getUserRating(movieId);
        
        stars.forEach((star, i) => {
            if (i < userRating) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
            }
        });
    }

    hasUserRated(movieId) {
        return this.getUserRating(movieId) > 0;
    }
}


document.addEventListener('DOMContentLoaded', function() {
    if (!window.authSystem) {
        console.error('AuthSystem not loaded!');
        return;
    }
    
    window.ratingSystem = new RatingSystem();
    window.searchFilterSystem = new SearchFilterSystem();
    window.watchlistSystem = new WatchlistSystem();
    window.omdbAPI = new OMDbAPI(); 

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        window.omdbAPI.enrichCard(card);
        
        card.addEventListener('click', async () => {
            const omdbData = card.getAttribute('data-omdb');
            if (omdbData) {
                const movieData = JSON.parse(omdbData);
                window.omdbAPI.showMovieModal(movieData);
            }
        });
    });
});


class SearchFilterSystem {
    constructor() {
        this.searchHistory = this.getSearchHistory();
        this.init();
    }

    init() {
        this.setupSearchBar();
        this.setupFilters();
    }

    setupSearchBar() {
        const searchBar = document.getElementById('searchBar');
        
        if (searchBar) {
            searchBar.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (query.length >= 2) {
                    this.performSearch(query);
                } else {
                    this.showAllCards();
                }
            });

            searchBar.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = e.target.value.trim();
                    if (query) {
                        this.saveSearch(query);
                    }
                }
            });
        }
    }

    performSearch(query) {
        const cards = document.querySelectorAll('.card');
        const lowerQuery = query.toLowerCase();
        let foundCount = 0;

        cards.forEach(card => {
            const overlay = card.querySelector('.overlay');
            const title = overlay ? overlay.textContent.toLowerCase() : '';
            const movieId = card.getAttribute('data-movie') || card.getAttribute('data-series') || '';

            if (title.includes(lowerQuery) || movieId.includes(lowerQuery)) {
                card.style.display = 'block';
                foundCount++;
                
                if (overlay) {
                    const originalText = overlay.textContent;
                    const highlightedText = this.highlightText(originalText, query);
                    overlay.innerHTML = highlightedText;
                }
            } else {
                card.style.display = 'none';
            }
        });

        this.showSearchResults(foundCount, query);
    }

    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    showAllCards() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.display = 'block';
            const overlay = card.querySelector('.overlay');
            if (overlay) {
                overlay.innerHTML = overlay.textContent;
            }
        });

        const resultsMessage = document.getElementById('search-results-message');
        if (resultsMessage) {
            resultsMessage.remove();
        }
    }

    showSearchResults(count, query) {
        let resultsMessage = document.getElementById('search-results-message');
        
        if (!resultsMessage) {
            resultsMessage = document.createElement('div');
            resultsMessage.id = 'search-results-message';
            resultsMessage.className = 'search-results-message';
            
            const grid = document.querySelector('.movie-grid, .series-grid');
            if (grid) {
                grid.parentNode.insertBefore(resultsMessage, grid);
            }
        }

        if (count === 0) {
            resultsMessage.innerHTML = `
                <p>No results found for "<strong>${query}</strong>"</p>
                <button onclick="searchFilterSystem.clearSearch()" class="btn-secondary">Clear Search</button>
            `;
            resultsMessage.style.display = 'block';
        } else {
            resultsMessage.innerHTML = `
                <p>Found <strong>${count}</strong> result${count > 1 ? 's' : ''} for "<strong>${query}</strong>"</p>
            `;
            resultsMessage.style.display = 'block';
        }
    }

    clearSearch() {
        const searchBar = document.getElementById('searchBar');
        if (searchBar) {
            searchBar.value = '';
            this.showAllCards();
        }
    }

    saveSearch(query) {
        if (this.searchHistory.includes(query)) {
            return;
        }

        this.searchHistory.unshift(query);
        
        if (this.searchHistory.length > 10) {
            this.searchHistory = this.searchHistory.slice(0, 10);
        }

        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }

    getSearchHistory() {
        const history = localStorage.getItem('searchHistory');
        return history ? JSON.parse(history) : [];
    }

    setupFilters() {
        this.addFilterButtons();
    }

    addFilterButtons() {
        const pageTitle = document.querySelector('.page-title');
        
        if (pageTitle && !document.getElementById('filter-container')) {
            const filterContainer = document.createElement('div');
            filterContainer.id = 'filter-container';
            filterContainer.className = 'filter-container';
            filterContainer.innerHTML = `
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="rated">Rated by Me</button>
            `;

            pageTitle.parentNode.insertBefore(filterContainer, pageTitle.nextSibling);

            const filterButtons = filterContainer.querySelectorAll('.filter-btn');
            filterButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    const filter = btn.getAttribute('data-filter');
                    this.applyFilter(filter);
                });
            });
        }
    }

    applyFilter(filter) {
        const cards = document.querySelectorAll('.card');

        if (filter === 'all') {
            cards.forEach(card => card.style.display = 'block');
            return;
        }

        if (filter === 'rated') {
            if (!window.authSystem || !window.authSystem.isLoggedIn()) {
                window.showNotification('Please log in to see your ratings!', 'error');
                const allBtn = document.querySelector('[data-filter="all"]');
                if (allBtn) {
                    allBtn.click();
                }
                return;
            }

            let visibleCount = 0;
            cards.forEach(card => {
                const movieId = card.getAttribute('data-movie') || card.getAttribute('data-series');
                const hasRated = window.ratingSystem.hasUserRated(movieId);
                
                if (hasRated) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (visibleCount === 0) {
                window.showNotification('You haven\'t rated any movies yet!', 'info');
                const allBtn = document.querySelector('[data-filter="all"]');
                if (allBtn) {
                    allBtn.click();
                }
            }
        }

        if (filter === 'top-rated') {
            const cardArray = Array.from(cards);
            
            cardArray.sort((a, b) => {
                const aId = a.getAttribute('data-movie') || a.getAttribute('data-series');
                const bId = b.getAttribute('data-movie') || b.getAttribute('data-series');
                
                const aRating = parseFloat(window.ratingSystem.getAverageRating(aId));
                const bRating = parseFloat(window.ratingSystem.getAverageRating(bId));
                
                return bRating - aRating;
            });

            let shownCount = 0;
            cardArray.forEach(card => {
                const movieId = card.getAttribute('data-movie') || card.getAttribute('data-series');
                const ratingCount = window.ratingSystem.getRatingCount(movieId);
                
                if (ratingCount > 0 && shownCount < 10) {
                    card.style.display = 'block';
                    shownCount++;
                } else if (ratingCount === 0) {
                    card.style.display = 'none';
                }
            });

            if (shownCount === 0) {
                window.showNotification('No movies have been rated yet!', 'info');
                const allBtn = document.querySelector('[data-filter="all"]');
                if (allBtn) {
                    allBtn.click();
                }
            }
        }
    }
}


class WatchlistSystem {
    constructor() {
        this.init();
    }

    init() {
        this.addWatchlistButtons();
    }

    addWatchlistButtons() {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            if (card.querySelector('.watchlist-btn')) return;

            const movieId = card.getAttribute('data-movie') || card.getAttribute('data-series');
            const isInWatchlist = this.isInWatchlist(movieId);

            const btn = document.createElement('button');
            btn.className = 'watchlist-btn';
            btn.innerHTML = isInWatchlist ? '✓' : '+';
            btn.title = isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist';
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.toggleWatchlist(movieId, btn);
            });

            card.appendChild(btn);
        });
    }

    toggleWatchlist(movieId, btn) {
        if (!window.authSystem || !window.authSystem.isLoggedIn()) {
            window.showNotification('Please log in to add to watchlist!', 'error');
            if (window.openLoginModal) {
                window.openLoginModal();
            }
            return;
        }

        const isInWatchlist = this.isInWatchlist(movieId);

        if (isInWatchlist) {
            this.removeFromWatchlist(movieId);
            btn.innerHTML = '+';
            btn.title = 'Add to Watchlist';
            window.showNotification('Removed from watchlist!', 'success');
        } else {
            this.addToWatchlist(movieId);
            btn.innerHTML = '✓';
            btn.title = 'Remove from Watchlist';
            window.showNotification('Added to watchlist!', 'success');
        }
    }

    addToWatchlist(movieId) {
        const watchlist = this.getWatchlist();
        
        if (!watchlist.includes(movieId)) {
            watchlist.push(movieId);
            this.saveWatchlist(watchlist);
        }
    }

    removeFromWatchlist(movieId) {
        let watchlist = this.getWatchlist();
        watchlist = watchlist.filter(id => id !== movieId);
        this.saveWatchlist(watchlist);
    }

    isInWatchlist(movieId) {
        const watchlist = this.getWatchlist();
        return watchlist.includes(movieId);
    }

    getWatchlist() {
        if (!window.authSystem || !window.authSystem.isLoggedIn()) {
            return [];
        }

        const currentUser = window.authSystem.currentUser;
        const key = `watchlist_${currentUser.id}`;
        const watchlist = localStorage.getItem(key);
        
        return watchlist ? JSON.parse(watchlist) : [];
    }

    saveWatchlist(watchlist) {
        const currentUser = window.authSystem.currentUser;
        const key = `watchlist_${currentUser.id}`;
        localStorage.setItem(key, JSON.stringify(watchlist));
    }
}


document.addEventListener('DOMContentLoaded', function() {
    window.ratingSystem = new RatingSystem();
    window.searchFilterSystem = new SearchFilterSystem();
    window.watchlistSystem = new WatchlistSystem();
    window.omdbAPI = new OMDbAPI();

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        window.omdbAPI.enrichCard(card);
    });
});