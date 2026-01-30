const fetch = require('node-fetch');

module.exports = async (req, res) => {
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

    try {
        const { name, email, phone, service, budget, message } = req.body;

        if (!name || !phone || !service) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const BOT_TOKEN = process.env.BOT_TOKEN;
        const CHAT_ID = process.env.CHAT_ID;

        if (!BOT_TOKEN || !CHAT_ID) {
            console.error('BOT_TOKEN or CHAT_ID is not set');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const text = `Новая заявка с сайта:
Имя: ${name}
Телефон: ${phone}
Email: ${email || 'не указан'}
Тип проекта: ${service}
Бюджет: ${budget || 'не указан'}
Сообщение: ${message || 'нет'}`;

        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
                parse_mode: 'HTML',
            }),
        });

        const data = await response.json();

        if (data.ok) {
            res.status(200).json({ success: true, message: 'Заявка отправлена' });
        } else {
            console.error('Telegram API error:', data);
            res.status(500).json({ error: 'Failed to send message to Telegram' });
        }
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};