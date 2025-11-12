$(document).ready(function() {
    const $progressBar = $("#progressBar");

    function updateScrollProgress() {
        const currentScroll = $(window).scrollTop();
        const totalHeight = $(document).height();
        const viewportHeight = $(window).height();

        const scrollableHeight = totalHeight - viewportHeight;

        let scrollPercentage = 0;
        if (scrollableHeight > 0) {
            scrollPercentage = (currentScroll / scrollableHeight) * 100;
        }

        $progressBar.css("width", scrollPercentage + "%");
    }

    $(window).on("scroll", updateScrollProgress);

    updateScrollProgress();
});