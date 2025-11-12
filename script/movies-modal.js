// Movie data with trailers and descriptions
const movieData = {
  lalaland: {
    title: "La La Land",
    trailer: "https://www.youtube.com/embed/0pdqf4P9MB8",
    description: "A musical romantic drama about an aspiring actress and a jazz pianist who fall in love while pursuing their dreams in Los Angeles. The film won 6 Academy Awards and captivated millions of viewers with its magic, music, and choreography."
  },
  bladerunner: {
    title: "Blade Runner 2049",
    trailer: "https://www.youtube.com/embed/gCcx85zbxz4",
    description: "A science fiction thriller set 30 years after the events of the original film. A young blade runner uncovers a long-buried secret that could plunge society into chaos. A visually stunning masterpiece by Denis Villeneuve."
  },
  venom: {
    title: "Venom",
    trailer: "https://www.youtube.com/embed/u9Mv98Gr5pY",
    description: "Journalist Eddie Brock attempts to revive his career by investigating the life of genius scientist Carlton Drake. Brock becomes infected with a symbiont that grants him superpowers. Now he must learn to control his new abilities and defeat the villain."
  },
  django: {
    title: "Django Unchained",
    trailer: "https://www.youtube.com/embed/_iH0UBYDI4g",
    description: "Quentin Tarantino's western about former slave Django who, together with a bounty hunter, sets out to rescue his wife from the hands of a ruthless plantation owner. The film won two Academy Awards for Best Original Screenplay and Best Supporting Actor."
  },
  barbie: {
    title: "Barbie",
    trailer: "https://www.youtube.com/embed/pBk4NYhWNMM",
    description: "Barbie lives in the perfect world of Barbieland, but suddenly begins to notice that her life is not so perfect. She embarks on a journey to the real world to find true happiness. A vibrant comedy starring Margot Robbie and Ryan Gosling became one of the biggest hits of 2023."
  },
  inception: {
    title: "Inception",
    trailer: "https://www.youtube.com/embed/YoHD9XEInc0",
    description: "Cobb is a skilled thief, the best in the dangerous art of extraction: stealing valuable secrets from deep within the subconscious during the dream state. Cobb's rare abilities have made him a valuable player in the world of corporate espionage. Christopher Nolan's masterpiece about the nature of reality."
  },
  interstellar: {
    title: "Interstellar",
    trailer: "https://www.youtube.com/embed/zSWdZVtXT7E",
    description: "When drought leads humanity to a food crisis, a team of explorers travels through a wormhole in search of a planet that could become a new home. An epic science fiction drama about love, time, and the survival of humanity."
  },
  joker: {
    title: "Joker",
    trailer: "https://www.youtube.com/embed/zAGVQLHvwOY",
    description: "Gotham City, early 1980s. Comedian Arthur Fleck lives with his sick mother, who blames everyone around her for everything. Gradually, a series of failures changes his consciousness, and he transforms into the legendary villain Joker. Joaquin Phoenix won an Oscar for this role."
  },
  parasite: {
    title: "Parasite",
    trailer: "https://www.youtube.com/embed/5xH0HfJHsaY",
    description: "The impoverished Kim family ekes out a miserable existence in a dank basement apartment. One day, the family's son gets a job as a tutor in a wealthy house, and gradually all members of the Kim family infiltrate the life of the wealthy Park family. The first Korean film to win the Oscar for Best Picture."
  },
  dune: {
    title: "Dune",
    trailer: "https://www.youtube.com/embed/8g18jFHCLXk",
    description: "Paul, the heir of the famous House Atreides, travels with his family to one of the most dangerous planets in the universe — Arrakis. Giant sandworms live here, and the only valuable resource is spice, which can unlock human potential."
  }
};

// Get modal elements
const modal = document.getElementById('movieModal');
const modalTitle = document.getElementById('movieTitle');
const modalDescription = document.getElementById('movieDescription');
const modalTrailer = document.getElementById('movieTrailer');
const closeBtn = document.getElementsByClassName('close')[0];

// Add click event to all movie cards
document.addEventListener('DOMContentLoaded', function() {
  const movieCards = document.querySelectorAll('.card');
  
  movieCards.forEach(card => {
    card.addEventListener('click', function() {
      const movieId = this.getAttribute('data-movie');
      const movie = movieData[movieId];
      
      if (movie) {
        modalTitle.textContent = movie.title;
        modalDescription.textContent = movie.description;
        modalTrailer.src = movie.trailer;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
      }
    });
  });
});

// Close modal when clicking X
closeBtn.onclick = function() {
  modal.style.display = 'none';
  modalTrailer.src = ''; // Stop video
  document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
    modalTrailer.src = ''; // Stop video
    document.body.style.overflow = 'auto';
  }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' && modal.style.display === 'block') {
    modal.style.display = 'none';
    modalTrailer.src = ''; // Stop video
    document.body.style.overflow = 'auto';
  }
});
