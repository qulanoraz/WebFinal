const button = document.querySelector(".current-time")

const display = document.createElement("div")
display.style.margin = "10px"
button.insertAdjacentElement("afterend", display)

button.addEventListener("click", () => {
    const now = new Date().toLocaleTimeString()
    display.textContent = "Current time: " + now
})