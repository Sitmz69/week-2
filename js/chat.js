(function() {
    'use strict';

    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const chatWindow = document.getElementById('chatWindow');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatCloseBtn = document.getElementById('chatCloseBtn');
    const chatClearBtn = document.getElementById('chatClearBtn');
    const chatBadge = document.getElementById('chatBadge');

    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    let isOpen = false;
    let unreadCount = 0;

    const botResponses = [
        {
            keywords: ['привет', 'здравствуй', 'добрый', 'хай', 'hello', 'hi'],
            response: 'Здравствуйте! 👋 Чем могу помочь?'
        },
        {
            keywords: ['услуг', 'ремонт', 'диагност', 'чистк', 'обслужив'],
            response: 'У нас есть:\n• Диагностика — от 50руб\n• Ремонт — от 120руб\n• Чистка — от 90руб\n• Обслуживание — от 100руб\n\nЧто вас интересует?'
        },
        {
            keywords: ['товар', 'купить', 'диск', 'видеокарт', 'плат', 'память', 'термопаст'],
            response: 'В наличии:\n• Жёсткий диск Samsung 1TB — 250руб\n• Термопаста MX-6 — 40руб\n• Оперативная память Kingston 16Gb — 125руб\n• Видеокарта Nvidia — 1250руб\n• Материнская плата Asus B650 — 850руб\n\nЧто нужно?'
        },
        {
            keywords: ['цен', 'стоим', 'прайс', 'скольк', 'дорог', 'дёшев'],
            response: '💰 Цены:\n\nУслуги:\n• Диагностика — от 50руб\n• Ремонт — от 120руб\n• Чистка — от 90руб\n\nТовары:\n• Термопаста — от 40руб\n• Видеокарта — до 1250руб'
        },
        {
            keywords: ['контакт', 'телефон', 'email', 'адрес', 'почт', 'позвон', 'написат'],
            response: '📞 Контакты:\n\n• Телефон: +375(25)755-хх-хх (24/7)\n• Email: servers@gmail.com\n• Адрес: ул.Пушкина д.32'
        },
        {
            keywords: ['помощ', 'помог', 'что уме', 'возможн'],
            response: 'Я могу рассказать:\n💻 — об услугах\n🛒 — о товарах\n💰 — о ценах\n📞 — о контактах\n\nПросто спросите!'
        },
        {
            keywords: ['спасиб', 'благодар'],
            response: 'Пожалуйста! 😊 Если будут ещё вопросы — обращайтесь!'
        },
        {
            keywords: ['пока', 'до свидани', 'до встреч'],
            response: 'До свидания! 👋 Хорошего дня!'
        }
    ];

    const defaultResponse = 'Извините, я не совсем понял. 🤔 Попробуйте спросить об услугах, товарах, ценах или контактах.';

    function addMessage(text, type) {
        const messageEl = document.createElement('div');
        messageEl.classList.add('message', `message-${type}`);
        messageEl.textContent = text;
        chatMessages.appendChild(messageEl);
        scrollToBottom();

        chatHistory.push({ text, type, time: Date.now() });
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getBotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        for (const item of botResponses) {
            for (const keyword of item.keywords) {
                if (lowerMessage.includes(keyword)) {
                    return item.response;
                }
            }
        }

        return defaultResponse;
    }

    function showTyping() {
        const typingEl = document.createElement('div');
        typingEl.classList.add('typing-indicator');
        typingEl.id = 'typingIndicator';
        typingEl.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
        chatMessages.appendChild(typingEl);
        scrollToBottom();
    }

    function hideTyping() {
        const typingEl = document.getElementById('typingIndicator');
        if (typingEl) typingEl.remove();
    }

    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';
        chatInput.style.height = 'auto';

        showTyping();
        const delay = Math.random() * 700 + 800; 
        setTimeout(() => {
            hideTyping();
            const botResponse = getBotResponse(text);
            addMessage(botResponse, 'bot');


            if (!isOpen) {
                unreadCount++;
                updateBadge();
            }
        }, delay);
    }

    function updateBadge() {
        if (unreadCount > 0) {
            chatBadge.textContent = unreadCount;
            chatBadge.style.display = 'flex';
        } else {
            chatBadge.style.display = 'none';
        }
    }

    function openChat() {
        isOpen = true;
        chatWindow.classList.add('chat-open');
        unreadCount = 0;
        updateBadge();
        chatInput.focus();
        scrollToBottom();
    }

    function closeChat() {
        isOpen = false;
        chatWindow.classList.remove('chat-open');
    }

    function clearHistory() {
        chatHistory = [];
        localStorage.removeItem('chatHistory');
        chatMessages.innerHTML = '';
        addMessage('История очищена. Чем могу помочь?', 'bot');
    }

    function renderHistory() {
        chatMessages.innerHTML = '';
        if (chatHistory.length === 0) {
            addMessage('Привет! 👋 Я чат-помощник. Спросите об услугах, товарах, ценах или контактах.', 'bot');
        } else {
            chatHistory.forEach(msg => {
                const messageEl = document.createElement('div');
                messageEl.classList.add('message', `message-${msg.type}`);
                messageEl.textContent = msg.text;
                chatMessages.appendChild(messageEl);
            });
            scrollToBottom();
        }
    }

    function autoResize() {
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
    }

    chatToggleBtn.addEventListener('click', () => {
        if (isOpen) {
            closeChat();
        } else {
            openChat();
        }
    });

    chatCloseBtn.addEventListener('click', closeChat);
    chatClearBtn.addEventListener('click', clearHistory);

    chatSendBtn.addEventListener('click', sendMessage);

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    chatInput.addEventListener('input', autoResize);

    renderHistory();
})();
