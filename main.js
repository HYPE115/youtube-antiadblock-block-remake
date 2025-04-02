
// i cannot guarantee that this will work forever, although, if youtube starts embedding ads into the player, there's a chance
// (and i mean a really small chance) that this will still technically work, would have to update a few things
// since i dont think youtube can put ads in embeds
// they can however completely disable embeds, but if that happens then like every website ever would break so
// YouTube Adblock Bypass with Modern UI + Cinema Mode
// Forked from original code with enhanced interface

document.addEventListener('yt-navigate-start', function() {
    setTimeout(function() {
        const oldPlayer = document.getElementById("YOUTUBEADBLOCKBLOCKPLAYER");
        if(oldPlayer) {
            oldPlayer.remove();
            console.log("[ModernUI] Removed old player during navigation");
        }
    }, 200);
});

document.addEventListener('yt-page-data-updated', function() {
    const player = document.getElementById("YOUTUBEADBLOCKBLOCKPLAYER");
    if(player) {
        player.remove();
        console.log("[ModernUI] Player removed during page update");
    }
});

function createModernPlayerContainer() {
    const container = document.createElement("div");
    container.id = "MODERN-YT-CONTAINER";
    container.style.position = "relative";
    container.style.width = "100%";
    container.style.maxWidth = "1200px";
    container.style.margin = "0 auto";
    container.style.borderRadius = "12px";
    container.style.overflow = "hidden";
    container.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
    container.style.transition = "all 0.3s ease-in-out";

    return container;
}

function createModernPlayerFrame(videoUrl) {
    const iframe = document.createElement("iframe");
    iframe.id = "YOUTUBEADBLOCKBLOCKPLAYER";
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute("allow", "autoplay; encrypted-media");
    iframe.style.width = "100%";
    iframe.style.height = "calc(56.25vw)";
    iframe.style.maxHeight = "675px";
    iframe.style.border = "none";
    iframe.style.borderRadius = "12px";

    iframe.src = videoUrl;
    return iframe;
}

function createCinemaModeButton() {
    const button = document.createElement("button");
    button.id = "cinema-mode-button";
    button.innerText = "⛶";
    button.style.position = "absolute";
    button.style.bottom = "10px";
    button.style.right = "10px";
    button.style.background = "rgba(0, 0, 0, 0.7)";
    button.style.color = "white";
    button.style.border = "none";
    button.style.padding = "10px";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.fontSize = "16px";

    button.addEventListener("click", function() {
        const container = document.getElementById("MODERN-YT-CONTAINER");
        if (container.classList.contains("cinema-mode")) {
            container.classList.remove("cinema-mode");
            container.style.maxWidth = "1200px";
            container.style.width = "100%";
            container.style.position = "relative";
            container.style.height = "auto";
            document.body.style.overflow = "auto";
            button.innerText = "⛶"; // Retour à l'icône mode cinéma
        } else {
            container.classList.add("cinema-mode");
            container.style.maxWidth = "100vw";
            container.style.width = "100vw";
            container.style.height = "90vh";
            container.style.position = "fixed";
            container.style.top = "5vh";
            container.style.left = "0";
            container.style.zIndex = "1000";
            document.body.style.overflow = "hidden";
            button.innerText = "❌"; // Icône pour quitter le mode cinéma
        }
    });
    return button;
}

function createModernUI(videoUrl, parentElement) {
    console.log("[ModernUI] Creating modern YouTube interface");

    const container = createModernPlayerContainer();
    const player = createModernPlayerFrame(videoUrl);
    const cinemaButton = createCinemaModeButton();

    container.appendChild(player);
    container.appendChild(cinemaButton);
    parentElement[0].appendChild(container);

    window.addEventListener('resize', function() {
        player.style.height = `${container.offsetWidth * 0.5625}px`;
    });
}

document.addEventListener('yt-navigate-finish', function() {
    const videoId = new URLSearchParams(window.location.search).get('v');
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

    setTimeout(function() {
        if(!document.getElementById("YOUTUBEADBLOCKBLOCKPLAYER")) {
            const adblockParent = document.querySelectorAll("ytd-enforcement-message-view-model.style-scope.yt-playability-error-supported-renderers");

            if(adblockParent.length > 0) {
                const adblockMessage = document.querySelector("div.style-scope.ytd-enforcement-message-view-model");
                if(adblockMessage) adblockMessage.remove();
                createModernUI(embedUrl, adblockParent);
                console.log("[ModernUI] Modern player initialized successfully");
            } else {
                console.log("[ModernUI] No adblock message detected");
            }
        }
    }, 100);
});

// Add dark mode support
function checkDarkMode() {
    const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if(darkMode) {
        document.documentElement.style.setProperty('--yt-spec-base-background', '#0f0f0f');
    } else {
        document.documentElement.style.setProperty('--yt-spec-base-background', '#f9f9f9');
    }
}

// Initialize dark mode check
checkDarkMode();
window.matchMedia('(prefers-color-scheme: dark)').addListener(checkDarkMode);
