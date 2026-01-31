const axios = require('axios');

module.exports = async (req, res) => {
  console.log('🎯 API send.js ВЫЗВАН');
  
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const token = process.env.TELEGRAM_TOKEN || process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;
    
    console.log('✅ Переменные загружены');

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
    
    const response = await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: text
    });

    console.log('✅ УСПЕХ!');
    return res.status(200).json({ 
      success: true, 
      message: '✅ Заявка успешно отправлена!' 
    });

  } catch (error) {
    console.log('💥 ОШИБКА:', error.message);
    return res.status(500).json({ 
      success: false, 
      error: 'Ошибка: ' + error.message 
    });
  }
};