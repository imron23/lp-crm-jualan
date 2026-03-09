// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Hero Mockup Entrance
window.addEventListener('load', () => {
    const mockup = document.getElementById('heroMockup');
    if (mockup) mockup.classList.add('active');
});

// Generic Reveal Animation
const revealElements = document.querySelectorAll('.reveal');
revealElements.forEach((el) => {
    // Check if mobile
    const isMobile = window.innerWidth < 850;

    if (isMobile) {
        // Simple fade in on mobile without motion
        gsap.fromTo(el, { opacity: 0 }, {
            opacity: 1, duration: 0.8, ease: "none",
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" }
        });
    } else {
        // Powerful motion on desktop
        gsap.fromTo(el, { opacity: 0, y: 40, scale: 0.98 }, {
            opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
        });
    }
});

// Typewriter Effect for Problem Section
const typewriterText = {
    id: "Apakah Iklan Umrah Anda Hanya Menjadi 'Biaya' Tanpa Hasil?",
    en: "Is Your Umrah Ad Budget Just a 'Cost' Without Results?"
};
const typewriterElement = document.getElementById('typewriterHeadline');
let typewriterTimer = null;

function runTypewriter(lang = 'id') {
    if (!typewriterElement) return;
    if (typewriterTimer) clearTimeout(typewriterTimer);
    let i = 0;
    const text = typewriterText[lang] || typewriterText['id'];
    typewriterElement.innerHTML = "";
    function type() {
        if (i < text.length) {
            typewriterElement.innerHTML += text.charAt(i);
            i++;
            typewriterTimer = setTimeout(type, 50);
        } else { typewriterTimer = null; }
    }
    type();
}

if (typewriterElement) {
    ScrollTrigger.create({
        trigger: typewriterElement,
        start: "top 80%",
        onEnter: () => {
            const currentLang = localStorage.getItem('munira-lang') || 'id';
            runTypewriter(currentLang);
        },
        once: true
    });
}

// Translations are now moved to translations.js to keep script.js clean.


function setLanguage(lang) {
    localStorage.setItem('munira-lang', lang);
    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
        const span = btn.querySelector('span');
        if (span) span.innerText = lang.toUpperCase();
        else btn.innerText = lang.toUpperCase();
    });
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) { el.innerHTML = translations[lang][key]; }
    });
    if (typewriterElement && typewriterElement.innerHTML !== "") runTypewriter(lang);
}

// Language toggles are handled at the end of the script via .lang-toggle-btn class.


// Testimonial Drag Logic
const slider = document.getElementById('testiSlider');
let isDown = false; let startX; let scrollLeft;
if (slider) {
    slider.addEventListener('mousedown', (e) => { isDown = true; startX = e.pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft; });
    slider.addEventListener('mouseleave', () => isDown = false);
    slider.addEventListener('mouseup', () => isDown = false);
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return; e.preventDefault();
        const x = e.pageX - slider.offsetLeft; const walk = (x - startX) * 2; slider.scrollLeft = scrollLeft - walk;
    });
}

// Global Initialization
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('munira-lang') || 'id';
    setLanguage(savedLang);
    const savedTheme = localStorage.getItem('munira-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);
});

// Theme Engine
const body = document.body;
function setTheme(mode) {
    document.querySelectorAll('.theme-toggle-btn i').forEach(icon => {
        icon.className = mode === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    });
    document.querySelectorAll('.theme-toggle-btn span').forEach(span => {
        if (span.getAttribute('data-i18n') === 'nav_theme') {
            // Handled by setLanguage i18n usually, but we can force it
        }
    });
    body.classList.toggle('dark-mode', mode === 'dark');
    localStorage.setItem('munira-theme', mode);
}


// Fireworks / Confetti Celebration - Premium Style
function celebrateBestValue() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#0d5c4b', '#d4af37', '#ffffff']
        }));
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#0d5c4b', '#d4af37', '#ffffff']
        }));
    }, 250);
}

// Add event listeners to pricing buttons
// Add event listeners to pricing and consultation buttons to open modal
function openConsultationModal() {
    const modal = document.getElementById('consultModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        resetConsultForm();
    }
}

document.querySelectorAll('.price-box .btn-glow, .price-box .apple-btn, .cta-premium .btn-glow, .apple-hero .btn-glow').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (btn.closest('.price-box')?.classList.contains('featured')) {
            celebrateBestValue();
        }
        openConsultationModal();
    });
});

// Close Modal Logic
document.getElementById('closeConsult')?.addEventListener('click', () => {
    document.getElementById('consultModal')?.classList.remove('active');
    document.body.style.overflow = '';
});

const modalOverlay = document.getElementById('consultModal');
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Interactive Speed Bar Animation - Narrative Storytelling
const revealBars = document.querySelectorAll('.reveal-bar');
revealBars.forEach(bar => {
    const isMunira = bar.classList.contains('success');
    gsap.to(bar, {
        width: bar.getAttribute('data-width'),
        duration: isMunira ? 1.0 : 4.0, // Munira is fast, WP is agonizingly slow
        ease: isMunira ? "power4.out" : "linear",
        scrollTrigger: {
            trigger: bar,
            start: "top 90%"
        },
        delay: isMunira ? 0 : 0.5 // Start WP slightly later to emphasize frustration
    });
});

// Consultation Modal Progressive Logic
const mNextBtn = document.getElementById('mNextBtn');
const mPrevBtn = document.getElementById('mPrevBtn');
const mSubmitBtn = document.getElementById('mSubmitBtn');
const mSteps = document.querySelectorAll('.m-form-step');
const mProgressBar = document.getElementById('modalProgressBar');
let mCurrentStep = 0;

function updateModalForm() {
    mSteps.forEach((s, i) => s.style.display = i === mCurrentStep ? 'block' : 'none');
    if (mProgressBar) {
        const progress = ((mCurrentStep + 1) / mSteps.length) * 100;
        mProgressBar.style.width = `${progress}%`;
    }
    if (mPrevBtn) mPrevBtn.style.display = mCurrentStep === 0 ? 'none' : 'block';
    if (mNextBtn) mNextBtn.style.display = mCurrentStep === mSteps.length - 1 ? 'none' : 'block';
    if (mSubmitBtn) mSubmitBtn.style.display = mCurrentStep === mSteps.length - 1 ? 'block' : 'none';
}

function resetConsultForm() {
    mCurrentStep = 0;
    updateModalForm();
    document.getElementById('consultForm')?.reset();
}

mNextBtn?.addEventListener('click', () => {
    if (mCurrentStep < mSteps.length - 1) {
        mCurrentStep++;
        updateModalForm();
        gsap.fromTo(mSteps[mCurrentStep], { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.5 });
    }
});

mPrevBtn?.addEventListener('click', () => {
    if (mCurrentStep > 0) {
        mCurrentStep--;
        updateModalForm();
        gsap.fromTo(mSteps[mCurrentStep], { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.5 });
    }
});

document.getElementById('consultForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('mSubmitBtn');
    const originalText = btn?.innerHTML;

    // Extract Form Data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Handle multiple checkboxes (obstacles)
    data.obstacles = formData.getAll('obstacles');

    if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        btn.disabled = true;
    }

    try {
        const response = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            celebrateBestValue();
            if (btn) {
                btn.innerHTML = '<i class="fas fa-check"></i> Success!';
                btn.style.background = '#10b981';
            }
            setTimeout(() => {
                document.getElementById('consultModal')?.classList.remove('active');
                document.body.style.overflow = '';
                if (btn) {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                }
                resetConsultForm();
            }, 2000);
        } else {
            throw new Error('Failed to submit lead');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        if (btn) {
            btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
            btn.style.background = '#ff3b30';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.style.background = '';
            }, 2000);
        }
    }
});

// Autocomplete Wilayah (Shared)
window.initAutocomplete = function (inputId, dropdownId) {
    const inp = document.getElementById(inputId);
    const dd = document.getElementById(dropdownId);
    if (!inp || !dd) return;
    const API_BASE = '/api';
    let timer;
    inp.addEventListener('input', () => {
        const q = inp.value.trim(); if (q.length < 3) { dd.style.display = 'none'; return; }
        clearTimeout(timer);
        timer = setTimeout(async () => {
            try {
                const res = await fetch(`${API_BASE}/wilayah/search?q=${encodeURIComponent(q)}`);
                const json = await res.json();
                const results = json.data || [];
                if (!results.length) { dd.innerHTML = '<div style="padding:15px; color:#888;">No results</div>'; }
                else {
                    dd.innerHTML = results.map(r => `<div class="ac-item" style="padding:12px; cursor:pointer;" onclick="selectLoc('${r.kecamatan}, ${r.kota}', '${inputId}', '${dropdownId}')">${r.kecamatan}, ${r.kota}</div>`).join('');
                }
                dd.style.display = 'block';
            } catch (e) { }
        }, 300);
    });
};

window.selectLoc = function (val, inputId, dropdownId) {
    const inp = document.getElementById(inputId);
    const dd = document.getElementById(dropdownId);
    if (inp) inp.value = val;
    if (dd) dd.style.display = 'none';
};

initAutocomplete('eDomisili', 'eDomisiliDropdown');
initAutocomplete('consultLoc', 'consultLocDropdown');

// FAQ Accordion Toggle (Robust)
document.addEventListener('click', (e) => {
    const question = e.target.closest('.faq-question');
    const item = e.target.closest('.faq-item');

    // If we clicked the question, or we clicked the item itself while it's closed
    if (question || (item && !item.classList.contains('active'))) {
        const targetItem = item || (question ? question.parentElement : null);
        if (!targetItem) return;

        const isOpening = !targetItem.classList.contains('active');

        // Close other items
        document.querySelectorAll('.faq-item').forEach(other => {
            if (other !== targetItem) other.classList.remove('active');
        });

        // Toggle current
        targetItem.classList.toggle('active');

        console.log('Accordion toggled:', targetItem.classList.contains('active'));
    }
});

/* --- INTERACTIVE ANIMATIONS ENGINE --- */

// 1. 3D Tilt for Bento and Security Cards
document.querySelectorAll('.bento-card, .security-module, .analogy-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        card.style.transform = "perspective(1000px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale(1.02)";
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    });
});

// 2. Magnetic Buttons Effect
document.querySelectorAll('.btn-glow, .apple-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = "translate(" + (x * 0.2) + "px, " + (y * 0.2) + "px)";
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = "translate(0, 0)";
    });
});

// 3. Hero Parallax
const hero = document.querySelector('.apple-hero');
const mockup = document.getElementById('heroMockup');
if (hero && mockup) {
    hero.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.clientX) / 50;
        const y = (window.innerHeight / 2 - e.clientY) / 50;
        mockup.style.transform = "rotateX(" + (-y) + "deg) rotateY(" + (-x) + "deg)";

        // Also move glow sphere
        const sphere = document.querySelector('.hero-glow-sphere');
        if (sphere) {
            sphere.style.transform = "translate(calc(-50% + " + (x * 2) + "px), calc(-50% + " + (y * 2) + "px))";
        }
    });
}

// 4. Live Leads Stream Simulation Ping
const streamList = document.querySelector('.stream-list');
if (streamList) {
    setInterval(() => {
        const first = streamList.children[0];
        if (first) {
            first.style.animation = "none";
            // Trigger reflow
            void first.offsetWidth;
            first.style.animation = "pulsePing 2s infinite";
        }
    }, 4000);
}

const style = document.createElement('style');
style.innerHTML = `
    @keyframes pulsePing {
        0% { background: rgba(16, 185, 129, 0.1); }
        50% { background: rgba(16, 185, 129, 0.3); }
        100% { background: transparent; }
    }
`;
document.head.appendChild(style);

// 5. Program Builder Modal Toggle
document.addEventListener('DOMContentLoaded', () => {
    const progCard = document.querySelector('.card-prog');
    const progModal = document.getElementById('programModal');
    const closeModal = document.getElementById('closeModal');

    if (progCard && progModal && closeModal) {
        progCard.style.cursor = 'pointer';
        progCard.addEventListener('click', () => {
            progModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeModal.addEventListener('click', () => {
            progModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        progModal.addEventListener('click', (e) => {
            if (e.target === progModal) {
                progModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// 6. Ecosystem Tooltips & Success Animation
function showNodeDetail(element, type) {
    // Close all other tooltips
    document.querySelectorAll('.node-tooltip').forEach(tt => tt.classList.remove('active'));

    // Toggle current
    const tooltip = element.querySelector('.node-tooltip');
    if (tooltip) tooltip.classList.add('active');

    // Close tooltip when clicking outside
    setTimeout(() => {
        const handleOutside = (e) => {
            if (!element.contains(e.target)) {
                tooltip.classList.remove('active');
                document.removeEventListener('click', handleOutside);
            }
        };
        document.addEventListener('click', handleOutside);
    }, 10);
}

function triggerSuccessAnim(element) {
    showNodeDetail(element, 'success');

    // Coin Fall Logic
    const container = document.getElementById('coinContainer');
    if (!container) return;

    container.innerHTML = '';
    const coinCount = 30;

    for (let i = 0; i < coinCount; i++) {
        const coin = document.createElement('div');
        coin.className = 'coin';
        coin.innerText = '$';

        // Randomize
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = 1 + Math.random() * 2;

        coin.style.left = `${left}%`;
        coin.style.animation = `coinFall ${duration}s ${delay}s ease-in forwards`;

        container.appendChild(coin);

        // Cleanup
        setTimeout(() => coin.remove(), (delay + duration) * 1000);
    }
}

// 7. Dashboard Filter Logic
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.db-filters .filter-btn');
    const statValues = document.querySelectorAll('.stat-card .stat-value');

    const dashboardData = {
        'Today': ['42', '0', '33.3%', '2m 14s', '12 won', 'Rp 145.000.000', '28'],
        'Yday': ['58', '0', '41.2%', '4m 02s', '18 won', 'Rp 192.000.000', '35'],
        '7D': ['312', '0', '38.5%', '5m 17s', '75 won', 'Rp 668.000.000', '142'],
        '1M': ['1,240', '0', '35.9%', '6m 22s', '245 won', 'Rp 2.4B', '480'],
        'All': ['8,420', '0', '39.0%', '4m 55s', '1,820 won', 'Rp 18.5B', '3,210']
    };

    const chartData = {
        'Today': { labels: ['08:00', '10:00', '12:00', '14:00', '16:00'], leads: [5, 12, 8, 10, 7], conversions: [1, 3, 2, 4, 2] },
        'Yday': { labels: ['08:00', '10:00', '12:00', '14:00', '16:00'], leads: [8, 15, 12, 14, 9], conversions: [2, 4, 3, 5, 4] },
        '7D': { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], leads: [35, 42, 38, 51, 47, 55, 44], conversions: [12, 14, 11, 15, 13, 18, 12] },
        '1M': { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], leads: [280, 310, 245, 405], conversions: [85, 92, 74, 115] },
        'All': { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], leads: [1200, 1500, 1800, 1400, 2100, 2400], conversions: [400, 520, 610, 480, 710, 820] }
    };

    let perfChart = null;
    try {
        if (typeof Chart !== 'undefined') {
            const ctx = document.getElementById('dashboardPerformanceChart')?.getContext('2d');
            if (ctx) {
                perfChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: chartData['7D'].labels,
                        datasets: [{
                            label: 'Leads',
                            data: chartData['7D'].leads,
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            fill: true,
                            tension: 0.4
                        }, {
                            label: 'Conversions',
                            data: chartData['7D'].conversions,
                            borderColor: '#d4af37',
                            backgroundColor: 'rgba(212, 175, 55, 0.1)',
                            fill: true,
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                                labels: { color: '#94a3b8' }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                                ticks: { color: '#94a3b8' }
                            },
                            x: {
                                grid: { display: false },
                                ticks: { color: '#94a3b8' }
                            }
                        }
                    }
                });
            }
        } else {
            console.warn('Chart.js library not loaded yet.');
        }
    } catch (e) {
        console.error('Error initializing chart:', e);
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // UI Toggle
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const period = btn.innerText;
            const data = dashboardData[period];
            const graph = chartData[period];

            if (data) {
                statValues.forEach((stat, index) => {
                    if (data[index]) {
                        const targetVal = data[index];
                        gsap.to(stat, {
                            opacity: 0,
                            y: -10,
                            duration: 0.2,
                            onComplete: () => {
                                stat.innerText = targetVal;
                                gsap.fromTo(stat, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 });
                            }
                        });
                    }
                });

                // Update Revenue and Sales stats specifically if they exist in dashboardData
                // (Note: dashboardData array indexes: 0:Leads, 1:Inquiries, 2:CVR, 3:Response, 4:Deals, 5:Revenue, 6:Sales)
            }

            // Update Chart
            if (perfChart && graph) {
                perfChart.data.labels = graph.labels;
                perfChart.data.datasets[0].data = graph.leads;
                perfChart.data.datasets[1].data = graph.conversions;
                perfChart.update('active');
            }
        });
    });

    // Apply button logic
    const applyBtn = document.querySelector('[data-i18n="ov_apply"]');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const originalText = applyBtn.innerText;
            applyBtn.innerText = 'Applying...';
            applyBtn.style.opacity = '0.7';

            setTimeout(() => {
                const activeBtn = document.querySelector('.db-filters .filter-btn.active');
                if (activeBtn) {
                    // Re-trigger the click logic to update everything
                    const period = activeBtn.innerText;
                    const data = dashboardData[period];
                    const graph = chartData[period];

                    if (data) {
                        statValues.forEach((stat, index) => {
                            if (data[index]) {
                                stat.innerText = data[index];
                                gsap.fromTo(stat, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 });
                            }
                        });
                    }
                    if (perfChart && graph) {
                        perfChart.data.labels = graph.labels;
                        perfChart.data.datasets[0].data = graph.leads;
                        perfChart.data.datasets[1].data = graph.conversions;
                        perfChart.update();
                    }
                }
                applyBtn.innerText = originalText;
                applyBtn.style.opacity = '1';

                // Success feedback
                gsap.to(applyBtn, { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1 });
            }, 800);
        });
    }

    // 8. WA Panel Builder Direct Logic
    const waMessageDir = document.getElementById('waMessage_direct');
    const waPreviewDir = document.getElementById('waPreview_direct');
    const csNameDir = document.getElementById('csName_direct');
    const defaultGreetDir = document.getElementById('defaultGreet_direct');

    function updatePreviewDirect() {
        if (!waMessageDir || !waPreviewDir) return;

        let text = waMessageDir.value;
        if (!text) {
            waPreviewDir.innerHTML = 'Ketik pesan untuk melihat hasil...<span class="wa-time">10:42 <i class="fas fa-check-double" style="color: #53bdeb;"></i></span>';
            return;
        }

        const replacements = {
            '\\[sapaan\\]': '<span class="ac-highlight">' + (defaultGreetDir?.value || 'Bapak/Ibu') + '</span>',
            '\\[nama\\]': '<span class="ac-highlight">Fulan</span>',
            '\\[namacs\\]': '<span class="ac-highlight">' + (csNameDir?.value || 'Admin') + '</span>',
            '\\[detailprogram\\]': '<span class="ac-highlight">Umrah Reguler 12 Hari</span>',
            '\\[nominal\\]': '<span class="ac-highlight">Rp 35.000.000</span>'
        };

        for (const [key, value] of Object.entries(replacements)) {
            text = text.replace(new RegExp(key, 'g'), value);
        }

        // Handle newlines
        let formattedText = text.replace(/\n/g, '<br>');
        waPreviewDir.innerHTML = formattedText + '<span class="wa-time">10:42 <i class="fas fa-check-double" style="color: #53bdeb;"></i></span>';
    }

    if (waMessageDir) {
        waMessageDir.addEventListener('input', updatePreviewDirect);
        csNameDir?.addEventListener('input', updatePreviewDirect);
        defaultGreetDir?.addEventListener('input', updatePreviewDirect);

        // Initial setup for preview
        waMessageDir.value = "Assalamualaikum [sapaan] [nama], perkenalkan saya [namacs] dari Munira Travel. \n\nIzin konfirmasi untuk pendaftaran program [detailprogram] dengan nominal [nominal]. \n\nBagaimana kabarnya hari ini [sapaan]?";
        setTimeout(updatePreviewDirect, 500); // Slight delay for setup
    }

    window.insertVarDirect = function (val) {
        if (!waMessageDir) return;
        const start = waMessageDir.selectionStart;
        const end = waMessageDir.selectionEnd;
        waMessageDir.value = waMessageDir.value.substring(0, start) + val + waMessageDir.value.substring(end);
        waMessageDir.focus();
        waMessageDir.selectionStart = waMessageDir.selectionEnd = start + val.length;
        updatePreviewDirect();
    };

    window.saveTemplateDirect = function () {
        const name = document.getElementById('templateName_direct')?.value;
        if (!name) {
            alert('Silakan isi nama template terlebih dahulu.');
            return;
        }
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#ffffff', '#d4af37']
        });
        alert('Template "' + name + '" berhasil disimpan secara cloud!');
    };

    // --- AI ASSISTANT TONE LOGIC ---
    const aiMessages = {
        spiritual: {
            badge: "✨ SPIRITUAL TONE",
            text: "Assalamu'alaikum Bapak Ahmad 🌙, <br>Alhamdulillah, kami sangat bahagia menerima niat mulia Bapak untuk menuju Baitullah bersama keluarga tahun ini. Insya Allah, kami siap mendampingi setiap langkah ibadah Bapak dengan segenap hati..."
        },
        professional: {
            badge: "💼 PROFESSIONAL TONE",
            text: "Selamat pagi Bapak Ahmad, <br>Konfirmasi pendaftaran Umrah Anda telah kami terima. Berkas administrasi dan jadwal keberangkatan sedang kami proses secara resmi. Tim konsultan kami akan memandu Anda melalui seluruh prosedur teknis keberangkatan..."
        },
        urgent: {
            badge: "🔥 URGENT / SCARCITY",
            text: "Halo Bapak Ahmad, <br>Mohon segera mengamankan kuota Anda! Saat ini sisa kursi untuk program pilihan Bapak hanya tersisa 3 slot lagi. Segera konfirmasi pembayaran untuk memastikan keberangkatan Anda di jadwal ini agar tidak terlewat..."
        }
    };

    let aiTypingTimer = null;
    window.typeAIText = function (text, targetId, callback) {
        const target = document.getElementById(targetId);
        if (!target) return;
        if (aiTypingTimer) clearTimeout(aiTypingTimer);

        target.innerHTML = "";
        let i = 0;
        function type() {
            if (i < text.length) {
                if (text.charAt(i) === '<') {
                    // Handle small tags like <br>
                    const end = text.indexOf('>', i);
                    if (end !== -1) {
                        target.innerHTML += text.substring(i, end + 1);
                        i = end + 1;
                    } else { target.innerHTML += text.charAt(i); i++; }
                } else {
                    target.innerHTML += text.charAt(i);
                    i++;
                }
                aiTypingTimer = setTimeout(type, 30);
            } else {
                target.innerHTML += '<span class="typing-cursor"></span>';
                if (callback) callback();
            }
        }
        type();
    };

    window.switchAITone = function (toneType) {
        const badge = document.getElementById('aiActiveToneBadge');
        const messageBox = document.getElementById('aiMessagePreview');
        const btns = document.querySelectorAll('.tone-btn');

        if (!badge || !messageBox || !aiMessages[toneType]) return;

        // Visual feedback for buttons
        btns.forEach(b => b.classList.remove('active'));
        const activeBtn = Array.from(btns).find(b => b.innerText.toLowerCase().includes(toneType));
        if (activeBtn) activeBtn.classList.add('active');

        // Smooth transition for content
        gsap.to(messageBox, {
            opacity: 0, y: 10, duration: 0.3, onComplete: () => {
                badge.innerText = aiMessages[toneType].badge;
                window.typeAIText(aiMessages[toneType].text, 'aiMessagePreview');
                gsap.to(messageBox, { opacity: 1, y: 0, duration: 0.3 });
            }
        });
    };

    // Mobile Menu Logic
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a, .sticky-bottom-nav .nav-item');

    menuToggle?.addEventListener('click', () => {
        mobileMenu?.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    const closeMobileMenu = () => {
        mobileMenu?.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeMenu?.addEventListener('click', closeMobileMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

    // Connect All Toggles (Desktop & Mobile)
    const handleLangToggle = () => {
        const currentLang = localStorage.getItem('munira-lang') || 'id';
        setLanguage(currentLang === 'id' ? 'en' : 'id');
    };

    const handleThemeToggle = () => {
        const currentTheme = localStorage.getItem('munira-theme') || 'light';
        setTheme(currentTheme === 'light' ? 'dark' : 'light');
    };

    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
        btn.addEventListener('click', handleLangToggle);
    });

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            handleThemeToggle();
            gsap.from(btn, { scale: 0.8, rotation: -90, duration: 0.5, ease: "back.out(2)" });
        });
    });


    // Sticky Nav Active State on Scroll (Enhanced)
    const sections = ['home', 'interest', 'problem', 'pricing'];
    const navItems = document.querySelectorAll('.sticky-bottom-nav .nav-item');

    window.addEventListener('scroll', () => {
        let current = "";
        sections.forEach(s => {
            const section = document.getElementById(s);
            if (section) {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = s;
                }
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    window.activateAIAssistant = function () {
        const section = document.getElementById('wa-builder-section');
        const assistant = document.getElementById('aiAssistantTrigger');

        if (!assistant || !section) return;

        // Scroll to section
        section.scrollIntoView({ behavior: 'smooth' });

        // Reveal assistant with animation
        setTimeout(() => {
            assistant.style.display = 'block';
            gsap.fromTo(assistant, { opacity: 0, y: 100, scale: 0.8 }, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                ease: "back.out(2)"
            });

            // Start with spiritual tone
            window.switchAITone('spiritual');

            // Subtle pulse to get attention
            gsap.to(assistant, {
                boxShadow: "0 0 40px rgba(13, 92, 75, 0.4)",
                duration: 1,
                repeat: 3,
                yoyo: true
            });
        }, 500);
    };
});
