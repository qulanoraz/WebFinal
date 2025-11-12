const seriesData = {
  peakyblinders: {
    title: "Peaky Blinders",
    trailer: "https://www.youtube.com/embed/oVzVdvGIC7U",
    description: "A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby. The series follows the Shelby family as they expand their criminal empire in post-World War I Birmingham, facing rival gangs, the police, and political intrigue."
  },
  breakingbad: {
    title: "Breaking Bad",
    trailer: "https://www.youtube.com/embed/HhesaQXLuRY",
    description: "A high school chemistry teacher diagnosed with terminal lung cancer teams up with a former student to manufacture and sell methamphetamine to secure his family's future. As Walter White transforms from a mild-mannered teacher into a ruthless drug kingpin, the series explores themes of morality, family, and the consequences of choices."
  },
  got: {
    title: "Game of Thrones",
    trailer: "https://www.youtube.com/embed/KPLWWIOCOOQ",
    description: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia. Based on George R.R. Martin's novels, this epic fantasy series features political intrigue, complex characters, dragons, and white walkers in a brutal world where winter is coming."
  },
  moonknight: {
    title: "Moon Knight",
    trailer: "https://www.youtube.com/embed/x7Krla_UxRg",
    description: "Steven Grant and mercenary Marc Spector investigate the mysteries of the Egyptian gods from inside the same body. This Marvel series explores dissociative identity disorder as Marc Spector becomes the conduit for the Egyptian moon god Khonshu, fighting supernatural threats while dealing with his fractured psyche."
  },
  reacher: {
    title: "Reacher",
    trailer: "https://www.youtube.com/embed/GSScRL16dHg",
    description: "Jack Reacher, a veteran military police investigator, has recently entered civilian life. When he is falsely accused of murder, he finds himself embroiled in a deadly conspiracy involving dirty cops, businessmen, and scheming politicians. Based on Lee Child's bestselling novels, Reacher uses his sharp mind and combat skills to uncover the truth."
  },
  squidgame: {
    title: "Squid Game",
    trailer: "https://www.youtube.com/embed/oqxAJKy0ii4",
    description: "Hundreds of cash-strapped contestants accept an invitation to compete in children's games for a tempting prize, but the stakes are deadly. This South Korean survival drama became a global phenomenon, exploring themes of debt, capitalism, and human nature as desperate people risk everything for a chance at financial freedom."
  },
  strangers: {
    title: "Stranger Things",
    trailer: "https://www.youtube.com/embed/b9EkMc79ZSU",
    description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back. Set in 1980s Indiana, this nostalgic sci-fi horror series features parallel dimensions, secret government experiments, and a group of kids fighting against the creatures from the Upside Down."
  },
  witcher: {
    title: "The Witcher",
    trailer: "https://www.youtube.com/embed/ndl1W4ltcmg",
    description: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts. Based on the bestselling fantasy series, this epic tale follows Geralt as his destiny becomes intertwined with Princess Ciri and the sorceress Yennefer in a world filled with magic, political intrigue, and dangerous creatures."
  },
  thelastofus: {
    title: "The Last of Us",
    trailer: "https://www.youtube.com/embed/uLtkt8BonwM",
    description: "Twenty years after a fungal outbreak ravages the planet, Joel is tasked with escorting teenager Ellie across a post-apocalyptic America. Based on the acclaimed video game, this HBO series explores themes of survival, loss, and found family as the unlikely pair journey through a dangerous world filled with infected creatures and desperate survivors."
  },
  severance: {
    title: "Severance",
    trailer: "https://www.youtube.com/embed/xEQP4VVuyrY",
    description: "Mark leads a team at Lumon Industries, whose employees have undergone a severance procedure, which surgically divides their memories between their work and personal lives. This mind-bending thriller explores corporate dystopia, identity, and free will as workers begin to question the mysterious nature of their jobs and the true purpose of the severance program."
  }
};

const modal = document.getElementById('seriesModal');
const modalTitle = document.getElementById('seriesTitle');
const modalDescription = document.getElementById('seriesDescription');
const modalTrailer = document.getElementById('seriesTrailer');
const closeBtn = document.getElementsByClassName('close')[0];

document.addEventListener('DOMContentLoaded', function() {
  const seriesCards = document.querySelectorAll('.card[data-series]');
  
  seriesCards.forEach(card => {
    card.addEventListener('click', function() {
      const seriesId = this.getAttribute('data-series');
      const series = seriesData[seriesId];
      
      if (series) {
        modalTitle.textContent = series.title;
        modalDescription.textContent = series.description;
        modalTrailer.src = series.trailer;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
      }
    });
  });
});

if (closeBtn) {
  closeBtn.onclick = function() {
    modal.style.display = 'none';
    modalTrailer.src = '';
    document.body.style.overflow = 'auto';
  }
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
    modalTrailer.src = '';
    document.body.style.overflow = 'auto';
  }
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' && modal.style.display === 'block') {
    modal.style.display = 'none';
    modalTrailer.src = '';
    document.body.style.overflow = 'auto';
  }
});
