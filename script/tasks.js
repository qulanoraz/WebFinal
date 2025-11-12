const openBtn = document.getElementById('open-popup-btn');
const popup = document.getElementById('popup-form');
const closeBtn = document.getElementById('close-popup-btn');

openBtn.onclick = () => popup.classList.add('popup-visible');
closeBtn.onclick = () => popup.classList.remove('popup-visible');
window.onclick = (event) => {
  if (event.target === popup) popup.classList.remove('popup-visible');
};

const colorBtn = document.getElementById('change-bg-btn');
const colors = ["#14142b", "#28275b", "#0f1221", "#25184e", "#020024"];
let colorIdx = 0;
colorBtn.onclick = function() {
  colorIdx = (colorIdx + 1) % colors.length;
  document.body.style.background = colors[colorIdx];
};

const dateTimeBlock = document.getElementById('date-time-block');
function updateDateTime() {
  const now = new Date();
  const options = {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    hour12: true
  };
  dateTimeBlock.textContent = now.toLocaleString('en-US', options);
}
updateDateTime();
setInterval(updateDateTime, 1000);
