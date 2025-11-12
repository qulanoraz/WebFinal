class OMDbAPI {
    constructor() {
        this.apiKey = '467c7b98';
        this.baseURL = 'https://www.omdbapi.com/';
        this.cache = this.getCache();
    }

    async getMovieData(title) {
        if (this.cache[title] && this.cache[title].timestamp > Date.now() - 86400000) {
            return this.cache[title].data;
        }

        try {
            const response = await fetch(
                `${this.baseURL}?apikey=${this.apiKey}&t=${encodeURIComponent(title)}&plot=full`
            );
            const data = await response.json();

            if (data.Response === 'True') {
                this.cache[title] = {
                    data: data,
                    timestamp: Date.now()
                };
                this.saveCache();
                return data;
            } else {
                console.warn(`Movie not found: ${title}`);
                return null;
            }
        } catch (error) {
            console.error('OMDb API error:', error);
            return null;
        }
    }

    async searchMovies(query, page = 1) {
        try {
            const response = await fetch(
                `${this.baseURL}?apikey=${this.apiKey}&s=${encodeURIComponent(query)}&page=${page}`
            );
            const data = await response.json();

            if (data.Response === 'True') {
                return {
                    movies: data.Search,
                    totalResults: parseInt(data.totalResults),
                    success: true
                };
            } else {
                return { movies: [], totalResults: 0, success: false };
            }
        } catch (error) {
            console.error('OMDb search error:', error);
            return { movies: [], totalResults: 0, success: false };
        }
    }

    async getMovieByIMDb(imdbID) {
        try {
            const response = await fetch(
                `${this.baseURL}?apikey=${this.apiKey}&i=${imdbID}&plot=full`
            );
            const data = await response.json();
            
            return data.Response === 'True' ? data : null;
        } catch (error) {
            console.error('OMDb IMDb error:', error);
            return null;
        }
    }

    getCache() {
        const cache = localStorage.getItem('omdbCache');
        return cache ? JSON.parse(cache) : {};
    }

    saveCache() {
        localStorage.setItem('omdbCache', JSON.stringify(this.cache));
    }

    async enrichCard(card) {
    const movieId = card.getAttribute('data-movie') || card.getAttribute('data-series');
    
    if (card.querySelector('.omdb-info')) return;

    const img = card.querySelector('img');
    if (!img) {
        console.warn('❌ Карточка без изображения:', card);
        return;
    }

    const title = img.alt.trim();
    console.log('🔍 Ищу фильм:', title);

    if (!title) {
        console.warn('❌ У изображения нет alt:', card);
        return;
    }

    const movieData = await this.getMovieData(title);

    if (movieData) {
        console.log('✅ Данные получены для:', title);
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'omdb-info';
        infoDiv.innerHTML = `
            <div class="movie-title">${movieData.Title}</div>
            <div class="omdb-badge">
                ${movieData.imdbRating !== 'N/A' ? 
                    `<span class="imdb-rating">⭐ ${movieData.imdbRating}/10</span>` : ''}
                ${movieData.Year ? `<span class="year">${movieData.Year}</span>` : ''}
                ${movieData.Runtime !== 'N/A' ? 
                    `<span class="runtime">⏱ ${movieData.Runtime}</span>` : ''}
            </div>
            ${movieData.Genre !== 'N/A' ? 
                `<div class="genre-tags">${this.createGenreTags(movieData.Genre)}</div>` : ''}
        `;
        
        const ratingContainer = card.querySelector('.rating-container');
        if (ratingContainer) {
            card.insertBefore(infoDiv, ratingContainer);
        } else {
            card.appendChild(infoDiv);
        }

        card.setAttribute('data-omdb', JSON.stringify(movieData));
    } else {
        console.warn('⚠️ Фильм не найден:', title);
    }
}


    createGenreTags(genres) {
        return genres.split(', ')
            .map(genre => `<span class="genre-tag">${genre}</span>`)
            .join('');
    }

    showMovieModal(movieData) {
        if (!movieData) return;

        const modalHTML = `
            <div id="movie-modal" class="movie-modal">
                <div class="movie-modal-content">
                    <span class="movie-modal-close">&times;</span>
                    <div class="movie-modal-body">
                        <div class="movie-poster">
                            ${movieData.Poster !== 'N/A' ? 
                                `<img src="${movieData.Poster}" alt="${movieData.Title}">` : 
                                '<div class="no-poster">No Poster</div>'}
                        </div>
                        <div class="movie-details">
                            <h2>${movieData.Title} (${movieData.Year})</h2>
                            <div class="movie-meta">
                                <span>⭐ ${movieData.imdbRating}/10</span>
                                <span>⏱ ${movieData.Runtime}</span>
                                <span>🎬 ${movieData.Genre}</span>
                            </div>
                            <p class="plot">${movieData.Plot}</p>
                            <div class="movie-info-grid">
                                <div><strong>Director:</strong> ${movieData.Director}</div>
                                <div><strong>Cast:</strong> ${movieData.Actors}</div>
                                <div><strong>Awards:</strong> ${movieData.Awards}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('movie-modal');
        if (existingModal) existingModal.remove();

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.getElementById('movie-modal');
        const closeBtn = modal.querySelector('.movie-modal-close');

        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
}

window.OMDbAPI = OMDbAPI;
