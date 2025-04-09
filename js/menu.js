// menu.js

// Función para actualizar el enlace activo en la navegación
function updateActiveNavLink() {
    const currentPath = window.location.pathname;

    // Obtener el nombre del archivo actual (ej. "videos.html", "index.html", "juegos.html")
    let currentPageFile = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    if (currentPageFile === "" || currentPageFile === "/") {
        // Si la ruta es la raíz, consideramos que es index.html
        currentPageFile = "index.html";
    }

    // Seleccionar todos los enlaces de la navegación principal
    const navLinks = document.querySelectorAll('header nav ul li a');

    // Recorrer cada enlace
    navLinks.forEach(link => {
        // Obtener el nombre del archivo al que apunta el enlace
        const linkFile = link.getAttribute('href').substring(link.getAttribute('href').lastIndexOf('/') + 1);

        // Primero, quitar la clase 'active' por si la tenía
        link.classList.remove('active');

        // Si el archivo del enlace coincide con el archivo de la página actual, añadir 'active'
        if (linkFile === currentPageFile) {
            link.classList.add('active');
        }
    });
}

// Inicializar el menú de navegación
document.addEventListener('DOMContentLoaded', () => {
    // Ejecutar la función UNA VEZ al cargar la página inicialmente
    updateActiveNavLink();

    // Seleccionar los elementos necesarios
    const navToggleBtn = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('#main-nav'); // El <nav>

    // Verificar si el botón existe (importante)
    if (navToggleBtn && mainNav) {
        navToggleBtn.addEventListener('click', () => {
            // Alternar la clase 'nav-active' en el elemento <nav>
            mainNav.classList.toggle('nav-active');

            // Alternar atributos ARIA para accesibilidad
            const isExpanded = mainNav.classList.contains('nav-active');
            navToggleBtn.setAttribute('aria-expanded', isExpanded);

            // Opcional: Cambiar el icono de hamburguesa a una 'X' y viceversa
            const icon = navToggleBtn.querySelector('i');
            if (isExpanded) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times'); // Asegúrate de tener Font Awesome cargado
                navToggleBtn.setAttribute('aria-label', 'Cerrar menú de navegación');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                navToggleBtn.setAttribute('aria-label', 'Abrir menú de navegación');
            }
        });

        // Opcional: Cerrar menú al hacer clic en un enlace (útil con Swup)
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('nav-active')) {
                    mainNav.classList.remove('nav-active');
                    navToggleBtn.setAttribute('aria-expanded', 'false');
                    // Resetear icono
                    const icon = navToggleBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    navToggleBtn.setAttribute('aria-label', 'Abrir menú de navegación');
                }
            });
        });
    } else {
        console.warn("No se encontró el botón de menú (.nav-toggle) o la navegación principal (#main-nav).");
    }
});