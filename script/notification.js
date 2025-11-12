$(document).ready(function() {
  $('#subscribeForm').on('submit', function(e) {
    e.preventDefault();
    showNotif('Form submitted successfully');
    this.reset();
    setTimeout(function() {
      $('#popup-form').removeClass('popup-visible');
    }, 1200);
  });

  function showNotif(message) {
    var $n = $('<div class="custom-toast"></div>').text(message);
    $('body').append($n);
    setTimeout(function() {
      $n.fadeOut(700, function(){ $(this).remove(); });
    }, 1700);
  }
});
