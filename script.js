// Wedding Invitation Scripts

// --- CONFIGURATION ---
// You can replace this with any YouTube Video ID you like (e.g. Instrumental covers of romantic songs)
// 'yS78eH9vSRE' is a popular piano instrumental of romantic themes
const YOUTUBE_VIDEO_ID = 'HpyfxFYVZwk'; 
const WEDDING_DATE = new Date("Oct 17, 2026 08:00:00").getTime();

// --- STATE MANAGEMENT ---
let ytPlayer = null;
let isMusicPlaying = false;
let isMuted = false;

// --- DOM ELEMENTS ---
const coverScreen = document.getElementById('cover-screen');
const mainContent = document.getElementById('main-content');
const btnOpenInvitation = document.getElementById('btn-open-invitation');
const guestCard = document.getElementById('guest-card');
const guestNameElem = document.getElementById('guest-name');
const musicControlWidget = document.getElementById('music-control');
const btnMusicToggle = document.getElementById('btn-music-toggle');
const musicIcon = document.getElementById('music-icon');
const btnMusicVolume = document.getElementById('btn-music-volume');
const volumeIcon = document.getElementById('volume-icon');
const scrollProgress = document.getElementById('scroll-progress');

// --- 1. GUEST NAME INDIVIDUALIZATION (URL ?to=Nama+Tamu) ---
function loadGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    let guestName = urlParams.get('to') || urlParams.get('p') || urlParams.get('u');
    
    if (guestName) {
        // Clean and format name
        guestName = decodeURIComponent(guestName.replace(/\+/g, ' '));
        // Capitalize words
        guestName = guestName.replace(/\b\w/g, c => c.toUpperCase());
        guestNameElem.textContent = guestName;
    }
    
    // Animate the guest card appearance
    setTimeout(() => {
        if (guestCard) {
            guestCard.classList.remove('scale-95', 'opacity-0');
            guestCard.classList.add('scale-100', 'opacity-100');
        }
    }, 400);
}

// --- 2. YOUTUBE IFRAME PLAYER AUDIO INTEGRATION ---
// This function is called automatically by the YouTube Player API script when ready
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('youtube-audio-player', {
        height: '0',
        width: '0',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'loop': 1,
            'playlist': YOUTUBE_VIDEO_ID, // Required for looping in iframe
            'disablekb': 1,
            'fs': 0,
            'modestbranding': 1,
            'rel': 0,
            'showinfo': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    // Set initial volume to a pleasant background level
    event.target.setVolume(50);
}

function onPlayerStateChange(event) {
    // Sync UI icons with actual YouTube player states
    if (event.data === YT.PlayerState.PLAYING) {
        isMusicPlaying = true;
        musicIcon.classList.add('animate-spin-slow');
        musicIcon.classList.remove('fa-pause');
        musicIcon.classList.add('fa-compact-disc');
    } else {
        isMusicPlaying = false;
        musicIcon.classList.remove('animate-spin-slow');
        musicIcon.classList.remove('fa-compact-disc');
        musicIcon.classList.add('fa-pause');
    }
}

// Play background music
function startBackgroundMusic() {
    if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
        ytPlayer.playVideo();
        isMusicPlaying = true;
    }
}

// Toggle Play/Pause
function toggleMusic() {
    if (!ytPlayer || typeof ytPlayer.playVideo !== 'function') return;

    if (isMusicPlaying) {
        ytPlayer.pauseVideo();
        isMusicPlaying = false;
        musicIcon.classList.remove('animate-spin-slow');
        musicIcon.classList.remove('fa-compact-disc');
        musicIcon.classList.add('fa-pause');
    } else {
        ytPlayer.playVideo();
        isMusicPlaying = true;
        musicIcon.classList.add('animate-spin-slow');
        musicIcon.classList.remove('fa-pause');
        musicIcon.classList.add('fa-compact-disc');
    }
}

// Toggle Mute/Unmute
function toggleVolume() {
    if (!ytPlayer || typeof ytPlayer.mute !== 'function') return;

    if (isMuted) {
        ytPlayer.unMute();
        isMuted = false;
        volumeIcon.className = 'fas fa-volume-up text-sm';
    } else {
        ytPlayer.mute();
        isMuted = true;
        volumeIcon.className = 'fas fa-volume-mute text-sm text-red-500';
    }
}

// --- 3. OPEN INVITATION FLOW ---
function openInvitation() {
    // Start music
    startBackgroundMusic();
    
    // Animate cover screen sliding out
    coverScreen.classList.add('fade-out-up');
    
    // Unlock body scrolling
    document.body.classList.remove('overflow-hidden');
    document.body.classList.add('overflow-y-auto');
    
    // Reveal main content
    mainContent.classList.remove('hidden');
    setTimeout(() => {
        mainContent.classList.remove('opacity-0');
        mainContent.classList.add('opacity-100');
        
        // Show floating controls with a beautiful delay
        musicControlWidget.classList.remove('hidden');
        
        // Initialize AOS (Animate on Scroll)
        AOS.init({
            duration: 1000,
            once: true,
            mirror: false,
            anchorPlacement: 'top-bottom'
        });
    }, 100);

    // Completely remove cover screen DOM after animation ends to optimize performance
    setTimeout(() => {
        coverScreen.style.display = 'none';
    }, 1100);
}

// --- 4. COUNTDOWN TIMER ---
function startCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateTime() {
        const now = new Date().getTime();
        const distance = WEDDING_DATE - now;

        if (distance < 0) {
            // If date is passed
            if (daysEl) daysEl.innerText = "00";
            if (hoursEl) hoursEl.innerText = "00";
            if (minutesEl) minutesEl.innerText = "00";
            if (secondsEl) secondsEl.innerText = "00";
            clearInterval(timerInterval);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (daysEl) daysEl.innerText = days < 10 ? '0' + days : days;
        if (hoursEl) hoursEl.innerText = hours < 10 ? '0' + hours : hours;
        if (minutesEl) minutesEl.innerText = minutes < 10 ? '0' + minutes : minutes;
        if (secondsEl) secondsEl.innerText = seconds < 10 ? '0' + seconds : seconds;
    }

    updateTime(); // Run once immediately
    const timerInterval = setInterval(updateTime, 1000);
}

// --- 5. RSVP INTERACTIVE FORM ---
const rsvpForm = document.getElementById('rsvp-form');
const rsvpSuccess = document.getElementById('rsvp-success');
const rsvpAttendance = document.getElementById('rsvp-attendance');
const rsvpGuestsContainer = document.getElementById('rsvp-guests-container');

if (rsvpAttendance) {
    rsvpAttendance.addEventListener('change', function() {
        if (this.value === 'Hadir') {
            rsvpGuestsContainer.classList.remove('hidden');
        } else {
            rsvpGuestsContainer.classList.add('hidden');
        }
    });
}

if (rsvpForm) {
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('rsvp-name').value;
        const attendance = document.getElementById('rsvp-attendance').value;
        const guests = attendance === 'Hadir' ? document.getElementById('rsvp-guests').value : '0';
        const message = document.getElementById('rsvp-message').value;

        // Simulate API call and save to local logs
        const rsvpData = { name, attendance, guests, message, date: new Date().toISOString() };
        localStorage.setItem('wedding_rsvp_' + name.replace(/\s+/g, '_').toLowerCase(), JSON.stringify(rsvpData));

        // If guest is attending, automatically add a wish for them in the guestbook!
        if (message.trim()) {
            addWish(name, attendance === 'Hadir' ? 'Sahabat' : 'Kerabat', message);
        }

        // Hide form and show success with animation
        rsvpForm.classList.add('hidden');
        rsvpSuccess.classList.remove('hidden');
        rsvpSuccess.classList.add('animate-fade-in');
    });
}

// --- 6. GUESTBOOK / WISHES SYSTEM (LOCALSTORAGE PERSISTED) ---
const wishForm = document.getElementById('wish-form');
const wishesList = document.getElementById('wishes-list');
const wishCountEl = document.getElementById('wish-count');

// Default initial wishes so it looks vibrant and warm
const DEFAULT_WISHES = [
    {
        name: "Ahmad & Family",
        relation: "Keluarga",
        text: "Selamat menempuh hidup baru Rian dan Sonia! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Bahagia selamanya dunia akhirat. Aamiin.",
        time: "1 jam yang lalu"
    },
    {
        name: "Devina Anastasia",
        relation: "Sahabat",
        text: "Soniaaa! Aku terharu banget akhirnya kalian sampai di titik ini. Happy Wedding for both of you, can't wait to see you on the big day! 😍💍",
        time: "3 jam yang lalu"
    },
    {
        name: "Bambang Wijaya",
        relation: "Teman Kerja",
        text: "Selamat ya Rian! Semoga sukses acara pernikahannya dan lancar semua prosesi sampai hari-H. Selamat berlayar mengarungi bahtera rumah tangga baru bro!",
        time: "Kemarin"
    }
];

function getWishes() {
    const saved = localStorage.getItem('wedding_wishes');
    return saved ? JSON.parse(saved) : DEFAULT_WISHES;
}

function renderWishes() {
    const wishes = getWishes();
    if (!wishesList) return;
    
    if (wishCountEl) {
        wishCountEl.innerText = `${wishes.length} Ucapan`;
    }

    if (wishes.length === 0) {
        wishesList.innerHTML = `
            <div class="text-center py-8 text-wedding-charcoal/40 italic text-sm">
                Belum ada ucapan. Jadilah yang pertama memberikan doa restu!
            </div>
        `;
        return;
    }

    wishesList.innerHTML = wishes.map(wish => {
        // Relation badge color selection
        let badgeColorClass = "bg-wedding-gold/10 text-wedding-gold";
        if (wish.relation === 'Keluarga') badgeColorClass = "bg-wedding-navy/10 text-wedding-navy";
        else if (wish.relation === 'Sahabat') badgeColorClass = "bg-red-500/10 text-red-600";
        else if (wish.relation === 'Teman Kerja') badgeColorClass = "bg-green-600/10 text-green-700";

        return `
            <div class="bg-white rounded-xl p-4 border border-wedding-goldLight/20 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md animate-fade-in">
                <div class="flex items-center justify-between gap-2 mb-2">
                    <h4 class="font-serif font-bold text-wedding-navy text-sm md:text-base">${escapeHTML(wish.name)}</h4>
                    <span class="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${badgeColorClass}">
                        ${wish.relation}
                    </span>
                </div>
                <p class="text-xs md:text-sm text-wedding-charcoal/80 leading-relaxed mb-1.5 whitespace-pre-wrap">${escapeHTML(wish.text)}</p>
                <div class="text-[9px] text-wedding-charcoal/40 text-right">
                    <i class="fa-regular fa-clock mr-1 text-[8px]"></i>${wish.time || 'Baru saja'}
                </div>
            </div>
        `;
    }).join('');
}

function addWish(name, relation, text) {
    const wishes = getWishes();
    const newWish = {
        name,
        relation,
        text,
        time: 'Baru saja'
    };
    wishes.unshift(newWish); // Prepend to top
    localStorage.setItem('wedding_wishes', JSON.stringify(wishes));
    renderWishes();
}

if (wishForm) {
    wishForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const nameInput = document.getElementById('wish-name');
        const relationInput = document.getElementById('wish-relation');
        const textInput = document.getElementById('wish-text');

        if (nameInput.value.trim() && relationInput.value && textInput.value.trim()) {
            addWish(nameInput.value.trim(), relationInput.value, textInput.value.trim());
            
            // Clear inputs
            nameInput.value = '';
            relationInput.selectedIndex = 0;
            textInput.value = '';
        }
    });
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// --- 7. UTILS: COPY TO CLIPBOARD & TOAST ---
function copyToClipboard(elementId) {
    const textToCopy = document.getElementById(elementId).innerText;
    
    // Fallback if navigator.clipboard is blocked or not available
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(showToast).catch(err => {
            console.error('Failed to copy text: ', err);
            fallbackCopy(textToCopy);
        });
    } else {
        fallbackCopy(textToCopy);
    }
}

function fallbackCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showToast();
    } catch (err) {
        console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
}

function showToast() {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.classList.remove('opacity-0', 'pointer-events-none');
    toast.classList.add('opacity-100');
    
    setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0', 'pointer-events-none');
    }, 2500);
}

// --- 8. PAGE SCROLL INDICATOR ---
function handleScroll() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (scrollProgress) {
        scrollProgress.style.width = scrolled + "%";
    }
}

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    loadGuestName();
    startCountdown();
    renderWishes();
    
    // Set up listeners
    if (btnOpenInvitation) {
        btnOpenInvitation.addEventListener('click', openInvitation);
    }
    if (btnMusicToggle) {
        btnMusicToggle.addEventListener('click', toggleMusic);
    }
    if (btnMusicVolume) {
        btnMusicVolume.addEventListener('click', toggleVolume);
    }
    
    window.addEventListener('scroll', handleScroll);
});
