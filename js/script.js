document.addEventListener('DOMContentLoaded', () => {
    // Current Year for Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Sticky Header
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const mobileIcon = mobileBtn.querySelector('i');

    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if (navLinks.classList.contains('active')) {
            mobileIcon.classList.replace('fa-bars', 'fa-xmark');
        } else {
            mobileIcon.classList.replace('fa-xmark', 'fa-bars');
        }
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileIcon.classList.replace('fa-xmark', 'fa-bars');
        });
    });

    // Number Counter Animation
    const counters = document.querySelectorAll('.counter');
    const floatCounters = document.querySelectorAll('.counter-float');
    const speed = 200; // lower is slower

    // Intersection Observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const runCounter = (counter, isFloat = false) => {
        const target = +counter.getAttribute('data-target');
        const count = isFloat ? parseFloat(counter.innerText) : +counter.innerText;
        const inc = target / speed;

        if (count < target) {
            if (isFloat) {
                counter.innerText = (count + Math.max(0.1, inc)).toFixed(1);
            } else {
                counter.innerText = Math.ceil(count + inc);
            }
            setTimeout(() => runCounter(counter, isFloat), 20);
        } else {
            counter.innerText = isFloat ? target.toFixed(1) : target;
        }
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => runCounter(counter, false));
                floatCounters.forEach(counter => runCounter(counter, true));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const trustSection = document.querySelector('.trust-signals');
    if (trustSection) {
        counterObserver.observe(trustSection);
    }

    // Patient Stories Slider
    const slider = document.getElementById('reviewsSlider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (slider && prevBtn && nextBtn) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let autoPlayInterval;

        // Auto-scroll function
        const startAutoPlay = () => {
            autoPlayInterval = setInterval(() => {
                const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
                if (slider.scrollLeft >= maxScrollLeft - 10) { // If at the end, jump back to start
                    slider.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    slider.scrollBy({ left: 324, behavior: 'smooth' }); // Scroll by one card width (roughly)
                }
            }, 5000); // 5 seconds
        };

        const stopAutoPlay = () => clearInterval(autoPlayInterval);

        // Navigation Buttons
        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -324, behavior: 'smooth' });
            stopAutoPlay();
            startAutoPlay();
        });

        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: 324, behavior: 'smooth' });
            stopAutoPlay();
            startAutoPlay();
        });

        // Pause on Hover
        slider.addEventListener('mouseenter', stopAutoPlay);
        slider.addEventListener('mouseleave', startAutoPlay);
        prevBtn.addEventListener('mouseenter', stopAutoPlay);
        nextBtn.addEventListener('mouseenter', stopAutoPlay);

        // Touch/Mouse Dragging (Optional but good for swiping)
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.scrollBehavior = 'auto'; // Disable smooth scroll while dragging
            slider.style.scrollSnapType = 'none'; // Disable snapping while dragging
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            stopAutoPlay();
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.scrollBehavior = 'smooth';
            slider.style.scrollSnapType = 'x mandatory';
            startAutoPlay();
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.scrollBehavior = 'smooth';
            slider.style.scrollSnapType = 'x mandatory';
            startAutoPlay();
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast multiplier
            slider.scrollLeft = scrollLeft - walk;
        });

        // Start Auto Play Initially
        startAutoPlay();
    }

    // Appointment Modal Logic
    const modal = document.getElementById('appointmentModal');
    const openBtns = document.querySelectorAll('.appointment-trigger');
    const closeBtn = document.getElementById('closeModalBtn');
    const form = document.getElementById('appointmentForm');

    if (modal && openBtns.length > 0 && closeBtn && form) {
        // Open Modal
        openBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');

                // Close mobile menu if open when booking
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileIcon.classList.replace('fa-xmark', 'fa-bars');
                }
            });
        });

        // Close Modal via X Button
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Close Modal via Background Click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Handle Form Submission (WhatsApp Redirect)
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('userName').value.trim();
            const phone = document.getElementById('userPhone').value.trim();
            const service = document.getElementById('userService').value;

            if (name && phone && service) {
                const phoneNumber = '919235460024'; // Updated Clinic WhatsApp Number
                const message = `Hello, I would like to book a consultation at Skin Mantraa.\n\nName: ${name}\nPhone: ${phone}\nService: ${service}`;
                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

                // Open WhatsApp in a new tab
                window.open(whatsappUrl, '_blank');

                // Reset form and close modal
                form.reset();
                modal.classList.remove('active');
            }
        });
    }
});
