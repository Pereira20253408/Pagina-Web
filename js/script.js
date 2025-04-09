// Inicializa Swup
const swup = new Swup({
    containers: ["#swup"], // Le dice a Swup que busque y reemplace el contenido
    plugins: [
        new SwupBodyClassPlugin()
    ]
});
 
    swup.hooks.on('visit:start', (visit) => {
    if (document.body.classList.contains('musica')) {
        console.log('Swup: Saliendo de la página de música, limpiando reproductor...');
        window.destroyMusicPlayer();   
    }
});

    // 2. DESPUÉS de que el nuevo contenido sea añadido (inicializar)
swup.hooks.on('content:replace', (visit) => {
    console.log('Swup: Contenido reemplazado.');
    requestAnimationFrame(() => {
        if (document.body.classList.contains('musica')) {
            console.log('Swup: Entrando a la página de música, inicializando reproductor...');
            window.initMusicPlayer();
        }

    });
});


// 3. DESPUÉS de que la vista sea renderizada (para nav activo)
swup.hooks.on('page:view', (visit) => {
    console.log('Swup: Vista de página cargada.');
    
    if (typeof window.updateActiveNavLink === 'function') {
        window.updateActiveNavLink();
    } else {
        console.warn('updateActiveNavLink no disponible globalmente.');
    }
    window.scrollTo(0, 0);
});

document.addEventListener('DOMContentLoaded', () => {
     console.log('DOM Cargado Inicialmente');
        if (typeof window.initMenu === 'function') window.initMenu();

    if (document.body.classList.contains('musica')) {
        window.initMusicPlayer();
    }


    if (typeof window.updateActiveNavLink === 'function') {
    window.updateActiveNavLink();
    } else {
        console.warn('updateActiveNavLink no disponible globalmente en DOMContentLoaded.');
    }
});
