/* Hero phone ONLY. Match the simulated messaging header to the active carousel slide.
   Existing landing.js controls the carousel and stays completely unchanged. */
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var phone = document.querySelector('.hero-visual .hero-phone-mockup');
        var carousel = document.getElementById('adCarousel');
        var name = document.getElementById('prf-chat-name');
        var subtitle = document.getElementById('prf-chat-subtitle');
        var avatar = document.getElementById('prf-chat-avatar');
        if (!phone || !carousel || !name || !subtitle || !avatar) return;
        function syncFromActiveSlide() {
            var active = carousel.querySelector('.ad-slide.active:not(.leaving)') || carousel.querySelector('.ad-slide.active');
            if (!active) return;
            name.textContent = active.getAttribute('data-brand') || 'Business chat';
            subtitle.textContent = active.getAttribute('data-chat-type') || 'Business chat · RCS';
            avatar.textContent = active.getAttribute('data-initial') || '•';
            phone.dataset.chatIndex = active.getAttribute('data-chat-color') || 'shop';
        }
        syncFromActiveSlide();
        var observer = new MutationObserver(syncFromActiveSlide);
        Array.prototype.forEach.call(carousel.querySelectorAll('.ad-slide'), function (slide) {
            observer.observe(slide, { attributes: true, attributeFilter: ['class'] });
        });
    });
})();

/* Showcase-only actions. Original landing.js remains unchanged: its carousel
   timer and dot events are still the single source of truth for navigation. */
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var carousel = document.getElementById('adCarousel');
        var toast = document.getElementById('prf-action-toast');
        if (!carousel || !toast) return;
        var clearToast;
        function announce(message) {
            toast.textContent = message;
            toast.classList.add('visible');
            clearTimeout(clearToast);
            clearToast = setTimeout(function () { toast.classList.remove('visible'); }, 2000);
        }
        carousel.addEventListener('click', function (event) {
            var dismiss = event.target.closest('.ad-dismiss');
            if (dismiss) {
                var active = dismiss.closest('.ad-slide');
                if (!active || !active.classList.contains('active') || active.classList.contains('leaving')) return;
                var slides = Array.prototype.slice.call(carousel.querySelectorAll('.ad-slide'));
                var index = slides.indexOf(active);
                var nextDot = document.querySelector('#adDots .ad-dot[data-index="' + ((index + 1) % slides.length) + '"]');
                if (nextDot) nextDot.click();
                return;
            }
            var btn = event.target.closest('.ad-actions .chat-btn');
            if (btn) {
                var slide = btn.closest('.ad-slide');
                if (!slide || !slide.classList.contains('active') || slide.classList.contains('leaving')) return;
                // No commercial, banking or booking backend is connected to this page.
                announce('Demo preview · ' + btn.textContent.trim() + ' selected');
                var activeIndex = Array.prototype.indexOf.call(carousel.querySelectorAll('.ad-slide'), slide);
                var sameDot = document.querySelector('#adDots .ad-dot[data-index="' + activeIndex + '"]');
                if (sameDot) sameDot.click(); // restart the existing autoplay timer
            }
        });
    });
})();
