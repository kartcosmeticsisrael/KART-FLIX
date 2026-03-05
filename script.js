document.addEventListener('DOMContentLoaded', () => {

    // --- State & DOM Elements ---
    const categoriesContainer = document.getElementById('categoriesContainer');
    const videoModal = document.getElementById('videoModal');
    const videoIframe = document.getElementById('videoIframe');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const closeModalBtn = document.getElementById('closeModal');
    const heroPlayBtn = document.getElementById('heroPlayBtn');

    // --- Config Fetching ---
    let allCategories = KARTFLIX_DATA.categories;

    // --- Language Switcher Logic ---
    const langSelect = document.getElementById('langSelect');
    const heroTitle = document.querySelector('.hero-title');
    const heroDesc = document.querySelector('.hero-desc');
    const heroBadge = document.querySelector('.badge');

    function applyLanguage(lang) {
        // 1. Text translations
        if (lang === 'ru') {
            document.documentElement.lang = 'ru';
            document.documentElement.dir = 'ltr'; // Set ltr for Russian
            heroBadge.textContent = 'Рекомендуемое обучение';
            heroTitle.innerHTML = 'Новое поколение<br><span class="text-lime">Омолаживающих процедур</span>';
            heroDesc.textContent = 'Изучите новейшие протоколы 2026 года с лучшими экспертами KART. Смотрите практические демонстрации и открывайте прорывные техники.';
            document.querySelector('.nav-links a[href="#hero"]').textContent = 'Главная';
            document.querySelector('.nav-links a[href="#library"]').textContent = 'Библиотека Лечения';
            document.querySelector('.nav-links a[href="#marketing"]').textContent = 'База Контента';
            document.querySelector('#heroPlayBtn').innerHTML = '<i class="fas fa-play"></i> Смотреть сейчас';
            document.querySelector('.btn-secondary').innerHTML = '<i class="fas fa-info-circle"></i> Подробнее';
        } else {
            document.documentElement.lang = 'he';
            document.documentElement.dir = 'rtl'; // Revert back to rtl for hebrew
            heroBadge.textContent = 'הדרכה מומלצת';
            heroTitle.innerHTML = `הדור הבא של<br><span class="text-lime">טיפולי האנטי-אייג'ינג</span >`;
            heroDesc.textContent = 'למדי את הפרוטוקולים החדשניים ביותר של 2026 עם מיטב המומחים של KART. צפי בהדגמות מעשיות וגלי טכניקות פורצות דרך.';
            document.querySelector('.nav-links a[href="#hero"]').textContent = 'ראשי';
            document.querySelector('.nav-links a[href="#library"]').textContent = 'ספריית טיפולים';
            document.querySelector('.nav-links a[href="#marketing"]').textContent = 'מאגר תוכן לפרסום';
            document.querySelector('#heroPlayBtn').innerHTML = '<i class="fas fa-play"></i> צפייה עכשיו';
            document.querySelector('.btn-secondary').innerHTML = '<i class="fas fa-info-circle"></i> מידע נוסף';
        }

        // 2. Filter Categories by Language
        let filteredCategories;
        if (lang === 'ru') {
            // Show Russian Pedicure and Cosmetics
            filteredCategories = allCategories.filter(cat => cat.id === 'pedicure-ru' || cat.id === 'cosmetics');

            // Translate the "Cosmetics" title to Russian for display
            filteredCategories = filteredCategories.map(cat => {
                if (cat.id === 'cosmetics') {
                    return { ...cat, title: 'Косметология' };
                }
                return cat;
            });
        } else {
            // Show Hebrew Pedicure and Cosmetics
            filteredCategories = allCategories.filter(cat => cat.id === 'pedicure-he' || cat.id === 'cosmetics');

            // Ensure Hebrew title
            filteredCategories = filteredCategories.map(cat => {
                if (cat.id === 'cosmetics') {
                    return { ...cat, title: 'קוסמטיקה' };
                }
                return cat;
            });
        }

        renderLibrary(filteredCategories);
    }

    // --- Search Logic ---
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        applyLanguage(langSelect.value, query);
    });

    // Modified applyLanguage signature up top, or easier to just apply search here
    // Let's modify the function to accept optional query parameter
    // Let's refactor applyLanguage minimally:
    const originalApplyLanguage = applyLanguage;
    applyLanguage = function (lang, query = searchInput.value.toLowerCase().trim()) {
        originalApplyLanguage(lang); // This parses Russian/Hebrew and updates text

        let filteredCategories;
        if (lang === 'ru') {
            filteredCategories = allCategories.filter(cat => cat.id === 'pedicure-ru' || cat.id === 'cosmetics');
            filteredCategories = filteredCategories.map(cat => ({ ...cat, title: cat.id === 'cosmetics' ? 'Косметология' : cat.title }));
        } else {
            filteredCategories = allCategories.filter(cat => cat.id === 'pedicure-he' || cat.id === 'cosmetics');
            filteredCategories = filteredCategories.map(cat => ({ ...cat, title: cat.id === 'cosmetics' ? 'קוסמטיקה' : cat.title }));
        }

        if (query) {
            filteredCategories = filteredCategories.map(cat => {
                const filteredVideos = cat.videos.filter(v =>
                    v.title.toLowerCase().includes(query) ||
                    v.description.toLowerCase().includes(query)
                );
                return { ...cat, videos: filteredVideos };
            }).filter(cat => cat.videos.length > 0);
        }

        renderLibrary(filteredCategories);
    };

    // Listen for language change
    langSelect.addEventListener('change', (e) => {
        applyLanguage(e.target.value);
    });

    // Initial load
    applyLanguage(langSelect.value);

    // --- Render Library ---
    function renderLibrary(categories) {
        categoriesContainer.innerHTML = ''; // clear

        categories.forEach(category => {
            // Create Category Row
            const row = document.createElement('div');
            row.className = 'category-row';

            // Title
            const title = document.createElement('h2');
            title.className = 'category-title';
            title.textContent = category.title;
            row.appendChild(title);

            // Carousel Container
            const carouselContainer = document.createElement('div');
            carouselContainer.className = 'carousel-container';
            carouselContainer.style.position = 'relative';

            // Left Arrow
            const leftBtn = document.createElement('button');
            leftBtn.className = 'carousel-arrow left-arrow glass-effect';
            leftBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            leftBtn.style.position = 'absolute';
            leftBtn.style.left = '10px';
            leftBtn.style.top = '50%';
            leftBtn.style.transform = 'translateY(-50%)';
            leftBtn.style.zIndex = '10';
            leftBtn.style.cursor = 'pointer';
            leftBtn.style.border = 'none';
            leftBtn.style.borderRadius = '50%';
            leftBtn.style.width = '40px';
            leftBtn.style.height = '40px';
            leftBtn.style.display = 'flex';
            leftBtn.style.alignItems = 'center';
            leftBtn.style.justifyContent = 'center';
            leftBtn.style.color = 'white';

            // Right Arrow
            const rightBtn = document.createElement('button');
            rightBtn.className = 'carousel-arrow right-arrow glass-effect';
            rightBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            rightBtn.style.position = 'absolute';
            rightBtn.style.right = '10px';
            rightBtn.style.top = '50%';
            rightBtn.style.transform = 'translateY(-50%)';
            rightBtn.style.zIndex = '10';
            rightBtn.style.cursor = 'pointer';
            rightBtn.style.border = 'none';
            rightBtn.style.borderRadius = '50%';
            rightBtn.style.width = '40px';
            rightBtn.style.height = '40px';
            rightBtn.style.display = 'flex';
            rightBtn.style.alignItems = 'center';
            rightBtn.style.justifyContent = 'center';
            rightBtn.style.color = 'white';

            const track = document.createElement('div');
            track.className = 'carousel-track';

            // Add Videos
            category.videos.forEach(video => {
                const card = createVideoCard(video);
                track.appendChild(card);
            });

            // Arrow click handlers
            const scrollAmount = 300;
            leftBtn.addEventListener('click', () => {
                const isRtl = document.documentElement.dir === 'rtl';
                track.scrollBy({ left: isRtl ? scrollAmount : -scrollAmount, behavior: 'smooth' });
            });

            rightBtn.addEventListener('click', () => {
                const isRtl = document.documentElement.dir === 'rtl';
                track.scrollBy({ left: isRtl ? -scrollAmount : scrollAmount, behavior: 'smooth' });
            });

            carouselContainer.appendChild(leftBtn);
            carouselContainer.appendChild(track);
            carouselContainer.appendChild(rightBtn);

            row.appendChild(carouselContainer);
            categoriesContainer.appendChild(row);

            // Add Click and Drag Scrolling
            enableDragScroll(track);
        });
    }

    // --- Create Single Video Card ---
    function createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.dataset.id = video.id;

        card.innerHTML = `
            <div class="video-thumb">
                <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                <div class="thumb-overlay">
                    <div class="play-icon"><i class="fas fa-play"></i></div>
                    <div class="card-info">
                        <h4 class="card-title">${video.title}</h4>
                        <p class="card-desc">${video.description}</p>
                    </div>
                </div>
            </div>
        `;

        // Click Event to open Modal
        card.addEventListener('click', () => {
            openModal(video);
        });

        return card;
    }

    // --- Access Gate Logic ---
    const gateOverlay = document.getElementById('gateOverlay');
    const gateLoginSection = document.getElementById('gateLoginSection');
    const gateExpiredSection = document.getElementById('gateExpiredSection');
    const gatePassword = document.getElementById('gatePassword');
    const gateSubmitBtn = document.getElementById('gateSubmitBtn');
    const gateErrorMsg = document.getElementById('gateErrorMsg');
    const daysLeftContainer = document.getElementById('daysLeftContainer');
    const daysLeftCount = document.getElementById('daysLeftCount');

    const EXPIRE_DATE = new Date('2026-04-10T00:00:00');
    const now = new Date();

    if (now >= EXPIRE_DATE) {
        // Expired
        gateOverlay.style.display = 'flex';
        gateLoginSection.style.display = 'none';
        gateExpiredSection.style.display = 'block';
    } else {
        // Not expired
        const diffTime = Math.abs(EXPIRE_DATE - now);
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        daysLeftCount.textContent = daysRemaining;

        const isUnlocked = localStorage.getItem('kartflix_unlocked') === 'true';

        if (isUnlocked) {
            gateOverlay.style.display = 'none';
            daysLeftContainer.style.display = 'block';
        } else {
            gateOverlay.style.display = 'flex';
            gateLoginSection.style.display = 'block';
            gateExpiredSection.style.display = 'none';

            function tryLogin() {
                if (gatePassword.value === 'KARTlearn2026') {
                    localStorage.setItem('kartflix_unlocked', 'true');
                    gateOverlay.style.display = 'none';
                    daysLeftContainer.style.display = 'block';
                } else {
                    gateErrorMsg.style.display = 'block';
                }
            }

            gateSubmitBtn.addEventListener('click', tryLogin);
            gatePassword.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') tryLogin();
            });
        }
    }

    // --- Modal Logic ---
    function openModal(videoData) {
        modalTitle.textContent = videoData.title;
        modalDesc.textContent = videoData.description;
        videoIframe.src = videoData.driveEmbedUrl;

        const protocolBtn = document.getElementById('protocolBtn');
        if (videoData.protocolUrl) {
            protocolBtn.href = videoData.protocolUrl;
            protocolBtn.style.display = 'inline-flex';
        } else {
            protocolBtn.style.display = 'none';
        }

        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent scrolling
    }

    function closeModal() {
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            videoIframe.src = ""; // Stop video playback when closed
        }, 300);
    }

    closeModalBtn.addEventListener('click', closeModal);
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal || e.target.classList.contains('modal-backdrop')) {
            closeModal();
        }
    });

    // Hero Play Button
    heroPlayBtn.addEventListener('click', () => {
        openModal({
            title: heroTitle.innerText.replace('\n', ' '),
            description: heroDesc.textContent,
            driveEmbedUrl: heroPlayBtn.dataset.driveUrl
        });
    });

    // --- Drag to Scroll for Carousel ---
    function enableDragScroll(slider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'pointer';
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'pointer';
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const isRtl = document.documentElement.dir === 'rtl';

            // Calculate walk differently based on RTL/LTR
            const walk = isRtl ? (startX - x) * 2 : (x - startX) * 2;

            slider.scrollLeft = scrollLeft - walk;
        });
    }
});
