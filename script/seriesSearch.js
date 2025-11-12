$(document).ready(function() {
    var $searchBar = $('#searchBar');
    var $cards = $('.series-grid .card');
    var $overlays = $('.series-grid .card .overlay');
    var $autocompleteBox = $('#autocomplete-list');

    function getSeriesTitles() {
        return $overlays.map(function() { return $(this).text(); }).get();
    }
    $searchBar.on('input', function() {
        var keyword = $(this).val().toLowerCase();
        $cards.each(function() {
            var text = $(this).find('.overlay').text().toLowerCase();
            $(this).toggle(text.indexOf(keyword) !== -1);
        });
        removeHighlights();
        if (keyword.length > 0) {
            highlightMatches(keyword);
            showAutocomplete(keyword);
        } else {
            $autocompleteBox.hide();
        }
    });

    function showAutocomplete(val) {
        $autocompleteBox.empty();
        if (val.length === 0) {
            $autocompleteBox.hide();
            return;
        }
        var matchedTitles = getSeriesTitles().filter(function(title) {
            return title.toLowerCase().indexOf(val) !== -1;
        });
        if (matchedTitles.length === 0) {
            $autocompleteBox.hide();
            return;
        }
        matchedTitles.forEach(function(title) {
            $autocompleteBox.append('<div class="autocomplete-item">' + title + '</div>');
        });
        $autocompleteBox.show();
    }

    $(document).on('mousedown', '.autocomplete-item', function(e) {
        $searchBar.val($(this).text()).trigger('input');
        $autocompleteBox.hide();
    });
    $searchBar.on('blur', function() {
        setTimeout(function() {
            $autocompleteBox.hide();
        }, 100);
    });

    function highlightMatches(keyword) {
        $overlays.each(function() {
            var text = $(this).text();
            var re = new RegExp('(' + keyword + ')', 'ig');
            var highlighted = text.replace(re, '<span class="highlight">$1</span>');
            $(this).html(highlighted);
        });
    }
    function removeHighlights() {
        $overlays.each(function() {
            $(this).html($(this).text());
        });
    }
    $autocompleteBox.hide();
});
