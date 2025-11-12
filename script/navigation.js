const menuItems = document.querySelectorAll(".nav-links li a");
    let index = 0;

    menuItems[index].focus();

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") {
            index = (index + 1) % menuItems.length;
            menuItems[index].focus();
        } else if (e.key === "ArrowLeft") {
            index = (index - 1 + menuItems.length) % menuItems.length;
            menuItems[index].focus();
        }
    });