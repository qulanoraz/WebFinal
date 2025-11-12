document.addEventListener("DOMContentLoaded", function() {
  const btn = document.getElementById('read-more-btn');
  const moreText = document.getElementById('more-text');

  btn.addEventListener('click', function() {
    if (moreText.classList.contains('open')) {
      moreText.classList.remove('open');
      moreText.style.display = 'none';
      btn.textContent = 'Read More';
    } else {
      moreText.classList.add('open');
      moreText.style.display = 'inline';
      btn.textContent = 'Read Less';
    }
  });
});
