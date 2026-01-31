// api/send.js - используем axios как в Aphrodite
const axios = require('axios');

module.exports = async (req, res) => {
  console.log('🎯 API send.js ВЫЗВАН');
  
  try {
    // Разрешаем CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Используем TELEGRAM_TOKEN и CHAT_ID - те имена, которые у вас уже есть в Vercel
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.CHAT_ID;
    
    console.log('✅ Переменные загружены');

    // Проверяем наличие переменных
    if (!token || !chatId) {
      console.error('❌ TELEGRAM_TOKEN или CHAT_ID не установлены');
      return res.status(500).json({ 
        success: false, 
        error: 'Server configuration error - check environment variables' 
      });
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

    console.log('📤 Отправляем в Telegram через axios...');
    
    // Отправляем через axios как в Aphrodite
    const response = await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: text
    });

    console.log('✅ УСПЕХ! Ответ Telegram:', response.data);
    
    if (response.data.ok) {
      return res.status(200).json({ 
        success: true, 
        message: '✅ Заявка успешно отправлена!' 
      });
    } else {
      throw new Error(response.data.description || 'Ошибка Telegram API');
    }

  } catch (error) {
    console.log('💥 ОШИБКА:', error.message);
    
    // Детализируем ошибку для отладки
    let errorMessage = 'Ошибка: ' + error.message;
    
    if (error.response) {
      // Ошибка от Telegram API
      console.log('Данные ошибки:', error.response.data);
      errorMessage = `Telegram API error: ${error.response.data.description || 'Unknown error'}`;
    } else if (error.request) {
      // Не удалось отправить запрос
      errorMessage = 'Не удалось подключиться к Telegram API';
    }
    
    return res.status(500).json({ 
      success: false, 
      error: errorMessage 
    });
  }
};