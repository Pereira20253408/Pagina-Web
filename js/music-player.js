// js/music-player.js

// --- VARIABLES GLOBALES ---
let plyrInstance = null;
let songItemListeners = []; // Guarda { item: liElement, handler: function }

// --- FUNCIONES AYUDANTES INTERNAS ---
function updateVisualPlayerInfo(title, artworkSrc) {
    const currentTitleElement = document.getElementById('current-song-title');
    const currentArtworkElement = document.getElementById('current-song-artwork');
    const defaultArtwork = 'images/skin/ckc.webp';

    if (currentTitleElement) {
        currentTitleElement.textContent = title || 'Elige una canción';
    }
    if (currentArtworkElement) {
        currentArtworkElement.src = artworkSrc || defaultArtwork;
        currentArtworkElement.alt = title ? `Carátula de ${title}` : 'Carátula por defecto';
    } else {
        console.warn('[UpdateInfo] Elemento #current-song-artwork no encontrado.');
    }
}

function updateVisualButtonIcons(playingLi) {
    const songListItems = document.querySelectorAll('.song-list-item'); // Volver a seleccionar por si cambió el DOM

    songListItems.forEach(item => {
        const button = item.querySelector('.play-pause-button');
        const icon = button ? button.querySelector('i') : null;
        if (icon) {
            // Sólo muestra pausa si Plyr existe, está sonando Y es el LI correcto
            if (plyrInstance && plyrInstance.playing && item === playingLi) {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
                item.classList.add('playing');
            } else {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
                item.classList.remove('playing');
            }
        }
    });
}

// --- FUNCIÓN GLOBAL DE INICIALIZACIÓN ---
window.initMusicPlayer = function() {
    console.log('[Init] Ejecutando initMusicPlayer...');

    // 1. Limpieza previa robusta
    if (plyrInstance) {
        console.warn('[Init] Instancia Plyr PREEXISTENTE encontrada. Destruyendo...');
        window.destroyMusicPlayer(); // Llama a la función global de destrucción
    } else {
        // Si no hay instancia Plyr, igual limpiamos listeners por si acaso quedaron huérfanos
        console.log('[Init] No hay instancia Plyr, pero limpiando listeners por si acaso...');
        songItemListeners.forEach(({ item, handler }) => {
            item.removeEventListener('click', handler);
        });
        songItemListeners = [];
    }


    // 2. Selección de Elementos (Ocurre *dentro* de init cada vez)
    const playerElement = document.getElementById('main-audio-player');
    const songListItems = document.querySelectorAll('.song-list-item');

    // Validar si estamos en la página correcta / elementos existen
    if (!playerElement || songListItems.length === 0) {
        console.log('[Init] Elementos necesarios (#main-audio-player o .song-list-item) no encontrados en esta página. Saliendo de init.');
        return; // No continuar si no estamos en la página de música
    }
    console.log(`[Init] Encontrados ${songListItems.length} items de canción.`);

    // 3. Estado (Local a esta ejecución de init)
    let currentPlayingLi = null;
    let currentAudioSrc = null;

    // 4. Inicialización de Plyr
    console.log('[Init] Inicializando nueva instancia Plyr...');
    try {
        // Asignamos a la variable GLOBAL
        plyrInstance = new Plyr(playerElement, {
            controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume'],
        });
        console.log('[Init] Nueva instancia Plyr CREADA.');

        // 5. Definición de Handlers de Eventos Plyr (Locales)
        const onPlay = () => {
            console.log('[Plyr Event] Play');
            updateVisualButtonIcons(currentPlayingLi); // Usa el LI activo guardado
        };
        const onPause = () => {
            console.log('[Plyr Event] Pause');
            updateVisualButtonIcons(null); // Ninguno debe mostrar pausa
            if (currentPlayingLi) currentPlayingLi.classList.remove('playing');
        };
        const onEnded = () => {
            console.log('[Plyr Event] Ended');
            updateVisualButtonIcons(null); // Ninguno muestra pausa
            if (currentPlayingLi) currentPlayingLi.classList.remove('playing');
            currentPlayingLi = null; // Resetea estado
            currentAudioSrc = null;
            updateVisualPlayerInfo(null, null); // Resetea visuales del player principal
        };

        // 6. Añadir Listeners a la instancia Plyr GLOBAL
        plyrInstance.on('play', onPlay);
        plyrInstance.on('pause', onPause);
        plyrInstance.on('ended', onEnded);
        console.log('[Init] Listeners de eventos Plyr añadidos a la nueva instancia.');

        // 7. Definición del Handler de Clic en Lista (Local)
        const handleSongItemClick = (event) => {
            const clickedLi = event.currentTarget;
            const audioSrc = clickedLi.dataset.src;
            const songTitle = clickedLi.dataset.title;
            const artworkSrc = clickedLi.dataset.artwork;

            console.log(`[Click] Clic en: ${songTitle}`);

            if (!audioSrc || !plyrInstance) {
                console.warn('[Click] No hay audioSrc o instancia Plyr.');
                return;
            }

            // Comprueba si es la misma canción
            if (audioSrc === currentAudioSrc) {
                console.log('[Click] Misma canción, alternando play/pause.');
                plyrInstance.togglePlay(); // Plyr maneja el estado interno
            } else {
                // Canción nueva
                console.log(`[Click] Nueva canción. Cargando: ${audioSrc}`);
                currentAudioSrc = audioSrc; // Actualiza src local
                currentPlayingLi = clickedLi; // Actualiza LI local activo

                // Carga la nueva fuente en Plyr
                plyrInstance.source = {
                    type: 'audio',
                    title: songTitle || 'Canción Desconocida',
                    sources: [{ src: audioSrc, type: 'audio/mp3' }], // Asume MP3
                };
                updateVisualPlayerInfo(songTitle, artworkSrc); // Actualiza visuales principales

                // Actualiza TODOS los iconos de botones AHORA
                updateVisualButtonIcons(currentPlayingLi);

                // Intenta reproducir
                plyrInstance.play().catch(e => console.warn("Play failed:", e));
            }
        };

        // 8. Añadir Listeners a los Items de la Lista (y guardar refs)
        songListItems.forEach(item => {
            item.addEventListener('click', handleSongItemClick);
            songItemListeners.push({ item: item, handler: handleSongItemClick });
        });
        console.log(`[Init] Listeners añadidos a ${songItemListeners.length} items.`);

        // 9. Estado Visual Inicial del Reproductor Principal
        updateVisualPlayerInfo(null, null); // Artwork/Título por defecto
        updateVisualButtonIcons(null); // Todos los botones en estado 'play'

        console.log('[Init] Reproductor de música inicializado COMPLETAMENTE.');

    } catch (e) {
        console.error("[Init] Error crítico inicializando Plyr:", e);
        plyrInstance = null; // Asegurar que sea null si falla
    }
}; // --- FIN DE window.initMusicPlayer ---


// --- FUNCIÓN GLOBAL DE DESTRUCCIÓN ---
window.destroyMusicPlayer = function() {
    console.log('[Destroy] Ejecutando destroyMusicPlayer...');

    // 1. Quitar listeners de los items de la lista usando las referencias guardadas
    console.log(`[Destroy] Intentando quitar ${songItemListeners.length} listeners de la lista...`);
    songItemListeners.forEach(({ item, handler }) => {
        // Comprobación extra por si el item ya no existe
        if (item && typeof item.removeEventListener === 'function') {
            item.removeEventListener('click', handler);
        }
    });
    songItemListeners = []; // Limpiar el array global
    console.log('[Destroy] Listeners de la lista eliminados.');

    // 2. Destruir la instancia de Plyr
    if (plyrInstance) {
        console.log('[Destroy] Intentando destruir instancia Plyr...');
        try {
            plyrInstance.destroy(); // Método de limpieza de Plyr
            console.log('[Destroy] Instancia Plyr destruida.');
        } catch (e) {
            console.error("[Destroy] Error destruyendo Plyr:", e);
        } finally {
             plyrInstance = null; // Asegura que la referencia global sea null
        }
    } else {
        console.log('[Destroy] No había instancia Plyr que destruir.');
    }

    // 3. Resetear visuales (opcional pero bueno)
    console.log('[Destroy] Reseteando visuales...');
    updateVisualPlayerInfo(null, null);
    updateVisualButtonIcons(null); // Asegura que todos los botones estén en estado 'play'

    console.log('[Destroy] Destrucción completada.');

};