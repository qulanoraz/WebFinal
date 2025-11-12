$(document).ready(function() {
    $('.count-number').each(function() {
        const $this = $(this);
        
        const target = parseInt($this.attr('data-target'));
        $this.prop('Counter', 0).animate({
            Counter: target
        }, {
            duration: 2000,
            easing: 'swing',
            
            step: function(now) {
                const displayValue = Math.ceil(now);
                $this.text(displayValue);
            },
            complete: function() {
                $this.text(target);
            }
        });
    });
});