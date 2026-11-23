//
// 1. Logo & Asset Preloading & Global Preloader (Image 1)
//
function initGlobalPreloader() {
    const preloader = document.getElementById('sitePreloader');
    if (!preloader) return;

    const segments = preloader.querySelectorAll('.preloader-seg');
    const totalSegs = segments.length;
    let currentSeg = 0;
    let isFullyLoaded = false;

    function updateProgress(count) {
        currentSeg = Math.min(totalSegs, Math.max(currentSeg, count));
        segments.forEach((seg, idx) => {
            if (idx < currentSeg) {
                seg.classList.add('active');
            }
        });
    }

    // Step through initial segments smoothly as page prepares
    const progressInterval = setInterval(() => {
        if (!isFullyLoaded && currentSeg < totalSegs - 3) {
            updateProgress(currentSeg + 1);
        }
    }, 80);

    function finishLoading() {
        if (isFullyLoaded) return;
        isFullyLoaded = true;
        clearInterval(progressInterval);

        let fillIdx = currentSeg;
        const completeInterval = setInterval(() => {
            if (fillIdx < totalSegs) {
                fillIdx++;
                updateProgress(fillIdx);
            } else {
                clearInterval(completeInterval);
                setTimeout(() => {
                    preloader.classList.add('loaded');
                    setTimeout(() => {
                        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
                    }, 500);
                }, 220);
            }
        }, 30);
    }

    let windowLoaded = false;
    window.addEventListener('load', () => {
        windowLoaded = true;
        if (document.body.classList.contains('canvas-loaded') || !document.getElementById('global3DCanvas')) {
            finishLoading();
        }
    });

    const observer = new MutationObserver(() => {
        if (document.body.classList.contains('canvas-loaded') && (windowLoaded || document.readyState === 'complete')) {
            observer.disconnect();
            finishLoading();
        }
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // Safety fallback (maximum 2.6s)
    setTimeout(() => {
        finishLoading();
    }, 2600);
}

// Start preloader immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalPreloader);
} else {
    initGlobalPreloader();
}

(function preloadCriticalAssets() {
    const assetsToPreload = [
        'Assets/Logo Main Navbar.svg',
        'Assets/Logo navbar transform.svg',
        'Assets/Hero Lines and Box.svg',
        'Assets/Toogle Button Dark.svg',
        'Assets/Toogle Button Light.svg',
        'Assets/Person Icon.svg',
        'Assets/Hero Image.png',
        'Assets/Logo Card.svg',
        'Assets/Replacement belts by brand BG.png'
    ];

    assetsToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
})();

// 
// 2. Sticky Navbar & Scroll-Based Logo Transformation (Fluent Conveyors Animation)
//
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const navbar = document.getElementById('navbar');
    let isHeaderScrolled = false;

    /**
     * 
     */
    function updateNavbarOnScroll() {
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        const shouldBeScrolled = currentScrollY > 50;

        if (shouldBeScrolled !== isHeaderScrolled) {
            isHeaderScrolled = shouldBeScrolled;
            if (header) header.classList.toggle('scrolled', isHeaderScrolled);
            if (navbar) navbar.classList.toggle('scrolled', isHeaderScrolled);
        }
    }

    // Passive scroll listener for the navbar with requestAnimationFrame ticking
    let navbarScrollTicking = false;
    function onNavbarScroll() {
        if (!navbarScrollTicking) {
            requestAnimationFrame(() => {
                updateNavbarOnScroll();
                navbarScrollTicking = false;
            });
            navbarScrollTicking = true;
        }
    }
    window.addEventListener('scroll', onNavbarScroll, { passive: true });

    // Initial calculation on load
    updateNavbarOnScroll();

    // 
    // 3. Theme Toggle (Dark / Light Mode)
    // 
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleImg = document.getElementById('theme-toggle-img');

    if (themeToggleBtn && themeToggleImg) {
        themeToggleBtn.addEventListener('click', () => {
            const isLight = document.body.classList.toggle('light-theme');
            if (isLight) {
                themeToggleImg.src = 'Assets/Toogle Button Light.svg';
                themeToggleImg.alt = 'Light Mode Active';
            } else {
                themeToggleImg.src = 'Assets/Toogle Button Dark.svg';
                themeToggleImg.alt = 'Dark Mode Active';
            }
        });
    }

    // 
    // 4. Mobile Navigation Drawer
    // 
    const mobileToggleBtn = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-btn-quote');

    function toggleMobileMenu(open) {
        const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('active');
        mobileDrawer.classList.toggle('active', isOpen);
        drawerOverlay.classList.toggle('active', isOpen);
        mobileToggleBtn.classList.toggle('active', isOpen);
        mobileToggleBtn.setAttribute('aria-expanded', isOpen.toString());
        mobileDrawer.setAttribute('aria-hidden', (!isOpen).toString());
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    if (mobileToggleBtn && mobileDrawer && drawerOverlay) {
        mobileToggleBtn.addEventListener('click', () => toggleMobileMenu());
        drawerOverlay.addEventListener('click', () => toggleMobileMenu(false));
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => toggleMobileMenu(false));
        });
    }

    // 
    // 5. Interactive Tabs in Section 2 ("Start With What You Have")
    // 
    initStartTabs();

    // 
    // 6. Segmented Progress Incline Chart in Section 4 ("Maximum Angle")
    // 
    initAngleMeterBars();

    // 
    // 7. Industry Carousel in Section 7 ("Sidewall Belts By Industry")
    // 
    initIndustryCarousel();

    // 
    // 8. Scroll-Driven 3D GLB Conveyor Model Across All 4 Sections
    // 
    initScrollDriven3DConveyor();

    // 
    // 9. Hold Us Carousel in Section 9 ("What You Can Hold Us To")
    // 
    initHoldUsCarousel();

    // 
    // 10. Quote Form & Mode Selector in Section 10 ("Request A Quote")
    // 
    initQuoteSection();

    // 
    // 11. FAQ Accordion in Section 11 ("Questions")
    // 
    initFaqAccordion();

    // 
    // 12. Footer Mini Quote Form
    // 
    initFooterQuoteForm();
});

/**
 * Tab switcher for "Start With What You Have" (Section 2)
 * 
 */
function initStartTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabSubhead = document.getElementById('tabSubhead');
    const tabDesc = document.getElementById('tabDescription');
    const tagsGrid = document.getElementById('provideTagsGrid');

    if (!tabBtns.length || !tabSubhead || !tabDesc || !tagsGrid) return;

    const tabData = [
        {
            subhead: 'A Belt To Replace',
            description: 'The tag, a few measurements or a photo is enough to start. We match profiles from any OEM and tell you what we can and cannot replicate.',
            tagRows: [
                ['//Belt width', '//Brand or tag'],
                ['//Belt length', '//Sidewall height'],
                ['//Cleat height', '//Pitch']
            ]
        },
        {
            subhead: 'A Spec From Engineering',
            description: 'Paste the designation or upload the spec sheet. We confirm the configuration against our range and quote it as written, or flag what needs to change.',
            tagRows: [
                ['//Spec sheet or designation'],
                ['//Quantity', '//Required date']
            ]
        },
        {
            subhead: 'An Application To Solve',
            description: 'Tell us the material, tonnage, incline and lift. We specify the belt and show the reasoning: sidewall, cleat profile and pitch, base belt and compound.',
            tagRows: [
                ['//Material', '//Bulk density'],
                ['//Lump size', '//T/h'],
                ['//Angle', '//Lift']
            ]
        }
    ];

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-tab'), 10) || 0;
            const data = tabData[index];
            if (!data) return;

            // Update tab button states
            tabBtns.forEach(b => {
                const isActive = b === btn;
                b.classList.toggle('active', isActive);
                b.setAttribute('aria-selected', isActive.toString());
            });

            // Smooth content update
            tabSubhead.style.opacity = '0';
            tabDesc.style.opacity = '0';
            tagsGrid.style.opacity = '0';

            setTimeout(() => {
                tabSubhead.textContent = data.subhead;
                tabDesc.textContent = data.description;
                tagsGrid.innerHTML = data.tagRows.map(row => 
                    `<div class="tech-tag-row">${row.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}</div>`
                ).join('');

                tabSubhead.style.transition = 'opacity 0.25s ease';
                tabDesc.style.transition = 'opacity 0.25s ease';
                tagsGrid.style.transition = 'opacity 0.25s ease';
                tabSubhead.style.opacity = '1';
                tabDesc.style.opacity = '1';
                tagsGrid.style.opacity = '1';
            }, 150);
        });
    });
}

/**
 * Section 4 ("Maximum Angle By Configuration")
 * 
 */
function initAngleMeterBars() {
    const meterContainers = document.querySelectorAll('.meter-segments');
    const TOTAL_SEGMENTS = 48; // Full dense row of thin bars per reference

    meterContainers.forEach(container => {
        const brightDeg = parseFloat(container.getAttribute('data-bright')) || parseFloat(container.getAttribute('data-deg')) || 0;
        const darkDeg = parseFloat(container.getAttribute('data-dark')) || brightDeg;
        const max = parseFloat(container.getAttribute('data-max')) || 90;

        const brightCount = Math.round((brightDeg / max) * TOTAL_SEGMENTS);
        const darkCount = Math.round((darkDeg / max) * TOTAL_SEGMENTS);

        let html = '';
        for (let i = 0; i < TOTAL_SEGMENTS; i++) {
            let stateClass = 'segment-black';
            if (i < brightCount) {
                stateClass = 'segment-bright';
            } else if (i < darkCount) {
                stateClass = 'segment-dark';
            }
            html += `<span class="segment ${stateClass}"></span>`;
        }
        container.innerHTML = html;
    });
}

/**
 * Industry Carousel Controller in Section 7 ("Sidewall Belts By Industry")
 * 
 */
function initIndustryCarousel() {
    const wrapper = document.getElementById('industryWrapper') || document.querySelector('.industry-carousel-wrapper');
    const prevBtn = document.getElementById('industryPrevBtn');
    const nextBtn = document.getElementById('industryNextBtn');
    if (!wrapper || !prevBtn || !nextBtn) return;

    const scrollAmount = 440; // Card width (420px) + gap (20px)

    prevBtn.addEventListener('click', () => {
        wrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
}

/**
 * Three.js GLB conveyor animation
 * Features dual-source loading:
 * - Direct GLB load for web servers (http/https/localhost)
 * - 
 */
function initScrollDriven3DConveyor() {
    const canvas = document.getElementById('global3DCanvas');
    if (!canvas) return;

    if (typeof THREE === 'undefined' || typeof THREE.GLTFLoader === 'undefined') {
        console.warn('Three.js or GLTFLoader not available. High-res static assets preserved.');
        return;
    }

    // Section anchor elements
    const stages = {
        hero: document.getElementById('hero3DStage'),
        start: document.getElementById('start3DStage'),
        range: document.getElementById('range3DStage'),
        angle: document.getElementById('angle3DStage')
    };

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (renderer.outputEncoding !== undefined) {
        renderer.outputEncoding = THREE.sRGBEncoding;
    }
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;

    // Silhouette & Dark Industrial Lighting Setup
    // Low ambient to preserve deep dark shadows without washing out rubber tones
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Subtle key light for gentle shape definition
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    // Cool rim light grazing corrugated edges from behind for sharp silhouette definition
    const rimLight = new THREE.DirectionalLight(0xd0e0ff, 1.8);
    rimLight.position.set(-6, 5, -5);
    scene.add(rimLight);

    // Electric industrial blue rim accent (#0E38EC) for subtle brand edge contouring
    const blueRimLight = new THREE.DirectionalLight(0x0E38EC, 2.2);
    blueRimLight.position.set(6, 3, -4);
    scene.add(blueRimLight);

    let conveyorPivot = null;
    let baseModelScale = 1.0;
    let targetCanvasOpacity = 0.0;
    let currentCanvasOpacity = 0.0;

    // 4 Keyframe Transformations
    // 3D model transforms calibrated to exact section reference angles:
    // Section 2: matches Image 2 (media_1795164522608_89d7c71d.jpg) - massive close-up on incline cleats & sidewalls
    // Section 3: matches Image 2 (media_1795163633923_3cb05a86.jpg)
    const KEYFRAMES = [
        // 0: Hero Section (Initial resting state behind hero image, 0% opacity)
        {
            posX: -0.22,
            posY: -0.52,
            posZ: 0.35,
            rotX: 0.78,
            rotY: 1.26,
            rotZ: -0.06,
            scaleMultiplier: 5.0
        },
        // 1: Start With What You Have (Section 2 - Exact orientation matching user reference: media_1795164651543_97a3234b.jpg)
        {
            posX: -0.22,
            posY: -0.52,
            posZ: 0.35,
            rotX: 0.78,
            rotY: 1.26,
            rotZ: -0.06,
            scaleMultiplier: 5.0
        },
        // 2: Range At A Glance (Section 3 - Wide zoom matching media_1795163633923_3cb05a86.jpg)
        {
            posX: -0.10,
            posY: -0.65,
            posZ: 0.35,
            rotX: 0.88,
            rotY: 1.96,
            rotZ: -0.26,
            scaleMultiplier: 5.0
        },
        // 3: Maximum Angle By Configuration (Section 4 - Steep rising incline view)
        {
            posX: -0.15,
            posY: -0.30,
            posZ: 0.35,
            rotX: 0.38,
            rotY: 0.65,
            rotZ: -0.10,
            scaleMultiplier: 4.2
        }
    ];

    const targetState = { ...KEYFRAMES[0] };
    const currentState = { ...KEYFRAMES[0] };

    // Mouse parallax offset
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    window.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 0.12;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 0.12;
    }, { passive: true });

    /**
     * Handler when model is successfully loaded
     */
    function onModelLoaded(gltf) {
        const rawModel = gltf.scene;

        // Calculate accurate bounding box
        const box = new THREE.Box3().setFromObject(rawModel);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        // Scaled up 80% (from 1.35 to 2.43) per user request
        baseModelScale = 2.43 / (maxDim || 1);

        // Center model geometry so its true centroid is at (0, 0, 0)
        rawModel.position.set(-center.x, -center.y, -center.z);

        // Darken materials and emphasize matte rubber finish for silhouette aesthetic
        rawModel.traverse((child) => {
            if (child.isMesh && child.material) {
                if (child.material.color) {
                    child.material.color.multiplyScalar(0.7);
                }
                child.material.roughness = Math.max(child.material.roughness || 0.7, 0.65);
                child.frustumCulled = true; // Optimization: enable GPU frustum culling
            }
        });

        // Create pivot group for world transforms
        conveyorPivot = new THREE.Group();
        conveyorPivot.add(rawModel);
        scene.add(conveyorPivot);
        window.debugConveyorPivot = conveyorPivot;

        applyState(currentState);

        document.body.classList.add('canvas-loaded');
        updateModelTransformFromScroll();
    }

    // Initialize GLTFLoader and configure DRACOLoader for compressed GLB geometry
    const loader = new THREE.GLTFLoader();
    if (typeof THREE.DRACOLoader !== 'undefined') {
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/');
        dracoLoader.setDecoderConfig({ type: 'js' });
        loader.setDRACOLoader(dracoLoader);
    }
    const isFileProtocol = window.location.protocol === 'file:';
    const primarySource = (isFileProtocol && window.CORRUGATED_GLB_BASE64) 
        ? window.CORRUGATED_GLB_BASE64 
        : 'Assets/Corrugated.glb';

    loader.load(
        primarySource,
        onModelLoaded,
        undefined,
        (err) => {
            console.warn('Standard GLB loading encountered issue. Attempting in-memory data fallback...', err);
            if (window.CORRUGATED_GLB_BASE64 && primarySource !== window.CORRUGATED_GLB_BASE64) {
                loader.load(window.CORRUGATED_GLB_BASE64, onModelLoaded, undefined, (fallbackErr) => {
                    console.error('All 3D model loaders failed:', fallbackErr);
                });
            }
        }
    );

    /**
     * Easing function for smooth section transitions
     */
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    /**
     * 
     * 
     */
    function updateModelTransformFromScroll() {
        if (!stages.hero || !stages.start || !stages.range || !stages.angle) return;

        const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        const viewportCenter = scrollY + window.innerHeight * 0.5;

        function getElementCenterY(el) {
            const rect = el.getBoundingClientRect();
            return scrollY + rect.top + rect.height * 0.5;
        }

        const startSection = document.getElementById('start-section');
        const startTop = startSection ? startSection.offsetTop : stages.start.offsetTop;

        const y1 = getElementCenterY(stages.start);
        const y2 = getElementCenterY(stages.range);
        const y3 = getElementCenterY(stages.angle);

        const isMobile = window.innerWidth <= 992;
        const widthFactor = isMobile ? Math.min(0.88, window.innerWidth / 992) : 1.0;

        // Entrance 
        // 
        const entranceStart = startTop - window.innerHeight * 0.85;
        const entranceComplete = startTop - window.innerHeight * 0.15;

        let frameA = 0;
        let frameB = 0;
        let t = 0;

        if (scrollY <= entranceStart) {
            // Completely in Hero section: 3D model is 100% invisible
            frameA = 0;
            frameB = 0;
            t = 0;
            targetCanvasOpacity = 0.0;
        } else if (scrollY < entranceComplete) {
            // Entering Section 2 ("Start With What You Have"): fade in seamlessly
            const progress = (scrollY - entranceStart) / (entranceComplete - entranceStart);
            frameA = 0;
            frameB = 1;
            t = Math.max(0, Math.min(1, progress));
            targetCanvasOpacity = Math.max(0, Math.min(1, progress * 1.35));
        } else if (viewportCenter <= y1) {
            // In Section 2 ("Start With What You Have")
            frameA = 1;
            frameB = 1;
            t = 0;
            targetCanvasOpacity = 1.0;
        } else if (viewportCenter <= y2) {
            // Transitioning from Section 2 to Section 3 ("Range At A Glance") - zoom & rotate
            frameA = 1;
            frameB = 2;
            t = (viewportCenter - y1) / (y2 - y1);
            targetCanvasOpacity = 1.0;
        } else if (viewportCenter <= y3) {
            // Transitioning from Section 3 to Section 4 ("Maximum Angle") - rotate to steep incline
            frameA = 2;
            frameB = 3;
            t = (viewportCenter - y2) / (y3 - y2);
            targetCanvasOpacity = 1.0;
        } else {
            // Resting in Section 4 ("Maximum Angle") or fading out as user scrolls into Section 5
            frameA = 3;
            frameB = 3;
            t = 1;
            
            const appEngSection = document.getElementById('application-engineering');
            if (appEngSection) {
                const appEngTop = getElementCenterY(appEngSection) - (appEngSection.offsetHeight * 0.4);
                const exitProgress = (viewportCenter - y3) / (appEngTop - y3 || 1);
                targetCanvasOpacity = Math.max(0, 1 - Math.min(1, Math.max(0, exitProgress) * 1.5));
            } else {
                targetCanvasOpacity = 1.0;
            }
        }

        t = Math.max(0, Math.min(1, t));
        const easedT = easeInOutCubic(t);

        const kA = KEYFRAMES[frameA];
        const kB = KEYFRAMES[frameB];

        targetState.posX = lerp(kA.posX, kB.posX, easedT);
        targetState.posY = lerp(kA.posY, kB.posY, easedT);
        targetState.posZ = lerp(kA.posZ, kB.posZ, easedT);
        targetState.rotX = lerp(kA.rotX, kB.rotX, easedT);
        targetState.rotY = lerp(kA.rotY, kB.rotY, easedT);
        targetState.rotZ = lerp(kA.rotZ, kB.rotZ, easedT);
        targetState.scaleMultiplier = lerp(kA.scaleMultiplier, kB.scaleMultiplier, easedT) * widthFactor;
    }

    function applyState(state) {
        if (!conveyorPivot) return;
        conveyorPivot.position.set(state.posX, state.posY, state.posZ);
        conveyorPivot.rotation.set(
            state.rotX + mouseY,
            state.rotY + mouseX,
            state.rotZ
        );
        const finalScale = baseModelScale * state.scaleMultiplier;
        conveyorPivot.scale.set(finalScale, finalScale, finalScale);
    }

    // Scroll listener for 3D model animation with requestAnimationFrame ticking
    let modelScrollTicking = false;
    function onModelScroll() {
        if (!modelScrollTicking) {
            requestAnimationFrame(() => {
                updateModelTransformFromScroll();
                modelScrollTicking = false;
            });
            modelScrollTicking = true;
        }
    }
    window.addEventListener('scroll', onModelScroll, { passive: true });

    // Debounced window resize handler to prevent layout thrashing
    let resizeTimer = null;
    function onWindowResize() {
        if (resizeTimer) cancelAnimationFrame(resizeTimer);
        resizeTimer = requestAnimationFrame(() => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            updateModelTransformFromScroll();
        });
    }
    window.addEventListener('resize', onWindowResize, { passive: true });

    // Initial calculation
    updateModelTransformFromScroll();

    // Render loop with smooth damping and idle GPU power saving
    function animate() {
        requestAnimationFrame(animate);

        // Smooth 3D Canvas opacity transition for seamless, un-clipped appearance
        currentCanvasOpacity += (targetCanvasOpacity - currentCanvasOpacity) * 0.08;
        if (canvas) {
            if (currentCanvasOpacity <= 0.005) {
                if (canvas.style.visibility !== 'hidden') {
                    canvas.style.opacity = '0';
                    canvas.style.visibility = 'hidden';
                }
            } else {
                if (canvas.style.visibility !== 'visible') {
                    canvas.style.visibility = 'visible';
                }
                canvas.style.opacity = currentCanvasOpacity.toFixed(3);
            }
        }

        // Idle power optimization
        // 
        if (currentCanvasOpacity <= 0.005 && targetCanvasOpacity <= 0.001) {
            return;
        }

        const dampFactor = 0.075;
        currentState.posX += (targetState.posX - currentState.posX) * dampFactor;
        currentState.posY += (targetState.posY - currentState.posY) * dampFactor;
        currentState.posZ += (targetState.posZ - currentState.posZ) * dampFactor;
        currentState.rotX += (targetState.rotX - currentState.rotX) * dampFactor;
        currentState.rotY += (targetState.rotY - currentState.rotY) * dampFactor;
        currentState.rotZ += (targetState.rotZ - currentState.rotZ) * dampFactor;
        currentState.scaleMultiplier += (targetState.scaleMultiplier - currentState.scaleMultiplier) * dampFactor;

        // Smooth mouse parallax
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        applyState(currentState);

        renderer.render(scene, camera);
    }
    animate();
}

/**
 * Section 9 ("What You Can Hold Us To")
 */
function initHoldUsCarousel() {
    const track = document.getElementById('holdUsTrack');
    const prevBtn = document.getElementById('holdUsPrev');
    const nextBtn = document.getElementById('holdUsNext');
    const fadeLeft = document.querySelector('.hold-us-fade-left');
    const fadeRight = document.querySelector('.hold-us-fade-right');
    if (!track || !prevBtn || !nextBtn) return;

    const pillars = Array.from(track.querySelectorAll('.hold-us-pillar'));
    if (!pillars.length) return;

    let currentIndex = 0;

    function updateCarousel() {
        let offset = 0;
        if (currentIndex > 0 && pillars[currentIndex]) {
            offset = pillars[currentIndex].offsetLeft;
        }
        track.style.transform = `translateX(-${offset}px)`;

        // Highlight visible pillars per Image
        pillars.forEach((p, idx) => {
            const isActive = (currentIndex === 0) ? (idx === 1 || idx === 2) : (idx >= currentIndex && idx <= currentIndex + 1);
            p.classList.toggle('active', isActive);
        });

        // Edge fade 
        if (fadeLeft) fadeLeft.style.opacity = '1';
        if (fadeRight) fadeRight.style.opacity = (currentIndex < 1) ? '1' : '0.4';
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < 1) { // Exactly max 3 text visible at any time
            currentIndex++;
            updateCarousel();
        }
    });

    window.addEventListener('resize', () => {
        updateCarousel();
    });
}

/**
 * 
 */
function initQuoteSection() {
    const modeCards = document.querySelectorAll('.quote-mode-card');
    modeCards.forEach(card => {
        card.addEventListener('click', () => {
            modeCards.forEach(c => {
                c.classList.remove('active');
                c.setAttribute('aria-selected', 'false');
            });
            card.classList.add('active');
            card.setAttribute('aria-selected', 'true');

            // Switch active form panel 
            const mode = card.getAttribute('data-mode');
            const targetPanel = document.getElementById(`quotePanel_${mode}`);
            document.querySelectorAll('.quote-form-panel').forEach(p => p.classList.remove('active'));
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // Helper 
    function bindDropzone(dzId, inputId, selectedId, btnId) {
        const dz = document.getElementById(dzId);
        const input = document.getElementById(inputId);
        const selected = document.getElementById(selectedId);
        const btn = document.getElementById(btnId);
        if (!dz || !input) return;

        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                input.click();
            });
        }

        input.addEventListener('change', () => {
            if (input.files && input.files.length > 0 && selected) {
                selected.textContent = `Attached: ${input.files[0].name} (${(input.files[0].size / 1024 / 1024).toFixed(2)} MB)`;
                selected.style.display = 'block';
            } else if (selected) {
                selected.style.display = 'none';
            }
        });

        // Drag and drop visual cues
        ['dragenter', 'dragover'].forEach(eventName => {
            dz.addEventListener(eventName, (e) => {
                e.preventDefault();
                dz.style.borderColor = '#0E38EC';
                dz.style.background = 'rgba(14, 56, 236, 0.08)';
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dz.addEventListener(eventName, (e) => {
                e.preventDefault();
                dz.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                dz.style.background = 'rgba(255, 255, 255, 0.03)';
            });
        });
    }

    bindDropzone('quoteDropzone', 'quoteFileInput', 'quoteFileSelected', 'quoteBrowseBtn');
    bindDropzone('specDropzone', 'specFileInput', 'specFileSelected', 'specBrowseBtn');
    bindDropzone('engDropzone', 'engFileInput', 'engFileSelected', 'engBrowseBtn');

    // Custom Select Dropdowns 
    const customSelects = document.querySelectorAll('.quote-custom-select');
    customSelects.forEach(selectWrap => {
        const trigger = selectWrap.querySelector('.quote-select-trigger');
        const menu = selectWrap.querySelector('.quote-dropdown-menu');
        const hiddenInput = selectWrap.querySelector('input[type="hidden"]');
        const valText = selectWrap.querySelector('.quote-select-val');
        const items = selectWrap.querySelectorAll('.quote-dropdown-item');

        if (!trigger || !menu) return;

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = menu.classList.contains('open');
            // Close any other open dropdowns first
            document.querySelectorAll('.quote-dropdown-menu.open').forEach(m => {
                if (m !== menu) m.classList.remove('open');
            });
            menu.classList.toggle('open', !isOpen);
            trigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
        });

        items.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const val = item.getAttribute('data-value');
                const label = item.textContent;

                if (hiddenInput) hiddenInput.value = val;
                if (valText) valText.textContent = label;

                items.forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');

                menu.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            });
        });
    });

    // Close dropdowns 
    document.addEventListener('click', () => {
        document.querySelectorAll('.quote-dropdown-menu.open').forEach(m => {
            m.classList.remove('open');
        });
        document.querySelectorAll('.quote-select-trigger[aria-expanded="true"]').forEach(t => {
            t.setAttribute('aria-expanded', 'false');
        });
    });

    const form = document.getElementById('quoteForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('.quote-submit-btn .cta-text');
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'QUOTE REQUESTED ✓';
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                }, 3000);
            }
        });
    }
}

/**
 * Accordion for Section 11 ("Questions")
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question-btn');
        const panel = item.querySelector('.faq-answer-panel');
        if (!btn || !panel) return;

        // Initialize panel height for active item on page load
        if (item.classList.contains('active')) {
            panel.style.maxHeight = panel.scrollHeight + 'px';
        }

        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            if (isActive) {
                // Collapse
                panel.style.maxHeight = '0';
                item.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            } else {
                // Expand
                panel.style.maxHeight = panel.scrollHeight + 'px';
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

/**
 * Footer Mini Quote Form Handler
 */
function initFooterQuoteForm() {
    const footerForm = document.getElementById('footerQuoteForm');
    if (!footerForm) return;

    footerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = footerForm.querySelector('.footer-submit-btn .cta-text');
        if (submitBtn) {
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'REQUESTED ✓';
            setTimeout(() => {
                submitBtn.textContent = originalText;
                footerForm.reset();
            }, 3000);
        }
    });
}
