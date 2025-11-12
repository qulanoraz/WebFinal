$(document).ready(function() {
  $('#copyFooterBtn').on('click', function() {
    var text = $('#footerTeam').text() + '\n' + $('#footerMembers').text();
    navigator.clipboard.writeText(text).then(function() {
      $('.copy-icon').text('✅');
      $('#copyTooltip').fadeIn(150);
      setTimeout(function() {
        $('.copy-icon').text('📋');
        $('#copyTooltip').fadeOut(300);
      }, 1400);
    });
  });
});
