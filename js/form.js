// ================= НАСТРОЙКИ =================
const API_URL = '/api/send'; // Путь к API на Vercel

// ================= ВАЛИДАЦИЯ ТЕЛЕФОНА =================
function validatePhone(phone) {
    const phoneRegex = /^(\+38|38|0)?\d{9}$/;
    const cleanedPhone = phone.replace(/\D/g, '');
    return phoneRegex.test(cleanedPhone) && cleanedPhone.length >= 9;
}

// ================= УПРАВЛЕНИЕ МОДАЛКОЙ =================
function openModal() {
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('contactModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.getElementById('contactModal').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('contactForm').reset();
    // Сбрасываем стили валидации
    document.getElementById('phoneGroup').classList.remove('error', 'success');
    document.getElementById('phoneError').style.display = 'none';
}

// ================= ОСНОВНАЯ ФУНКЦИЯ =================
function initContactForm() {
    const contactBtn = document.getElementById('contactBtn');
    const closeBtn = document.getElementById('closeModal');
    const overlay = document.getElementById('modalOverlay');
    const form = document.getElementById('contactForm');
    
    if (!contactBtn || !form) {
        console.warn('Не найдены элементы формы');
        return;
    }
    
    // Открытие модалки по кнопке
    contactBtn.addEventListener('click', openModal);
    
    // Закрытие модалки
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
    
    // Закрытие по клавише ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
    
    // Валидация телефона в реальном времени
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            const phone = e.target.value;
            const phoneGroup = document.getElementById('phoneGroup');
            const phoneError = document.getElementById('phoneError');
            
            if (phone === '') {
                phoneGroup.classList.remove('error', 'success');
                phoneError.style.display = 'none';
                return;
            }
            
            if (validatePhone(phone)) {
                phoneGroup.classList.remove('error');
                phoneGroup.classList.add('success');
                phoneError.style.display = 'none';
            } else {
                phoneGroup.classList.remove('success');
                phoneGroup.classList.add('error');
                phoneError.style.display = 'block';
            }
        });
    }
    
    // Обработка отправки формы
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Собираем данные формы
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            service: document.getElementById('service').value,
            budget: document.getElementById('budget').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        console.log('📤 Данные формы:', formData);
        
        // Валидация обязательных полей
        if (!formData.name || !formData.phone || !formData.service) {
            alert('❌ Заполните обязательные поля: имя, телефон и тип проекта');
            return;
        }
        
        // Валидация телефона
        if (!validatePhone(formData.phone)) {
            alert('❌ Введите корректный номер телефона (+38 XXX XXX XX XX)');
            return;
        }
        
        // Блокируем кнопку отправки
        const submitBtn = form.querySelector('.btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        submitBtn.disabled = true;
        
        try {
            // Отправка данных на API (рабочая версия для Vercel)
            console.log('📡 Отправка на API:', API_URL);
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            console.log('📨 Ответ API:', data);
            
            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }
            
            if (data.success) {
                alert('✅ Заявка успешно отправлена!');
                closeModal(); // Закрываем модалку после успешной отправки
            } else {
                throw new Error(data.error || 'Неизвестная ошибка API');
            }
            
        } catch (error) {
            console.error('💥 Ошибка отправки:', error);
            
            // Пользовательские сообщения об ошибках
            if (error.message.includes('404')) {
                alert('❌ API не настроен. Нужно добавить файл api/send.js на Vercel');
            } else if (error.message.includes('Failed to fetch')) {
                alert('❌ Ошибка сети. Проверьте подключение к интернету');
            } else {
                alert(`❌ Ошибка: ${error.message}`);
            }
        } finally {
            // Восстанавливаем кнопку в исходное состояние
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

// ================= ЗАПУСК ФОРМЫ =================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
} else {
    initContactForm();
}