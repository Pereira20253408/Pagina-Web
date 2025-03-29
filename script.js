document.addEventListener("DOMContentLoaded", function () {
    // 1️⃣ Efecto de Zoom al pasar el mouse sobre los botones
    let buttons = document.querySelectorAll(".download-btn");

    buttons.forEach((btn) => {
        btn.addEventListener("mouseover", function () {
            btn.style.transform = "scale(1.1)";
            btn.style.transition = "transform 0.3s ease-in-out";
        });

        btn.addEventListener("mouseout", function () {
            btn.style.transform = "scale(1)";
        });
    });

    // 2️⃣ Animación de rebote en los títulos
    let titles = document.querySelectorAll(".game h2");

    titles.forEach((title) => {
        title.addEventListener("mouseenter", function () {
            title.style.animation = "bounce 0.5s ease-in-out";
        });

        title.addEventListener("animationend", function () {
            title.style.animation = ""; // Resetea la animación
        });
    });

    // 3️⃣ Efecto de "presionado" en los botones al hacer clic
    buttons.forEach((btn) => {
        btn.addEventListener("mousedown", function () {
            btn.style.transform = "scale(0.9)";
        });

        btn.addEventListener("mouseup", function () {
            btn.style.transform = "scale(1)";
        });
    });
});

// Función para actualizar el contador de descargas
function incrementCounter(gameKey) {
    let count = localStorage.getItem(gameKey) || 0;
    count++;
    localStorage.setItem(gameKey, count);
    document.getElementById(`count-${gameKey}`).innerText = count;
}

// Función para cargar los valores guardados al abrir la página
function loadCounters() {
    let games = ["game1", "game2", "game3"];
    games.forEach(game => {
        let count = localStorage.getItem(game) || 0;
        document.getElementById(`count-${game}`).innerText = count;
    });
}

// Cargar contadores al iniciar la página
window.onload = loadCounters;
