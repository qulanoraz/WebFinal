const items = document.querySelectorAll(".collection__images-item");

items.forEach((item) => {
    item.addEventListener("mouseenter", () => {
        item.style.transform = "scale(1.05)";
        item.style.transition = "transform 0.3s ease";
    });
    item.addEventListener("mouseleave", () => {
        item.style.transform = "scale(1)";
    });
});