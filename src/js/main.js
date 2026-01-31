// Smooth scroll for anchors
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(link.getAttribute('href'))
            ?.scrollIntoView({ behavior: 'smooth' });
    });
});

// Placeholder for Telegram form
document.querySelector('.btn')?.addEventListener('click', () => {
    alert('Форма заявки будет подключена через Telegram Bot');
});
