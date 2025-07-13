document.addEventListener('DOMContentLoaded', function() {
    const videoWrapper = document.querySelector('.hero-video-wrapper');
    const video = videoWrapper.querySelector('video');
    const muteOverlay = document.createElement('div');
    const hiddenNavMenu = document.querySelector('.nav-menu.d-none');
    const hiddenMobileBtn = document.querySelector('.mobile-menu-btn.d-none');
    const hiddenSections = document.querySelectorAll('section.d-none');
    const heroCta = document.querySelector('.hero-cta.d-none');
    const referencesSection = document.querySelector('#references');
    const TRANSITION_TIME = 20 * 60 + 14; // 20:14 em segundos
    
    // Adiciona classe para transição suave
    function addTransitionClass() {
        const elementsToTransition = [hiddenNavMenu, hiddenMobileBtn, heroCta, ...hiddenSections, referencesSection];
        elementsToTransition.forEach(element => {
            if (element) {
                element.style.transition = 'opacity 0.5s ease-in-out';
                element.style.opacity = element === referencesSection ? '1' : '0';
            }
        });
    }
    
    // Função para mostrar/esconder seções
    function handleSectionsVisibility(currentTime) {
        if (currentTime >= TRANSITION_TIME) {
            // Mostra elementos do header, sections e hero CTA
            [hiddenNavMenu, hiddenMobileBtn, heroCta, ...hiddenSections].forEach(element => {
                if (element && element !== referencesSection) {
                    element.classList.remove('d-none');
                    // Pequeno delay para permitir que a transição ocorra
                    setTimeout(() => {
                        element.style.opacity = '1';
                    }, 50);
                }
            });
            
            // Esconde seção de referências
            if (referencesSection) {
                referencesSection.style.opacity = '0';
                // Aguarda a transição terminar antes de esconder
                setTimeout(() => {
                    referencesSection.classList.add('d-none');
                }, 500);
            }

            // Dispara evento para iniciar o contador
            const event = new Event('videoTimeReached');
            document.dispatchEvent(event);
        }
    }
    
    // Create custom controls
    const customControls = document.createElement('div');
    customControls.className = 'custom-video-controls';
    customControls.innerHTML = `
        <div class="video-progress">
            <div class="progress-bar">
                <div class="progress-filled"></div>
            </div>
            <div class="time-display">
                <span class="current-time">0:00</span>
                <span class="duration">0:00</span>
            </div>
        </div>
        <div class="video-buttons">
            <button class="play-pause">
                <svg class="play-icon" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                <svg class="pause-icon" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
            </button>
            <div class="volume-control">
            <button class="mute-unmute">
                <svg class="volume-icon" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
            </button>
                <div class="volume-slider">
                    <div class="volume-level"></div>
                </div>
            </div>
        </div>
    `;

    // Create mute overlay with updated style
    muteOverlay.className = 'mute-overlay';
    muteOverlay.innerHTML = `
        <div class="mute-content">
            <svg viewBox="0 0 24 24" class="mute-icon">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
            <span>Click to Unmute</span>
        </div>
    `;

    // Add elements to DOM
    videoWrapper.appendChild(customControls);
    videoWrapper.appendChild(muteOverlay);

    // Variables
    const playPauseBtn = customControls.querySelector('.play-pause');
    const muteUnmuteBtn = customControls.querySelector('.mute-unmute');
    const volumeControl = customControls.querySelector('.volume-control');
    const volumeSlider = volumeControl.querySelector('.volume-slider');
    const volumeLevel = volumeSlider.querySelector('.volume-level');
    const progressBar = customControls.querySelector('.progress-bar');
    const progressFilled = customControls.querySelector('.progress-filled');
    const currentTimeDisplay = customControls.querySelector('.current-time');
    const durationDisplay = customControls.querySelector('.duration');
    let isFirstPlay = true;
    let lastVolume = 1;
    let isPreviewMode = true;

    // Functions
    function startVideo() {
        video.play().then(() => {
            updatePlayButton();
        }).catch(console.error);
    }

    function pauseVideo() {
            video.pause();
        updatePlayButton();
    }

    function togglePlay(e) {
        if (e) e.stopPropagation();
        
        // Only allow play/pause when not in preview mode
        if (!isPreviewMode) {
            if (video.paused) {
                startVideo();
            } else {
                pauseVideo();
            }
        }
    }

    function updatePlayButton() {
        playPauseBtn.classList.toggle('playing', !video.paused);
    }

    function toggleMute(e, showOverlay = false) {
        if (e) e.stopPropagation();
        
        if (video.muted) {
            video.muted = false;
            video.volume = lastVolume;
            if (isPreviewMode) {
                isPreviewMode = false;
                isFirstPlay = false;
                video.currentTime = 0;
                startVideo();
            }
        } else {
            lastVolume = video.volume;
            video.muted = true;
        }
        
        updateVolumeUI();
        muteOverlay.style.display = (video.muted && showOverlay) ? 'flex' : 'none';
    }

    function updateVolumeUI() {
        const volumePercent = video.muted ? 0 : (video.volume * 100);
        volumeLevel.style.width = `${volumePercent}%`;
        
        const volumePath = video.muted || video.volume === 0 
            ? "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
            : "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z";
        
        muteUnmuteBtn.querySelector('.volume-icon').innerHTML = `<path d="${volumePath}"/>`;
    }

    function handleVolumeChange(e) {
        const rect = volumeSlider.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const volumePercent = Math.max(0, Math.min(1, x / rect.width));
        
        video.volume = volumePercent;
        video.muted = volumePercent === 0;
        lastVolume = volumePercent;
        
        updateVolumeUI();
    }

    function updateProgress() {
        const percent = (video.currentTime / video.duration) * 100;
        progressFilled.style.width = `${percent}%`;
        currentTimeDisplay.textContent = formatTime(video.currentTime);
        
        // Handle video end
        if (video.currentTime >= video.duration - 0.1) { // Added small threshold to ensure we catch the end
            if (!isPreviewMode) {
                // Switch back to preview mode
                isPreviewMode = true;
                video.muted = true;
                video.currentTime = 0;
                startVideo();
                
                // Ensure overlay is shown after a small delay to allow state updates
                setTimeout(() => {
                    muteOverlay.style.display = 'flex';
                    muteOverlay.style.opacity = '0';
                    // Fade in the overlay
                    requestAnimationFrame(() => {
                        muteOverlay.style.opacity = '1';
                    });
                }, 50);
            } else {
                // Just loop in preview mode
                video.currentTime = 0;
                startVideo();
            }
        }
    }

    function scrub(e) {
        if (e) e.stopPropagation();
        if (!isPreviewMode) {
        const scrubTime = (e.offsetX / progressBar.offsetWidth) * video.duration;
        video.currentTime = scrubTime;
        }
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Event listeners
    video.addEventListener('loadedmetadata', () => {
        durationDisplay.textContent = formatTime(video.duration);
        // Start video muted for preview
        video.muted = true;
        isPreviewMode = true;
        startVideo();
        updateVolumeUI();
        addTransitionClass(); // Adiciona classes de transição
    });

    video.addEventListener('timeupdate', () => {
        updateProgress();
        handleSectionsVisibility(video.currentTime);
        if (!video.paused && isMouseOverVideo) {
            showControlsTemporarily();
        }
    });
    video.addEventListener('play', updatePlayButton);
    video.addEventListener('pause', updatePlayButton);
    video.addEventListener('volumechange', updateVolumeUI);

    // Touch event handling
    let touchStartX = 0;
    let touchStartY = 0;
    let isScrubbing = false;
    let isMouseOverVideo = false;
    let controlsTimeout;
    let lastMoveTime = 0;
    const MOVE_THRESHOLD = 100; // Minimum time between move events to process

    function showControlsTemporarily() {
        if (!isPreviewMode && isMouseOverVideo) {
            const currentTime = Date.now();
            
            // Only process if enough time has passed since last move
            if (currentTime - lastMoveTime > MOVE_THRESHOLD) {
                lastMoveTime = currentTime;
                videoWrapper.classList.add('controls-visible');
                
                clearTimeout(controlsTimeout);
                if (!video.paused && !isScrubbing) {
                    controlsTimeout = setTimeout(() => {
                        if (!video.paused && !isScrubbing && isMouseOverVideo) {
                            videoWrapper.classList.remove('controls-visible');
                        }
                    }, 3000);
                }
            }
        }
    }

    function hideControls(force = false) {
        if ((!video.paused && !isScrubbing) || force) {
            clearTimeout(controlsTimeout);
            videoWrapper.classList.remove('controls-visible');
        }
    }

    function handleMouseEnter(e) {
        if (e.target === videoWrapper || videoWrapper.contains(e.target)) {
            isMouseOverVideo = true;
            if (!isPreviewMode) {
                showControlsTemporarily();
            }
        }
    }

    function handleMouseLeave(e) {
        if (e.target === videoWrapper || !videoWrapper.contains(e.relatedTarget)) {
            isMouseOverVideo = false;
            hideControls(true);
        }
    }

    function handleMouseMove(e) {
        if (!isPreviewMode && 
            !e.target.closest('.custom-video-controls') && 
            (e.target === videoWrapper || videoWrapper.contains(e.target))) {
            showControlsTemporarily();
        }
    }

    function handleTouchStart(e) {
        if (e.target.closest('.custom-video-controls')) {
            // Handle controls touch events
            if (e.target.closest('.progress-bar')) {
                isScrubbing = true;
                handleTouchMove(e);
            }
        } else {
            // Store touch start position for potential video click
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            if (!isPreviewMode) {
                showControlsTemporarily();
            }
        }
    }

    function handleTouchMove(e) {
        if (isScrubbing && !isPreviewMode) {
            e.preventDefault();
            const progressRect = progressBar.getBoundingClientRect();
            const touchX = e.touches[0].clientX - progressRect.left;
            const scrubTime = Math.max(0, Math.min(1, touchX / progressRect.width)) * video.duration;
            video.currentTime = scrubTime;
        }
    }

    function handleTouchEnd(e) {
        if (!isScrubbing) {
            // Calculate touch movement
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = Math.abs(touchEndX - touchStartX);
            const deltaY = Math.abs(touchEndY - touchStartY);

            // If it's a tap (minimal movement) and not on controls
            if (deltaX < 10 && deltaY < 10 && !e.target.closest('.custom-video-controls')) {
                if (isPreviewMode) {
                    toggleMute(e, false);
                } else {
                    togglePlay(e);
                }
            }
        }
        isScrubbing = false;
    }

    // Add touch event listeners
    videoWrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
    videoWrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
    videoWrapper.addEventListener('touchend', handleTouchEnd);

    // Mouse event listeners with proper event delegation
    videoWrapper.addEventListener('mouseenter', handleMouseEnter);
    videoWrapper.addEventListener('mouseleave', handleMouseLeave);
    videoWrapper.addEventListener('mousemove', handleMouseMove);

    // Show controls when video is paused
    video.addEventListener('pause', () => {
        if (!isPreviewMode) {
            clearTimeout(controlsTimeout);
            videoWrapper.classList.add('controls-visible');
        }
    });

    // Hide controls when video starts playing
    video.addEventListener('play', () => {
        if (!isPreviewMode && isMouseOverVideo) {
            showControlsTemporarily();
        } else {
            hideControls(true);
        }
    });

    // Show controls on timeupdate
    video.addEventListener('timeupdate', () => {
        if (!video.paused && isMouseOverVideo) {
            showControlsTemporarily();
        }
    });

    playPauseBtn.addEventListener('click', togglePlay);
    muteUnmuteBtn.addEventListener('click', (e) => toggleMute(e, false));
    muteOverlay.addEventListener('click', (e) => toggleMute(e, false));

    // Volume control
    let isAdjustingVolume = false;
    volumeSlider.addEventListener('mousedown', (e) => {
        isAdjustingVolume = true;
        handleVolumeChange(e);
    });
    volumeSlider.addEventListener('mousemove', (e) => {
        if (isAdjustingVolume) handleVolumeChange(e);
    });
    document.addEventListener('mouseup', () => {
        isAdjustingVolume = false;
    });
    volumeSlider.addEventListener('click', handleVolumeChange);

    // Progress bar
    let mousedown = false;
    progressBar.addEventListener('click', scrub);
    progressBar.addEventListener('mousemove', (e) => mousedown && scrub(e));
    progressBar.addEventListener('mousedown', () => mousedown = true);
    progressBar.addEventListener('mouseup', () => mousedown = false);

    // Initial state setup
    video.muted = true;
    isPreviewMode = true;
    muteOverlay.style.display = 'flex';
    updateVolumeUI();
});