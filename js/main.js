// ===== Navigation scroll effect =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Active nav highlighting =====
const sections = document.querySelectorAll('section[id]');
const navLinkItems = document.querySelectorAll('.nav-link');

function highlightNav() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinkItems.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
}
window.addEventListener('scroll', highlightNav);
highlightNav();

// ===== Mobile menu toggle =====
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
    body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
        body.style.overflow = '';
    });
});

// ===== Scroll reveal animations =====
const revealElements = document.querySelectorAll('.section-label, .section-title, .about-text, .about-cards, .stat, .cap-card, .service-card, .research-item, .research-note, .collaborate-text, .collaborate-box, .contact-info, .contact-form');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('active');
            }, (index % 6) * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ===== Contact form (EmailJS) =====
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const submitBtn = contactForm.querySelector('button[type="submit"]');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    const params = {
        from_name: data.name || '',
        from_email: data.email || '',
        subject: data.subject || 'Project Inquiry',
        message: data.message || ''
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    formSuccess.textContent = '';
    formSuccess.classList.remove('error');

    emailjs.send('service_nlwyopq', 'template_jgql5np', params)
        .then(() => {
            formSuccess.textContent = 'Message sent! I\'ll get back to you soon.';
            formSuccess.classList.remove('error');
            formSuccess.classList.add('success');
            contactForm.reset();
        })
        .catch((err) => {
            console.error('Contact form error:', err);
            formSuccess.textContent = 'Something went wrong. Please email me directly.';
            formSuccess.classList.add('error');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        });
});

// ===== Pricing / buy buttons =====
// Until real Stripe links exist, placeholder links (containing "test_")
// fall back to the contact form with the product pre-filled.
function prefillContact(subject) {
    const subjectField = document.getElementById('subject');
    if (subjectField && subject) subjectField.value = subject;
    const contact = document.getElementById('contact');
    if (contact) contact.scrollIntoView({ behavior: 'smooth' });
    const formSuccess = document.getElementById('form-success');
    if (formSuccess) {
        formSuccess.textContent = 'Secure card checkout is being set up — send this and I\u2019ll reply with a payment link today.';
        formSuccess.classList.remove('error');
    }
    setTimeout(() => { const n = document.getElementById('name'); if (n) n.focus(); }, 600);
}

document.querySelectorAll('.buy').forEach((a) => {
    a.addEventListener('click', (e) => {
        const href = a.getAttribute('href') || '';
        const isPlaceholder = href.includes('test_') || href.includes('buy.stripe.com/test');
        const isAnchor = href.startsWith('#');
        if (isPlaceholder) {
            e.preventDefault();
            prefillContact(a.dataset.fallback || a.dataset.subject || '');
        } else if (isAnchor && a.dataset.subject) {
            // service "Get this" buttons: prefill subject, let it scroll
            setTimeout(() => prefillContact(a.dataset.subject), 200);
        }
    });
});

// ===== Live QR demo (client-side, no backend needed) =====
(function () {
    const btn = document.getElementById('qr-make');
    const input = document.getElementById('qr-input');
    const preview = document.getElementById('qr-preview');
    if (!btn || !input || !preview) return;

    function makeQR() {
        const text = input.value.trim();
        if (!text) return;
        if (typeof QRCode === 'undefined') {
            preview.innerHTML = '<p class="api-hint">QR library still loading\u2026 try again in a second.</p>';
            return;
        }
        preview.innerHTML = '';
        try {
            // qrcodejs renders an <img> (or canvas) into the element
            const box = document.createElement('div');
            box.className = 'qr-box';
            preview.appendChild(box);
            new QRCode(box, {
                text: text,
                width: 176,
                height: 176,
                colorDark: '#06060f',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.M
            });
            const cap = document.createElement('p');
            cap.className = 'qr-caption';
            cap.textContent = 'Generated for: ' + (text.length > 42 ? text.slice(0, 42) + '…' : text);
            preview.appendChild(cap);
        } catch (err) {
            preview.innerHTML = '<p class="api-hint">Could not generate that QR.</p>';
        }
    }
    btn.addEventListener('click', makeQR);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); makeQR(); } });
    // draw one on load after the QR lib is ready
    window.addEventListener('load', () => setTimeout(makeQR, 300));
})();
