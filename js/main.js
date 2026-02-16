document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');
    const icon = mobileToggle ? mobileToggle.querySelector('.material-icons') : null;

    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', () => {
            nav.classList.toggle('active');

            // Toggle Icon
            if (nav.classList.contains('active')) {
                if (icon) icon.textContent = 'close';
                document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
            } else {
                if (icon) icon.textContent = 'menu';
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !mobileToggle.contains(e.target) && nav.classList.contains('active')) {
                nav.classList.remove('active');
                if (icon) icon.textContent = 'menu';
                document.body.style.overflow = '';
            }
        });
    }

    // Form Handling (Mock)
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic Validation Check (Browser handles 'required' mostly)
            const inputs = form.querySelectorAll('input, textarea, select');
            let isValid = true;

            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '#ddd';
                }
            });

            if (isValid) {
                // Simulate submission
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.textContent;

                btn.textContent = 'Sending...';
                btn.disabled = true;

                setTimeout(() => {
                    alert('Thank you! Your message has been sent successfully.');
                    form.reset();
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 1500);
            }
        });
    });

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    if (icon) icon.textContent = 'menu';
                    document.body.style.overflow = '';
                }

                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Parallax scroll handler
    // Usage: add `data-parallax-speed="0.2"` to any element to move it at that speed.
    // For background images add the class `parallax-bg` and `data-parallax-speed`.
    (function initParallax() {
        if (typeof window === 'undefined') return;

        // Disable on coarse pointers (mobile) for performance and UX
        if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;

        const parallaxEls = Array.from(document.querySelectorAll('[data-parallax-speed]'));
        if (!parallaxEls.length) return;

        let ticking = false;

        function update() {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;

            parallaxEls.forEach(el => {
                const speed = parseFloat(el.dataset.parallaxSpeed) || 0.25;

                // If element is a background parallax, adjust background-position
                if (el.classList.contains('parallax-bg')) {
                    const yPos = Math.round((scrollY - el.offsetTop) * speed);
                    el.style.backgroundPosition = `center ${yPos}px`;
                } else {
                    // Translate element vertically for smooth parallax
                    const y = Math.round((scrollY - el.offsetTop) * speed);
                    el.style.transform = `translateY(${y}px)`;
                }
            });

            ticking = false;
        }

        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', () => { window.requestAnimationFrame(update); }, { passive: true });

        // Initial update
        window.requestAnimationFrame(update);
    })();

    // Reveal on scroll (intersection observer) + trigger on click
    (function initReveal() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const revealSelector = '[data-reveal], .reveal';
        const revealEls = Array.from(document.querySelectorAll(revealSelector));
        if (!revealEls.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.12
        };

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const el = entry.target;
                if (entry.isIntersecting) {
                    const delay = parseFloat(el.dataset.revealDelay) || 0;
                    el.style.transitionDelay = `${delay}s`;
                    el.classList.add('in-view');
                    // once revealed, unobserve to avoid repeated work
                    io.unobserve(el);
                }
            });
        }, observerOptions);

        revealEls.forEach(el => io.observe(el));

        // Also trigger reveal for anchors: when an anchor link is clicked, reveal children inside the target
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', (e) => {
                const href = a.getAttribute('href');
                if (!href || href === '#') return;
                const target = document.querySelector(href);
                if (!target) return;

                // Find revealable elements within the target and force reveal
                const inside = Array.from(target.querySelectorAll(revealSelector));
                inside.forEach((el, i) => {
                    const delay = parseFloat(el.dataset.revealDelay) || (i * 0.08);
                    el.style.transitionDelay = `${delay}s`;
                    el.classList.add('in-view');
                    io.unobserve(el);
                });
            });
        });
    })();
});
