document.addEventListener('DOMContentLoaded', () => {
    const faqList = document.querySelector('.faq-list');
    if (!faqList) return; // Evita errores si el HTML aún no está cargado

    const allowMultipleOpen = false; // Cambia a true si quieres abrir varias preguntas a la vez

    const openItem = (item) => {
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!btn || !answer) return;
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
    };

    const closeItem = (item) => {
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!btn || !answer) return;
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
    };

    // Inicializa los elementos FAQ
    faqList.querySelectorAll('.faq-item').forEach(item => {
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!btn || !answer) return;

        btn.type = 'button';
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', `faq-${Math.random().toString(36).substring(2, 8)}`);
        answer.style.maxHeight = null;
    });

    // Listener de clics
    faqList.addEventListener('click', e => {
        const btn = e.target.closest('.faq-question');
        if (!btn) return;

        const item = btn.closest('.faq-item');
        if (!item) return;

        const isActive = item.classList.contains('active');

        if (!allowMultipleOpen) {
            faqList.querySelectorAll('.faq-item.active').forEach(openItemEl => {
                if (openItemEl !== item) closeItem(openItemEl);
            });
        }

        if (isActive) {
            closeItem(item);
        } else {
            openItem(item);
        }
    });
});

// Cambiar el estilo de la barra de navegación al hacer scroll para que no se sobreponga con el contenido
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar-center');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
