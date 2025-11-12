const collectionsData = {
  musicals: {
    title: "Musicals Collection",
    items: [
      { name: "La La Land", type: "movie", image: "./images/image126.jpg" },
      { name: "Barbie", type: "movie", image: "./images/image92.jpg" },
      { name: "The Greatest Showman", type: "movie", image: "./images/greatest-showman.jpg" },
      { name: "Moulin Rouge", type: "movie", image: "./images/moulin-rouge.jpg" },
      { name: "Mamma Mia!", type: "movie", image: "./images/mamma-mia.jpg" }
    ]
  },
  marvel: {
    title: "Marvel Collection",
    items: [
      { name: "Venom", type: "movie", image: "./images/image135.jpg" },
      { name: "Moon Knight", type: "series", image: "./images/white.jpg" },
      { name: "Iron Man", type: "movie", image: "./images/ironman.jpg" },
      { name: "The Avengers", type: "movie", image: "./images/avengers.jpg" },
      { name: "Spider-Man", type: "movie", image: "./images/spiderman.jpg" }
    ]
  },
  dc: {
    title: "DC Collection",
    items: [
      { name: "The Batman", type: "movie", image: "./images/batman.jpg" },
      { name: "Joker", type: "movie", image: "./images/joker.jpg" },
      { name: "Wonder Woman", type: "movie", image: "./images/wonderwoman.jpg" },
      { name: "Aquaman", type: "movie", image: "./images/aquaman.jpg" },
      { name: "The Flash", type: "series", image: "./images/flash.jpg" }
    ]
  },
  johnwick: {
    title: "John Wick Collection",
    items: [
      { name: "John Wick", type: "movie", image: "./images/johnwick1.jpg" },
      { name: "John Wick: Chapter 2", type: "movie", image: "./images/johnwick2.jpg" },
      { name: "John Wick: Chapter 3", type: "movie", image: "./images/johnwick3.jpg" },
      { name: "John Wick: Chapter 4", type: "movie", image: "./images/johnwick4.jpg" }
    ]
  },
  godzilla: {
    title: "Godzilla Collection",
    items: [
      { name: "Godzilla (2014)", type: "movie", image: "./images/godzilla2014.jpg" },
      { name: "Godzilla: King of Monsters", type: "movie", image: "./images/godzilla-king.jpg" },
      { name: "Godzilla vs. Kong", type: "movie", image: "./images/godzilla-kong.jpg" },
      { name: "Godzilla Minus One", type: "movie", image: "./images/godzilla-minus.jpg" },
      { name: "Monarch: Legacy", type: "series", image: "./images/monarch.jpg" }
    ]
  }
};

const modal = document.getElementById('collectionModal');
const modalTitle = document.getElementById('collectionTitle');
const collectionItemsContainer = document.getElementById('collectionItems');
const closeBtn = document.getElementsByClassName('close')[0];

document.addEventListener('DOMContentLoaded', function() {
  console.log('Collection modal script loaded');
  
  const collectionCards = document.querySelectorAll('.collection__images-item');
  console.log('Found cards:', collectionCards.length);
  
  collectionCards.forEach(card => {
    const btn = card.querySelector('.go-watch-btn');
    if (btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        const collectionId = card.getAttribute('data-collection');
        console.log('Clicked collection:', collectionId);
        openCollectionModal(collectionId);
      });
    }
  });
});

function openCollectionModal(collectionId) {
  console.log('Opening modal for:', collectionId);
  const collection = collectionsData[collectionId];
  
  if (!collection) {
    console.error('Collection not found:', collectionId);
    return;
  }

  modalTitle.textContent = collection.title;
  collectionItemsContainer.innerHTML = '';

  collection.items.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'collection-item';
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}" onerror="this.src='./images/placeholder.jpg'">
      <div class="collection-item-info">
        <h3>${item.name}</h3>
        <span class="type-badge">${item.type}</span>
      </div>
    `;
    collectionItemsContainer.appendChild(itemDiv);
  });

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  console.log('Modal opened');
}

if (closeBtn) {
  closeBtn.onclick = function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' && modal && modal.style.display === 'block') {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});
