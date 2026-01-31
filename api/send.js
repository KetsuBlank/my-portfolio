const fetch = require('node-fetch');

module.exports = async (req, res) => {
    console.log('🎯 API send.js ВЫЗВАН');
    
    try {
        // Разрешаем CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }
        
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const token = process.env.BOT_TOKEN || process.env.TELEGRAM_TOKEN;
        const chatId = process.env.CHAT_ID;
        
        console.log('✅ Переменные загружены');

        if (!token || !chatId) {
            console.error('❌ BOT_TOKEN или CHAT_ID не установлены');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const { name, email, phone, service, budget, message } = req.body;
        console.log('📦 Данные формы:', { name, phone, service });

        const text = `
🏛️ НОВАЯ ЗАЯВКА С ПОРТФОЛИО!

Имя: ${name}
Email: ${email || 'не указано'}
Телефон: ${phone || 'не указано'}
Тип проекта: ${service}
Бюджет: ${budget || 'не указано'}
Сообщение:
${message || 'не указано'}

🕐 ${new Date().toLocaleString('ru-RU')}
        `.trim();

        console.log('📤 Отправляем в Telegram...');
        
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();
        console.log('✅ УСПЕХ!', data);

        if (data.ok) {
            return res.status(200).json({ 
                success: true, 
                message: '✅ Заявка успешно отправлена!' 
            });
        } else {
            throw new Error(data.description || 'Ошибка Telegram API');
        }

    } catch (error) {
        console.log('💥 ОШИБКА:', error.message);
        return res.status(500).json({ 
            success: false, 
            error: 'Ошибка: ' + error.message 
        });
    }
};